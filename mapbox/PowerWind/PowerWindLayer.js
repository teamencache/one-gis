/** @format */

import {
    drawVert,
    drawFrag,
    quadVert,
    screenFrag,
    updateFrag,
    rectVert,
    rectFrag
} from './util/ShaderStr.js';

import {
    createShader,
    createProgram,
    createTexture,
    bindTexture,
    createBuffer,
    bindAttribute,
    bindAttribute2,
    bindFramebuffer
} from './util/ShaderUtil.js';
import { decodeWindHead, formatWindJson } from './util/PowerFormater.js';
import ImageUtil from './util/ImageUtil.js';


export default function PowerWindLayer(option) {
    this.debug = false;
    this.id = option.id;
    this.type = 'custom';
    this.renderingMode = '3d';
    this.MercatorCoordinate = null; //mapboxgl.MercatorCoordinate
    this.LngLat = null; // mapboxgl.LngLat
    this.defaultRampColors = {
        0.0: '#3288bd',
        0.1: '#66c2a5',
        0.2: '#abdda4',
        0.3: '#e6f598',
        0.4: '#fee08b',
        0.5: '#fdae61',
        0.6: '#f46d43',
        1.0: '#d53e4f',
    };
    // zoom:粒子系数
    this.densityMap = {
        4: 0.004,
        10: 0.001,
    };

    this.map = null;
    this.gl = null;
    this.imageUtil = new ImageUtil();

    this.fadeOpacity = 0.98; // how fast the particle trails fade on each frame
    this.speedFactor = 0.6; //0.25; // how fast the particles move
    this.dropRate = 0.01; // how often the particles move to a random place
    this.dropRateBump = 0.04; // drop rate increase relative to individual particle speed

    this.altitude = 0; //海拔
    this.windWidth = 0; //风场范围宽度
    this.windHeight = 0; //风场范围高度
    this.particleDensity = 0.004; // 粒子密度0.5 * 0.02; //
    this.numParticles = 0; // 粒子数量 = windWidth * windHeight * particleDensity
    this.windData = null; // 风场数据
    this.particleStateResolution = 0;
    this.pxRatio = Math.max(Math.floor(window.devicePixelRatio) || 1, 2);
    this.matrix = null;

    this.windBuffer = null;
    this.windBufferByte = 0;
    this.quadBuffer = null;
    this.particleIndexBuffer = null;

    this.drawProgram = null;
    this.screenProgram = null;
    this.updateProgram = null;
    this.rectProgram = null;

    this.frameBuffer = null;

    this.windTexture = null;
    this.colorRampTexture = null;
    this.screenTexture1 = null;
    this.screenTexture2 = null;
    this.particleStateTexture1 = null;
    this.particleStateTexture2 = null;

    Object.assign(this, option);
    this.resizeHandler = (e) => {
        if (e.type == 'wheel') {
            let zoom = this.map.getZoom();
            this.particleDensity = this.updateParticleDensity(zoom);
        }
        let bounds = this.map.getBounds();
        let bbox = {
            xmin: bounds._sw.lng,
            xmax: bounds._ne.lng,
            ymin: bounds._sw.lat,
            ymax: bounds._ne.lat,
        };
        this.resize(bbox);
    };
    if (this.debug) {
        console.log('PowerWindLayer');
    }
}

