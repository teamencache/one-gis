let vertexStr = `
    attribute vec3 a_Position;
    attribute vec4 a_Color;
    attribute float a_VerticalDirect;
    attribute vec2 a_TexCoord;

    uniform mat4 u_ModelMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;

    varying float v_VerticalDirect;
    varying vec2 v_TexCoord;
    varying vec4 v_Color;

    void main(){
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * vec4(a_Position,1.0);

        v_VerticalDirect = a_VerticalDirect;
        v_TexCoord = a_TexCoord;
        v_Color = a_Color;
    }
`;

let fragmentStr = `
    precision mediump float;

    uniform float u_Time;
    uniform sampler2D u_Sampler;

    varying vec4 v_Color;
    varying vec2 v_TexCoord;
    varying float v_VerticalDirect;

    void main(){
        vec4 color = texture2D(u_Sampler, v_TexCoord);
        float texLength = length(color);
        if(texLength<=0.1){
            color = v_Color;
        }
        gl_FragColor = color;
    }
`;
let ele;
let gl, vertexShader, fragmentShader, shaderProgram;
let u_ProjectionMatrix, u_ViewMatrix, u_ModelMatrix, eye, direction, up;
let variable = {
    a_Position: {
        local: null,
        value: null
    },
    a_Color: {
        local: null,
        value: null
    },
    a_VerticalDirect: {
        local: null,
        value: null
    },
    a_TexCoord: {
        local: null,
        value: null
    },
    u_Time: {
        local: null,
        value: null
    },
    u_Sampler: {
        local: null,
        value: null
    },
    u_ProjectionMatrix: {
        local: null,
        value: null
    },
    u_ViewMatrix: {
        local: null,
        value: null
    },
    u_ModelMatrix: {
        local: null,
        value: null
    },
};

let inputData = {
    points: [0.0, 0.0, 0.0],
    width: 2.0,
    height: 3.0
};
let webglData = {
    currentAngle: [0.0, 0.0, 0.0],
    pointLength: 3,
    offsetSize: 9,//[x,y,z,faceDirect]
    vertex: [],
    index: [],
    texCoord: [],
    color: []
};

(function main() {
    initDom();
    initShader();
    initLocation();
    initVariable();
    initVertex();
    bindData();
    initTexture();
    initController();
})();

function render() {
    gl.clearColor(0, 0, 0, 1.0);
    // gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clear(gl.COLOR_BUFFEER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniform1f(variable.u_Time.local, variable.u_Time.value);
    mat4.rotateZ(variable.u_ModelMatrix.value, variable.u_ModelMatrix.value, 0.01);
    gl.uniformMatrix4fv(variable.u_ModelMatrix.local, false, variable.u_ModelMatrix.value);
    gl.drawElements(gl.TRIANGLES, webglData.index.length, gl.UNSIGNED_BYTE, 0);
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 12);
}

function animate() {
    requestAnimationFrame(animate);
    variable.u_Time.value -= 0.05;
    render();
}

function initDom() {
    ele = document.createElement('canvas');
    ele.width = window.innerWidth;
    ele.height = window.innerHeight;
    ele.style.width = ele.width + 'px';
    ele.style.height = ele.height + 'px';
    document.body.appendChild(ele);
    document.title = '商用效果_点位标记_四棱柱';
}

function initShader() {
    gl = ele.getContext('webgl');
    gl.viewport(0, 0, ele.width, ele.height);

    vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexStr);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(vertexShader));
        debugger
    }

    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentStr);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(fragmentShader));
        debugger
    }

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log(gl.getProgramInfoLog(shaderProgram));
        debugger
    }
    gl.useProgram(shaderProgram);
}

function initLocation() {
    let location = gl.getAttribLocation(shaderProgram, 'a_Position');
    variable.a_Position.local = location;

    location = gl.getAttribLocation(shaderProgram, 'a_Color');
    variable.a_Color.local = location;

    location = gl.getAttribLocation(shaderProgram, 'a_VerticalDirect');
    variable.a_VerticalDirect.local = location;

    location = gl.getAttribLocation(shaderProgram, 'a_TexCoord');
    variable.a_TexCoord.local = location;

    location = gl.getUniformLocation(shaderProgram, 'u_Time');
    variable.u_Time.local = location;

    location = gl.getUniformLocation(shaderProgram, 'u_Sampler');
    variable.u_Sampler.local = location;

    location = gl.getUniformLocation(shaderProgram, 'u_ModelMatrix');
    variable.u_ModelMatrix.local = location;

    location = gl.getUniformLocation(shaderProgram, 'u_ViewMatrix');
    variable.u_ViewMatrix.local = location;

    location = gl.getUniformLocation(shaderProgram, 'u_ProjectionMatrix');
    variable.u_ProjectionMatrix.local = location;
}

