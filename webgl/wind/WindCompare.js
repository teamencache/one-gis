
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);

    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader));
    }

    return shader;
}

 function createProgram(gl, vertexSource, fragmentSource) {
    const program = gl.createProgram();

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program));
    }

    const wrapper = {program: program};

    const numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < numAttributes; i++) {
        const attribute = gl.getActiveAttrib(program, i);
        wrapper[attribute.name] = gl.getAttribLocation(program, attribute.name);
    }
    const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < numUniforms; i++) {
        const uniform = gl.getActiveUniform(program, i);
        wrapper[uniform.name] = gl.getUniformLocation(program, uniform.name);
    }

    return wrapper;
}

 function createTexture(gl, filter, data, width, height) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    if (data instanceof Uint8Array) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    } else {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
    }
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
}

 function bindTexture(gl, texture, unit) {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
}

 function createBuffer(gl, data, type) {
    const buffer = gl.createBuffer();
    if (typeof type == 'undefined') {
      type = gl.ARRAY_BUFFER;
    }
    gl.bindBuffer(type, buffer);
    gl.bufferData(type, data, gl.STATIC_DRAW);
    return buffer;
  }
  
function bindAttribute(gl, buffer, attribute, attribLength, groupLength, start, size) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(attribute);
    if (size) {
      gl.enableVertexAttribArray(attribute);
      /* eslint-disable-next-line */
          gl.vertexAttribPointer(attribute, attribLength, gl.FLOAT, false, groupLength * size, start * size);
    } else {
      gl.vertexAttribPointer(attribute, attribLength, gl.FLOAT, false, 0, 0);
    }
  }
/*  function createBuffer(gl, data) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return buffer;
}

 function bindAttribute(gl, buffer, attribute, numComponents) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, numComponents, gl.FLOAT, false, 0, 0);
} */

 function bindFramebuffer(gl, framebuffer, texture) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    if (texture) {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    }
}

var drawVert = `
precision mediump float;

attribute float a_index;

uniform sampler2D u_particles;
uniform float u_particles_res;
uniform mat4 u_mvpMatrix; 

varying vec2 v_particle_pos;

void main() {
    vec4 color = texture2D(u_particles, vec2(
        fract(a_index / u_particles_res),
        floor(a_index / u_particles_res) / u_particles_res));

    // decode current particle position from the pixel's RGBA value
    v_particle_pos = vec2(
        color.r / 255.0 + color.b,
        color.g / 255.0 + color.a);

    gl_PointSize = 1.0;
    // gl_Position = u_mvpMatrix * vec4((2.0 * v_particle_pos.x - 1.0 + 1.0) / 2.,  1.0 -  (1.0+1.0 - 2.0 * v_particle_pos.y) / 2., 0.0, 1);
    gl_Position = vec4( v_particle_pos.x, v_particle_pos.y, 0.0, 1);
}`;

var drawFrag = `
precision mediump float;

uniform sampler2D u_wind;
uniform vec2 u_wind_min;
uniform vec2 u_wind_max;
uniform sampler2D u_color_ramp;

varying vec2 v_particle_pos;

void main() {
    vec2 velocity = mix(u_wind_min, u_wind_max, texture2D(u_wind, v_particle_pos).rg);
    float speed_t = length(velocity) / length(u_wind_max);

    // color ramp is encoded in a 16x16 texture
    vec2 ramp_pos = vec2(
        fract(16.0 * speed_t),
        floor(16.0 * speed_t) / 16.0);

    gl_FragColor = texture2D(u_color_ramp, ramp_pos);
}`

var quadVert = `
precision mediump float;

attribute vec2 a_pos;

varying vec2 v_tex_pos;

void main() {
    v_tex_pos = a_pos;
    //将纹理坐标转换为顶点坐标
    gl_Position = vec4(1.0 - 2.0 * a_pos, 0, 1);
}`

var screenFrag =`
precision mediump float;

uniform sampler2D u_screen;
uniform float u_opacity;

varying vec2 v_tex_pos;

void main() {
    vec4 color = texture2D(u_screen, 1.0 - v_tex_pos);
    // a hack to guarantee opacity fade out even with a value close to 1.0
    gl_FragColor = vec4(floor(255.0 * color * u_opacity) / 255.0);
}`