PowerWindLayer.prototype = {
    constructor: PowerWindLayer,
    // 初始化gl
    init(gl) {
        this.drawProgram = createProgram(gl, drawVert, drawFrag);
        this.screenProgram = createProgram(gl, quadVert, screenFrag);
        this.updateProgram = createProgram(gl, quadVert, updateFrag);
        this.rectProgram = createProgram(gl, rectVert, rectFrag);
        this.frameBuffer = gl.createFramebuffer();
        this.initColorRampTexture(this.defaultRampColors);
        /* eslint-disable */
        let vertices = [
            0, 0, 0, 0, 0,  1, 0, 0, 1, 0,  0, 1, 0, 0, 1, 
            0, 1, 0, 0, 1,  1, 0, 0, 1, 0,  1, 1, 0, 1, 1
        ];
        /* eslint-enable */
        this.quadBuffer = createBuffer(gl, new Float32Array(vertices));
    },
    // 生成色带纹理
    initColorRampTexture(colors) {
        let imageUtil = this.imageUtil;
        let imageData = imageUtil.getColorRampData(colors);
        this.colorRampTexture = createTexture(this.gl, this.gl.LINEAR, imageData, 16, 16);
    },
    // 通过插值图片设置风场数据
    setDataByImage(url) {
        let image = new Image();
        image.onload = () => {
            let imageUtil = this.imageUtil;
            let width = image.width;
            let height = image.height;
            imageUtil.setSourceImage(image);
            let context2D = imageUtil.context2D;
            context2D.drawImage(image, 0, 0);
            let headImageData = context2D.getImageData(0, 0, width, 1);
            let windData = decodeWindHead(headImageData);
            windData.width = width;
            windData.height = height - 1;
            imageUtil.canvas.height = windData.height;
            context2D.drawImage(image, 0, 1, width, height, 0, 0, width, windData.height);
            image.onload = undefined;
            image.src = imageUtil.canvas.toDataURL();
            image.height = windData.height;
            imageUtil.image = image;
            windData.image = image;
            let { xmin, xmax, ymin, ymax } = windData;
            let bbox = { xmin, xmax, ymin, ymax };
            bbox.xmin = xmax;
            bbox.xmax = xmin;
            imageUtil.initResolution(bbox);
            this.windData = windData;
            // imageUtil.showCutImage('img-now');
        };
        image.src = url;
    },
    /**
     * 设置风场数据
     * @param {*} windData {
            "width": 63,
            "height": 36,
            "uMin": -18.32,
            "uMax": 18.8,
            "vMin": -16.57,
            "vMax": 16.42,
            xmin: parseFloat(lo1),
            xmax: parseFloat(lo2),
            ymin: parseFloat(la1),
            ymax: parseFloat(la2),
        }
    */
    setData(windData) {
        this.windData = formatWindJson(windData);
        let { xmin, xmax, ymin, ymax, width, height } = this.windData;
        let bbox = { xmin, xmax, ymin, ymax };
        bbox.ymax = ymin;
        bbox.ymin = ymax;
        let size = { width, height };
        this.imageUtil.setSourceImageData(this.windData.imageData, bbox, size);
    },
    // 范围重置
    resize(bbox) {
        let imageUtil = this.imageUtil;
        if (!imageUtil.image) {
            return;
        }
        imageUtil.resize(bbox);
        let canvas = imageUtil.canvas;
        let imageData = imageUtil.context2D.getImageData(0, 0, canvas.width, canvas.height);
        this.windTexture = createTexture(
            this.gl,
            this.gl.NEAREST, //LINEAR, //this.gl.NEAREST,
            new Uint8Array(imageData.data),
            imageData.width,
            imageData.height
        );
        let rangeBbox = imageUtil.rangeBbox;
        let bounds = {
            _sw: new this.LngLat(rangeBbox.xmin, rangeBbox.ymin),
            _ne: new this.LngLat(rangeBbox.xmax, rangeBbox.ymax),
        };
        this.initWindBuffer(bounds);
        // imageUtil.showCutImage('img-now');

        this.calcParticleNum(bounds);
        this.initScreen();
        this.initParticles();
    },
    // 更新粒子密度系数
    updateParticleDensity(zoom) {
        let arrZoom = Object.keys(this.densityMap);
        let density;
        let lastZoom;
        for (let index = 0, len = arrZoom.length; index < len; index++) {
            let currZoom = arrZoom[index];
            let value2 = this.densityMap[currZoom];
            if (zoom <= currZoom) {
                let value1 = this.densityMap[lastZoom];
                if (lastZoom) {
                    density =
                        value1 - ((zoom - lastZoom) / (currZoom - lastZoom)) * (value1 - value2);
                } else {
                    density = this.densityMap[currZoom];
                }
                break;
            } else if (index == len - 1) {
                density = value2;
            } else {
                lastZoom = currZoom;
            }
        }
        return density;
    },
    // 初始化风场范围顶点缓冲
    initWindBuffer(bounds) {
        let ne = this.MercatorCoordinate.fromLngLat(bounds._ne);
        let sw = this.MercatorCoordinate.fromLngLat(bounds._sw);
        let z = ne.meterInMercatorCoordinateUnits() * this.altitude;
        /* eslint-disable */
        let vertices = [
            sw.x, sw.y, z, 0, 0, ne.x, sw.y, z, 1, 0, sw.x, ne.y, z, 0, 1,
            sw.x, ne.y, z, 0, 1, ne.x, sw.y, z, 1, 0, ne.x, ne.y, z, 1, 1
        ];
        /* eslint-enable */
        vertices = new Float32Array(vertices);
        this.windBuffer = createBuffer(this.gl, vertices);
    },
    /**
     * 根据bbox计算粒子数量
     * @param {} bbox 绘制风场的四角坐标范围
     */
    calcParticleNum(bbox) {
        let position = {
            _ne: this.map.project(bbox._ne),
            _sw: this.map.project(bbox._sw),
            _nw: this.map.project([bbox._sw.lng, bbox._ne.lat]),
            _se: this.map.project([bbox._ne.lng, bbox._sw.lat]),
        };
        let size = {
            n: this.calcScreenLength(position._ne, position._nw),
            s: this.calcScreenLength(position._sw, position._se),
            w: this.calcScreenLength(position._nw, position._sw),
            e: this.calcScreenLength(position._ne, position._se),
        };
        let sizes = [size.n, size.s, size.w, size.e].map((item) => Math.ceil(item));

        this.windWidth = sizes[0] > sizes[1] ? sizes[0] : sizes[1];
        this.windHeight = sizes[2] > sizes[3] ? sizes[2] : sizes[3];
        let numParticles = this.windWidth * this.windHeight * this.particleDensity;
        this.particleStateResolution = Math.ceil(Math.sqrt(numParticles));
        this.numParticles = this.particleStateResolution * this.particleStateResolution;
    },
    // 计算两个像素点的距离
    calcScreenLength(screenA, screenB) {
        let length = Math.sqrt(
            Math.pow(screenA.x - screenB.x, 2) + Math.pow(screenA.y - screenB.y, 2)
        );
        return Math.min(length, window.innerHeight);
    },
    // 初始化粒子位置纹理
    initParticles() {
        let gl = this.gl;
        var particleState = new Uint8Array(this.numParticles * 4);
        for (var i = 0; i < particleState.length; i++) {
            particleState[i] = Math.floor(Math.random() * 256); // randomize the initial particle positions
        }
        // textures to hold the particle state for the current and the next frame
        this.particleStateTexture1 = createTexture(
            gl,
            gl.NEAREST,
            particleState,
            this.particleStateResolution,
            this.particleStateResolution
        );
        this.particleStateTexture2 = createTexture(
            gl,
            gl.NEAREST,
            particleState,
            this.particleStateResolution,
            this.particleStateResolution
        );

        var particleIndices = new Float32Array(this.numParticles);
        for (var i$1 = 0; i$1 < this.numParticles; i$1++) {
            particleIndices[i$1] = i$1;
        }
        this.particleIndexBuffer = createBuffer(gl, particleIndices);
    },
    //屏幕纹理初始化
    initScreen() {
        let width = this.windWidth * this.pxRatio;
        let height = this.windHeight * this.pxRatio;
        var emptyPixels = new Uint8Array(width * height * 4);
        this.screenTexture1 = createTexture(this.gl, this.gl.NEAREST, emptyPixels, width, height);
        this.screenTexture2 = createTexture(this.gl, this.gl.NEAREST, emptyPixels, width, height);
    },
    // 像素尺寸对应到地图中真实大小
    getScale(mercatorCoordinate) {
        let units = mercatorCoordinate.meterInMercatorCoordinateUnits();
        let pixelsPerMeter = this.map.transform.pixelsPerMeter;
        let meter = (this.size / pixelsPerMeter) * units;
        return meter;
    },
    onAdd: function (map, gl) {
        this.map = map;
        this.gl = gl;
        this.init(gl);
        this.toggleMapEvent();
        // 必须要render中触发才行
        // this.resizeHandler({ type: 'wheel' });
    },
    // 地图事件绑定与解除
    toggleMapEvent(isRemove) {
        this.map.off('wheel', this.resizeHandler);
        // this.map.off('dragend', this.resizeHandler);
        this.map.off('move', this.resizeHandler);
        if (!isRemove) {
            this.map.on('wheel', this.resizeHandler);
            // this.map.on('dragend', this.resizeHandler);
            this.map.on('move', this.resizeHandler);
        }
    },
    onRemove: function () {
        this.toggleMapEvent(true);
        this.gl.deleteProgram(this.drawProgram);
        this.gl.deleteProgram(this.screenProgram);
        this.gl.deleteProgram(this.updateProgram);
        this.gl.deleteProgram(this.rectProgram);

        this.gl.deleteBuffer(this.windBuffer);
        this.gl.deleteBuffer(this.quadBuffer);
        this.gl.deleteBuffer(this.particleIndexBuffer);
        this.gl.deleteBuffer(this.particleIndexBuffer);

        this.gl.deleteFramebuffer(this.frameBuffer);

        this.gl.deleteTexture(this.windTexture);
        this.gl.deleteTexture(this.colorRampTexture);
        this.gl.deleteTexture(this.screenTexture1);
        this.gl.deleteTexture(this.screenTexture2);
        this.gl.deleteTexture(this.particleStateTexture1);
        this.gl.deleteTexture(this.particleStateTexture2);
    },
    render: function (gl, matrix) {
        if (!this.imageUtil.image) {
            this.map.triggerRepaint();
            return;
        }
        if (!this.windTexture) {
            this.resizeHandler({ type: 'wheel' });
        }
        this.matrix = matrix;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.disable(this.gl.STENCIL_TEST);
        // 绘制当前帧风场
        bindTexture(this.gl, this.windTexture, 0);
        bindTexture(this.gl, this.particleStateTexture1, 1);
        this.time = this.time || 0;
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.drawQuad(this.screenTexture2, 1.0);
        // 绘制下一帧背景
        this.gl.disable(this.gl.BLEND);
        let width = this.windWidth * this.pxRatio;
        let height = this.windHeight * this.pxRatio;
        bindFramebuffer(this.gl, this.frameBuffer, this.screenTexture1);
        this.gl.viewport(0, 0, width, height);
        this.drawTexture(this.screenTexture2, this.fadeOpacity);
        this.drawParticles();
        bindFramebuffer(this.gl, null);
        this.time += 1;

        let temp = this.screenTexture1;
        this.screenTexture1 = this.screenTexture2;
        this.screenTexture2 = temp;
        // 更新粒子位置
        bindFramebuffer(this.gl, this.frameBuffer, this.particleStateTexture2);
        this.gl.viewport(0, 0, this.particleStateResolution, this.particleStateResolution);
        this.updateParticles();
        bindFramebuffer(this.gl, null);
        temp = this.particleStateTexture1;
        this.particleStateTexture1 = this.particleStateTexture2;
        this.particleStateTexture2 = temp;
        // 触发重复绘制
        this.map.triggerRepaint();
    },
    // 绘制纹理
    drawTexture(texture, opacity) {
        let gl = this.gl;
        let wrapper = this.screenProgram;
        let buffer = this.quadBuffer;

        gl.useProgram(wrapper.program);
        bindTexture(gl, texture, 2);
        gl.uniform1i(wrapper.u_screen, 2);
        gl.uniform1f(wrapper.u_opacity, opacity);

        bindAttribute2(gl, buffer, wrapper.a_pos, 3, 5, 0, Float32Array.BYTES_PER_ELEMENT);
        bindAttribute2(gl, buffer, wrapper.a_tex_pos, 2, 5, 3, Float32Array.BYTES_PER_ELEMENT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
    // 绘制四边形
    drawQuad(texture, opacity) {
        let gl = this.gl;
        let wrapper = this.rectProgram;
        let buffer = this.windBuffer;

        gl.useProgram(wrapper.program);
        bindTexture(gl, texture, 2);
        gl.uniform1i(wrapper.u_screen, 2);
        gl.uniform1f(wrapper.u_opacity, opacity);
        gl.uniformMatrix4fv(wrapper.u_matrix, false, this.matrix);

        bindAttribute2(gl, buffer, wrapper.a_pos, 3, 5, 0, Float32Array.BYTES_PER_ELEMENT);
        bindAttribute2(gl, buffer, wrapper.a_tex_pos, 2, 5, 3, Float32Array.BYTES_PER_ELEMENT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
    // 绘制粒子
    drawParticles() {
        let gl = this.gl;
        let wrapper = this.drawProgram;
        gl.useProgram(wrapper.program);
        bindAttribute2(
            gl,
            this.particleIndexBuffer,
            wrapper.a_index,
            1,
            1,
            0,
            Float32Array.BYTES_PER_ELEMENT
        );
        bindTexture(gl, this.windTexture, 0);
        gl.uniform1i(wrapper.u_wind, 0);
        bindTexture(gl, this.particleStateTexture1, 1);
        gl.uniform1i(wrapper.u_particles, 1);
        bindTexture(gl, this.colorRampTexture, 2);
        gl.uniform1i(wrapper.u_color_ramp, 2);

        gl.uniform2f(wrapper.u_wind_min, this.windData.uMin, this.windData.vMin);
        gl.uniform2f(wrapper.u_wind_max, this.windData.uMax, this.windData.vMax);
        gl.uniform1f(wrapper.u_particles_res, this.particleStateResolution);
        gl.uniform1f(wrapper.u_partice_size, this.pxRatio);
        // gl.uniformMatrix4fv(wrapper.u_matrix, false, this.matrix);
        gl.drawArrays(gl.POINTS, 0, this.numParticles);
    },
    // 更新粒子
    updateParticles() {
        let gl = this.gl;
        let wrapper = this.updateProgram;
        let buffer = this.quadBuffer;
        gl.useProgram(wrapper.program);

        // bindAttribute(gl, this.quadBuffer, wrapper.a_pos, 2);
        bindAttribute2(gl, buffer, wrapper.a_pos, 3, 5, 0, Float32Array.BYTES_PER_ELEMENT);
        bindAttribute2(gl, buffer, wrapper.a_tex_pos, 2, 5, 3, Float32Array.BYTES_PER_ELEMENT);

        bindTexture(gl, this.windTexture, 0);
        gl.uniform1i(wrapper.u_wind, 0);
        bindTexture(gl, this.particleStateTexture1, 1);
        gl.uniform1i(wrapper.u_particles, 1);

        gl.uniform1f(wrapper.u_rand_seed, Math.random());
        gl.uniform2f(wrapper.u_wind_res, this.windWidth, this.windHeight);
        gl.uniform2f(wrapper.u_wind_min, this.windData.uMin, this.windData.vMin);
        gl.uniform2f(wrapper.u_wind_max, this.windData.uMax, this.windData.vMax);
        gl.uniform1f(wrapper.u_speed_factor, this.speedFactor);
        gl.uniform1f(wrapper.u_drop_rate, this.dropRate);
        gl.uniform1f(wrapper.u_drop_rate_bump, this.dropRateBump);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
};