function initVariable() {

    variable.u_Time.value = 0;

    u_ModelMatrix = mat4.create();
    variable.u_ModelMatrix.value = u_ModelMatrix;
    gl.uniformMatrix4fv(variable.u_ModelMatrix.local, false, variable.u_ModelMatrix.value);

    u_ViewMatrix = mat4.create();
    eye = vec3.fromValues(0, 0, 30);
    direction = vec3.fromValues(0, 0, 0);
    up = vec3.fromValues(0, 1, 0);
    mat4.lookAt(u_ViewMatrix, eye, direction, up);
    variable.u_ViewMatrix.value = u_ViewMatrix;
    gl.uniformMatrix4fv(variable.u_ViewMatrix.local, false, variable.u_ViewMatrix.value);

    u_ProjectionMatrix = mat4.create();
    mat4.perspective(u_ProjectionMatrix, glMatrix.toRadian(75), ele.width / ele.height, 0.1, 1000);
    variable.u_ProjectionMatrix.value = u_ProjectionMatrix;
    gl.uniformMatrix4fv(variable.u_ProjectionMatrix.local, false, variable.u_ProjectionMatrix.value);

}

function initVertex() {
    let geometry = [], indexData = [], texCoord = [], normal = [];
    for (let index = 0; index < inputData.points.length; index += webglData.pointLength) {
        let xyz = [inputData.points[index], inputData.points[index + 1], inputData.points[index + 2]];
        // 要控制每个面的纹理，需要分别列出每个面的坐标
        geometry.push.apply(geometry, [
            // x,y,z,r,g,b,a,s1,t1
            xyz[0], xyz[1], xyz[2], 1.0, 0.0, 0.0, 0.6, 0.5, 0.3,
            xyz[0] + inputData.width / 2, xyz[1] - inputData.width / 2, xyz[2] + inputData.height, 0.0, 1.0, 0.0, 0.4, 1.0, 0.8,
            xyz[0] - inputData.width / 2, xyz[1] - inputData.width / 2, xyz[2] + inputData.height, 0.0, 1.0, 0.0, 0.4, 0.0, 0.8,

            xyz[0], xyz[1], xyz[2], 1.0, 0.0, 0.0, 0.6, 0.5, 0.3,
            xyz[0] + inputData.width / 2, xyz[1] + inputData.width / 2, xyz[2] + inputData.height, 0.0, 1.0, 0.0, 0.4, 1.0, 0.8,
            xyz[0] + inputData.width / 2, xyz[1] - inputData.width / 2, xyz[2] + inputData.height, 0.0, 1.0, 0.0, 0.4, 0.0, 0.8,
            xyz[0], xyz[1], xyz[2], 1.0, 0.0, 0.0, 0.6, 0.5, 0.3,
            xyz[0] - inputData.width / 2, xyz[1] + inputData.width / 2, xyz[2] + inputData.height, 0.0, 1.0, 0.0, 0.4, 0.0, 0.8,
            xyz[0] + inputData.width / 2, xyz[1] + inputData.width / 2, xyz[2] + inputData.height, 0.0, 1.0, 0.0, 0.4, 1.0, 0.8,

            xyz[0], xyz[1], xyz[2], 1.0, 0.0, 0.0, 0.6, 0.5, 0.3,
            xyz[0] - inputData.width / 2, xyz[1] - inputData.width / 2, xyz[2] + inputData.height, 0.0, 1.0, 0.0, 0.4, 1.0, 0.8,
            xyz[0] - inputData.width / 2, xyz[1] + inputData.width / 2, xyz[2] + inputData.height, 0.0, 1.0, 0.0, 0.4, 0.0, 0.8,

            xyz[0] - inputData.width / 2, xyz[1] - inputData.width / 2, xyz[2] + inputData.height, 0.0, 1.0, 0.0, 0.4, 1.0, 1.0,
            xyz[0] + inputData.width / 2, xyz[1] - inputData.width / 2, xyz[2] + inputData.height, 0.0, 1.0, 0.0, 0.4, 1.0, 1.0,
            xyz[0] + inputData.width / 2, xyz[1] + inputData.width / 2, xyz[2] + inputData.height, 0.0, 1.0, 0.0, 0.4, 1.0, 1.0,

            xyz[0] - inputData.width / 2, xyz[1] - inputData.width / 2, xyz[2] + inputData.height, 0.0, 1.0, 0.0, 0.4, 1.0, 1.0,
            xyz[0] + inputData.width / 2, xyz[1] + inputData.width / 2, xyz[2] + inputData.height, 0.0, 1.0, 0.0, 0.4, 1.0, 1.0,
            xyz[0] - inputData.width / 2, xyz[1] + inputData.width / 2, xyz[2] + inputData.height, 0.0, 1.0, 0.0, 0.4, 1.0, 1.0,
        ]);
        let startIndex = index * 5;
        indexData.push.apply(indexData, [
            startIndex + 0, startIndex + 1, startIndex + 2,
            startIndex + 3, startIndex + 4, startIndex + 5,
            startIndex + 6, startIndex + 7, startIndex + 8,
            startIndex + 9, startIndex + 10, startIndex + 11,
            /* startIndex + 12, startIndex + 13, startIndex + 14,
            startIndex + 15, startIndex + 16, startIndex + 17, */
        ]);
        // 这里和在顶点中直接写纹理坐标是一样的，分别控制每个面的纹理
        texCoord.push.apply(texCoord, [
            /*  0.5, 0.4, 1.0, 0.5, 0.0, 0.5,
             0.0, 0.5, 1.0, 0.8, 0.0, 0.8,
              0.0, 0.5, 1.0, 0.8, 0.0, 0.8,
             0.0, 0.5, 1.0, 0.8, 0.0, 0.8,
             0.0, 0.5, 1.0, 0.8, 0.0, 0.8,
             0.5, 0.2, 0.6, 0.2, 0.4, 0.2,
             0.5, 0.2, 0.6, 0.2, 0.4, 0.2, */
        ]);
        normal.push.apply(normal, [

        ])
    }
    webglData.vertex = geometry;
    webglData.index = indexData;
    webglData.texCoord = texCoord;
}