var updateFrag = `
precision highp float;

uniform sampler2D u_particles;
uniform sampler2D u_wind;
uniform vec2 u_wind_res;
uniform vec2 u_wind_min;
uniform vec2 u_wind_max;
uniform float u_rand_seed;
uniform float u_speed_factor;
uniform float u_drop_rate;
uniform float u_drop_rate_bump;

varying vec2 v_tex_pos;

// pseudo-random generator 伪随机数生成器
const vec3 rand_constants = vec3(12.9898, 78.233, 4375.85453);
float rand(const vec2 co) {
    float t = dot(rand_constants.xy, co);
    return fract(sin(t) * (rand_constants.z + t));
}

// wind speed lookup; use manual bilinear filtering based on 4 adjacent pixels for smooth interpolation
// 使用基于4个相邻像素的手动双线性滤波进行平滑插值
vec2 lookup_wind(const vec2 uv) {
    // return texture2D(u_wind, uv).rg; // lower-res hardware filtering
    vec2 px = 1.0 / u_wind_res;//vec2(wind.width, wind.height)
    vec2 vc = (floor(uv * u_wind_res)) * px;// 按比例将uv对应到u_wind的对应纹理位置
    vec2 f = fract(uv * u_wind_res);//线性混合系数
    vec2 tl = texture2D(u_wind, vc).rg;
    vec2 tr = texture2D(u_wind, vc + vec2(px.x, 0)).rg;//右移一格
    vec2 bl = texture2D(u_wind, vc + vec2(0, px.y)).rg;//下移一格
    vec2 br = texture2D(u_wind, vc + px).rg;//右下移一格
    return mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);
}

void main() {
    vec4 color = texture2D(u_particles, v_tex_pos);
    vec2 pos = vec2(
        color.r / 255.0 + color.b,
        color.g / 255.0 + color.a); // decode particle position from pixel RGBA

    vec2 velocity = mix(u_wind_min, u_wind_max, lookup_wind(pos));
    float speed_t = length(velocity) / length(u_wind_max);

    // take EPSG:4236 distortion into account for calculating where the particle moved
    // 在计算粒子移动的位置时，将EPSG:4236畸变考虑在内 
    float distortion = cos(radians(pos.y * 180.0 - 90.0));
    vec2 offset = vec2(velocity.x / distortion, -velocity.y) * 0.0001 * u_speed_factor;

    // update particle position, wrapping around the date line
    // 更新粒子位置，环绕日期线
    pos = fract(1.0 + pos + offset);

    // a random seed to use for the particle drop
    // 用于粒子下落的随机种子
    vec2 seed = (pos + v_tex_pos) * u_rand_seed;

    // drop rate is a chance a particle will restart at random position, to avoid degeneration
    float drop_rate = u_drop_rate + speed_t * u_drop_rate_bump;
    float drop = step(1.0 - drop_rate, rand(seed));

    vec2 random_pos = vec2(
        rand(seed + 1.3),
        rand(seed + 2.1));
    pos = mix(pos, random_pos, drop);

    // encode the new particle position back into RGBA
    gl_FragColor = vec4(
        fract(pos * 255.0),
        floor(pos * 255.0) / 255.0);
}`

var rectVert =  `
precision mediump float;

attribute vec3 a_pos;
attribute vec2 a_uv;

uniform mat4 u_mvpMatrix; 

varying vec2 v_uv;

void main(){
    gl_Position = u_mvpMatrix * vec4(a_pos, 1.0);
    v_uv = a_uv;
}
`
var rectFrag =`
precision highp float; 

varying vec2 v_uv; 
uniform float u_opacity;
uniform sampler2D u_sampler2D;

void main(){ 
  vec4 color = texture2D(u_sampler2D, v_uv);
  gl_FragColor = vec4(floor(255.0 * color * u_opacity) / 255.0);
}
`