function initTexture() {
    let texture = gl.createTexture();
    if (!texture) {
        debugger
        console.log('sampler init failed');
    }
    variable.u_Sampler.value = texture;
    let image = new Image();
    image.onload = function () {
        variable.u_Sampler.image = image;
        loadTexture(texture, variable.u_Sampler.local, image);
    };
    image.src = '../images/渐变色1.jpg';
}

function loadTexture(texture, u_Sampler, image) {

    // 对纹理图形进行y轴反转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    // 开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0);

    // 向target绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // 配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    //处理图片像素非2的幂次方的配置
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // 配置纹理对象
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // 将0号纹理单元传递给取样器变量
    gl.uniform1i(u_Sampler, 0);

    animate();

}

function bindData() {
    let vertexData = new Float32Array(webglData.vertex);
    let vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('vertexBuffer failed');
    }
    let FSIZE = vertexData.BYTES_PER_ELEMENT;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
    gl.vertexAttribPointer(variable.a_Position.local, 3, gl.FLOAT, false, FSIZE * webglData.offsetSize, 0);
    gl.enableVertexAttribArray(variable.a_Position.local);

    gl.vertexAttribPointer(variable.a_Color.local, 4, gl.FLOAT, false, FSIZE * webglData.offsetSize, FSIZE * 3);
    gl.enableVertexAttribArray(variable.a_Color.local);

    gl.vertexAttribPointer(variable.a_TexCoord.local, 2, gl.FLOAT, false, FSIZE * webglData.offsetSize, FSIZE * 7);
    gl.enableVertexAttribArray(variable.a_TexCoord.local);

    let indexData = new Uint8Array(webglData.index);
    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);

    /* let texCoordData = new Float32Array(webglData.texCoord);
    let texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoordData, gl.STATIC_DRAW);

    gl.vertexAttribPointer(variable.a_TexCoord.local, 2, gl.FLOAT, false, FSIZE * 2, 0);
    gl.enableVertexAttribArray(variable.a_TexCoord.local); */
}

function initController() {
    let angles = [0, 0, 0];
    let lastEvt;
    let dragging = false;
    let rate = 2000;
    let u_ModelMatrix = variable.u_ModelMatrix;

    document.onwheel = function (evt) {
        mat4.translate(u_ModelMatrix.value, u_ModelMatrix.value, vec3.fromValues(0.0, 0.0, -evt.deltaY * 0.004));
        gl.uniformMatrix4fv(u_ModelMatrix.local, false, u_ModelMatrix.value);
    }

    document.onmousedown = function (evt) {
        evt.preventDefault();
        lastEvt = evt;
        dragging = true;
    };
    document.onmouseup = function (evt) {
        evt.preventDefault();
        lastEvt = evt;
        dragging = false;
    };
    document.onmousemove = function (evt) {
        evt.preventDefault();
        if (!dragging) {
            return
        }
        let dx = evt.clientX - lastEvt.clientX;
        let dy = evt.clientY - lastEvt.clientY;
        angles[0] += dx / rate * 3.14 / 180;
        angles[1] += dy / rate * 3.14 / 180;

        mat4.rotateX(u_ModelMatrix.value, u_ModelMatrix.value, angles[0]);
        mat4.rotateY(u_ModelMatrix.value, u_ModelMatrix.value, angles[1]);

        gl.uniformMatrix4fv(u_ModelMatrix.local, false, u_ModelMatrix.value);

        lastEvt = evt;
    }
}