const defaultRampColors = {
    0.0: '#3288bd',
    0.1: '#66c2a5',
    0.2: '#abdda4',
    0.3: '#e6f598',
    0.4: '#fee08b',
    0.5: '#fdae61',
    0.6: '#f46d43',
    1.0: '#d53e4f',
  };
  
  class MyWind {
    constructor(gl,bbox) {
      console.log('-');
      this.gl = gl;
  
      // this.fadeOpacity = 0.99; //  0.996; // how fast the particle trails fade on each frame
      // this.speedFactor = 0.25; // how fast the particles move
      // this.dropRate = 0.003; // how often the particles move to a random place
      // this.dropRateBump = 0.01; // drop rate increase relative to individual particle speed
      this.fadeOpacity = 0.996; //  0.996; // how fast the particle trails fade on each frame
		this.speedFactor = 0.25; // how fast the particles move
		this.dropRate = 0.01; // how often the particles move to a random place
		this.dropRateBump = 0.02; // drop rate increase relative to individual particle speed

    
      //从位置纹理中绘制粒子
      this.drawProgram = util.createProgram(gl, drawVert, drawFrag);
      //绘制纹理
      this.screenProgram = util.createProgram(gl, quadVert, screenFrag);
      //更新位置纹理
      this.updateProgram = util.createProgram(gl, quadVert, updateFrag);
      // 绘制到指定矩形范围
      this.rectProgram = util.createProgram(gl, rectVert, rectFrag);
  
      this.quadBuffer = util.createBuffer(gl, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]));
      this.framebuffer = gl.createFramebuffer();
      this.setColorRamp(defaultRampColors);
      this.resize(bbox);
    }
  
    resize(bbox) {
      const gl = this.gl;
      const pxRatio = Math.max(Math.floor(window.devicePixelRatio) || 1, 2);
      /* gl.canvas.width = gl.canvas.clientWidth * pxRatio;
      gl.canvas.height = gl.canvas.clientHeight * pxRatio; */
      const emptyPixels = new Uint8Array(gl.canvas.width * gl.canvas.height * 4);
      // screen textures to hold the drawn screen for the previous and the current frame
      this.backgroundTexture = util.createTexture(
        gl,
        gl.NEAREST,
        emptyPixels,
        gl.canvas.width,
        gl.canvas.height
      );
      this.screenTexture = util.createTexture(
        gl,
        gl.NEAREST,
        emptyPixels,
        gl.canvas.width,
        gl.canvas.height
      );
      this.bbox = bbox;
      this.initRect();
    }
  
    set numParticles(numParticles) {
      const gl = this.gl;
  
      // we create a square texture where each pixel will hold a particle position encoded as RGBA
      const particleRes = (this.particleStateResolution = Math.ceil(Math.sqrt(numParticles)));
      this._numParticles = particleRes * particleRes;
  
      const particleState = new Uint8Array(this._numParticles * 4);
      for (let i = 0; i < particleState.length; i++) {
        particleState[i] = Math.floor(Math.random() * 256); // randomize the initial particle positions
      }
      // textures to hold the particle state for the current and the next frame
      this.particleStateTexture0 = util.createTexture(
        gl,
        gl.NEAREST,
        particleState,
        particleRes,
        particleRes
      );
      this.particleStateTexture1 = util.createTexture(
        gl,
        gl.NEAREST,
        particleState,
        particleRes,
        particleRes
      );
  
      const particleIndices = new Float32Array(this._numParticles);
      for (let i = 0; i < this._numParticles; i++) particleIndices[i] = i;
      this.particleIndexBuffer = util.createBuffer(gl, particleIndices);
    }
  
    get numParticles() {
      return this._numParticles;
    }
  
    setWind(windData) {
      this.windData = windData;
      this.windTexture = util.createTexture(this.gl, this.gl.LINEAR, windData.image);
    }
     get numParticles() {
      return this._numParticles;
    }
    draw(mvpMatrix, gl) {
      gl = gl || this.gl;
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.STENCIL_TEST);
  
      util.bindTexture(gl, this.windTexture, 0);
      util.bindTexture(gl, this.particleStateTexture0, 1);
  
      this.drawScreen(mvpMatrix);
      this.updateParticles();
    }
  
    drawScreen(mvpMatrix) {
      const gl = this.gl;
      // draw the screen into a temporary framebuffer to retain it as the background on the next frame
      util.bindFramebuffer(gl, this.framebuffer, this.screenTexture);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
      this.drawTexture(this.backgroundTexture, this.fadeOpacity);
      this.drawParticles(mvpMatrix);
  
      util.bindFramebuffer(gl, null);
  
      // enable blending to support drawing on top of an existing background (e.g. a map)
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      // this.drawTexture(this.screenTexture, 1.0);
      this.drawRect(mvpMatrix);
      gl.disable(gl.BLEND);
      // save the current screen as the background for the next frame
      const temp = this.backgroundTexture;
      this.backgroundTexture = this.screenTexture;
      this.screenTexture = temp;
    }
  
    drawTexture(texture, opacity) {
      const gl = this.gl;
      const program = this.screenProgram;
      gl.useProgram(program.program);
  
      util.bindAttribute(gl, this.quadBuffer, program.a_pos, 2);
      util.bindTexture(gl, texture, 2);
      gl.uniform1i(program.u_screen, 2);
      gl.uniform1f(program.u_opacity, opacity);
  
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  
    drawParticles(mvpMatrix) {
      const gl = this.gl;
      const program = this.drawProgram;
      gl.useProgram(program.program);
  
      util.bindAttribute(gl, this.particleIndexBuffer, program.a_index, 1);
      util.bindTexture(gl, this.colorRampTexture, 2);
  
      gl.uniform1i(program.u_wind, 0);
      gl.uniform1i(program.u_particles, 1);
      gl.uniform1i(program.u_color_ramp, 2);
  
      gl.uniform1f(program.u_particles_res, this.particleStateResolution);
      gl.uniform2f(program.u_wind_min, this.windData.uMin, this.windData.vMin);
      gl.uniform2f(program.u_wind_max, this.windData.uMax, this.windData.vMax);

      gl.uniformMatrix4fv(program.u_mvpMatrix, false, mvpMatrix);
  
      gl.drawArrays(gl.POINTS, 0, this._numParticles);
    }
  
    updateParticles() {
      const gl = this.gl;
      util.bindFramebuffer(gl, this.framebuffer, this.particleStateTexture1);
      gl.viewport(0, 0, this.particleStateResolution, this.particleStateResolution);
  
      const program = this.updateProgram;
      gl.useProgram(program.program);
  
      util.bindAttribute(gl, this.quadBuffer, program.a_pos, 2);
  
      gl.uniform1i(program.u_wind, 0);
      gl.uniform1i(program.u_particles, 1);
  
      gl.uniform1f(program.u_rand_seed, Math.random());
      gl.uniform2f(program.u_wind_res, this.windData.width, this.windData.height);
      gl.uniform2f(program.u_wind_min, this.windData.uMin, this.windData.vMin);
      gl.uniform2f(program.u_wind_max, this.windData.uMax, this.windData.vMax);
      gl.uniform1f(program.u_speed_factor, this.speedFactor);
      gl.uniform1f(program.u_drop_rate, this.dropRate);
      gl.uniform1f(program.u_drop_rate_bump, this.dropRateBump);
  
      gl.drawArrays(gl.TRIANGLES, 0, 6);
  
      // swap the particle state textures so the new one becomes the current one
      const temp = this.particleStateTexture0;
      this.particleStateTexture0 = this.particleStateTexture1;
      this.particleStateTexture1 = temp;
    }

    initRect() {
      let gl = this.gl;
      const bbox = this.bbox;
      const program = this.rectProgram;
      gl.useProgram(program.program);
      this.rectVertexData = new Float32Array([
        /* eslint-disable-next-line */
          0,0,0,0,0,
          1,0,0,1,0,
          0,1,0,0,1,
          0,1,0,0,1,
          1,0,0,1,0,
          1,1,0,1,1,
      ]);
      if(this.bbox){
        this.rectVertexData = new Float32Array([
        /* eslint-disable-next-line */
            bbox._sw.x, bbox._sw.y,0,0,0,
            bbox._ne.x, bbox._sw.y,0,1,0,
            bbox._sw.x, bbox._ne.y,0,0,1,
            bbox._sw.x, bbox._ne.y,0,0,1,
            bbox._ne.x, bbox._sw.y,0,1,0,
            bbox._ne.x, bbox._ne.y,0, 1,1
        ])
      }
      this.byteSize = this.rectVertexData.BYTES_PER_ELEMENT;
      this.vertexBuffer = util.createBuffer(gl, this.rectVertexData, gl.ARRAY_BUFFER);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    }
    drawRect(mvpMatrix) {
      let gl = this.gl;
      let program = this.rectProgram;
      gl.useProgram(program.program);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      util.bindTexture(gl, this.screenTexture, 2);
      gl.uniform1i(program.u_sampler2D, 2);
      gl.uniformMatrix4fv(program.u_mvpMatrix, false, mvpMatrix);
      gl.uniform1f(program.u_opacity, 1.0);
      util.bindAttribute(gl, this.vertexBuffer, program.a_pos, 3, 5, 0, this.byteSize);
      util.bindAttribute(gl, this.vertexBuffer, program.a_uv, 2, 5, 3, this.byteSize);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  
    initRect_bak() {
      let gl = this.gl;
      const program = this.rectProgram;
      gl.useProgram(program.program);
      this.rectVertexData = new Float32Array([
        /* eslint-disable-next-line */
          -1,-1,0,0,0,
          1,-1,0,1,0,
          -1,1,0,0,1,
          1,1,0,1,1,
      ]);
      if(this.bbox){
        this.rectVertexData = new Float32Array([
        /* eslint-disable-next-line */
            bbox._sw.x, bbox._sw.y,0,0,0,
            bbox._ne.x, bbox._sw.y,0,1,0,
            bbox._sw.x, bbox._ne.y,0,0,1,
            bbox._ne.x, bbox._ne.y,0,1,1
        ])
      }
      let indexData = new Int8Array([0, 1, 2, 2, 1, 3]);
      this.indexData = indexData;
      this.vertexSize = 5;
      this.byteSize = this.rectVertexData.BYTES_PER_ELEMENT;
      this.vertexBuffer = util.createBuffer(gl, this.rectVertexData, gl.ARRAY_BUFFER);
      this.indexBuffer = util.createBuffer(gl, indexData, gl.ELEMENT_ARRAY_BUFFER);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    }
    drawRect_bak(mvpMatrix) {
      let gl = this.gl;
      let program = this.rectProgram;
      gl.useProgram(program.program);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      util.bindTexture(gl, this.screenTexture, 2);
      gl.uniform1i(program.u_sampler2D, 2);
      gl.uniformMatrix4fv(program.u_mvpMatrix, false, mvpMatrix);
      util.bindAttribute(gl, this.vertexBuffer, program.a_pos, 3, 5, 0, this.byteSize);
      util.bindAttribute(gl, this.vertexBuffer, program.a_uv, 2, 5, 3, this.byteSize);
      gl.drawElements(gl.TRIANGLES, this.indexData.length, gl.UNSIGNED_BYTE, 0);
    }
  
    setColorRamp(colors) {
      // lookup texture for colorizing the particles according to their speed
      this.colorRampTexture = util.createTexture(
        this.gl,
        this.gl.LINEAR,
        this.getColorRamp(colors),
        16,
        16
      );
    }
  
    getColorRamp(colors) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      canvas.width = 256;
      canvas.height = 1;
  
      const gradient = ctx.createLinearGradient(0, 0, 256, 0);
      for (const stop in colors) {
        gradient.addColorStop(+stop, colors[stop]);
      }
  
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 1);
  
      return new Uint8Array(ctx.getImageData(0, 0, 256, 1).data);
    }
  
    animate() {
      requestAnimationFrame(() => {
        this.animate();
      });
      this.draw();
    }
  }
  
  export default MyWind;
  
