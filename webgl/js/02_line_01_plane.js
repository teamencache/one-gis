let vertexStr = `
    attribute vec3 a_Position;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;
    void main(){
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * vec4(a_Position,1.0);
        // gl_Position = vec4(a_Position,1.0);
        gl_PointSize = 100.0;
    }
`;

let fragmentStr = `
    precision mediump float;
    void main(){
        gl_FragColor = vec4(0,1.0,0,1.0);
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

let size = 3;
let lineWidth = 4;
let offsetVertex = [];
let offsetIndex = [];
let vertexData = [
    -10.0, 0.0, 0,
    0, 10.0, 0,
    10.0, -5.0, 0,
    -15, -10, 0,
    - 20, 20, 0,
    0, 20, 0,
];

(function main() {
    initDom();
    initShader();
    initLocation();
    initVariable();
    initVertex();
    initEvent();
    animate();
})();

function render() {
    gl.clearColor(0, 0, 0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFEER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, offsetIndex.length, gl.UNSIGNED_BYTE, 0);
}

function animate() {
    // requestAnimationFrame(animate);
    render();
}

function initDom() {
    ele = document.createElement('canvas');
    ele.width = window.innerWidth;
    ele.height = window.innerHeight;
    ele.style.width = ele.width + 'px';
    ele.style.height = ele.height + 'px';
    document.body.appendChild(ele);
    document.title = '史上最原始的线条';
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

    location = gl.getUniformLocation(shaderProgram, 'u_ModelMatrix');
    variable.u_ModelMatrix.local = location;

    location = gl.getUniformLocation(shaderProgram, 'u_ViewMatrix');
    variable.u_ViewMatrix.local = location;

    location = gl.getUniformLocation(shaderProgram, 'u_ProjectionMatrix');
    variable.u_ProjectionMatrix.local = location;
}

function initVariable() {

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
    initLinePlaneVertex();
    let vertexData = new Float32Array(offsetVertex);
    let vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('vertexBuffer failed');
    }
    let FSIZE = vertexData.BYTES_PER_ELEMENT;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
    gl.vertexAttribPointer(variable.a_Position.local, 3, gl.FLOAT, false, FSIZE * 3, 0);
    gl.enableVertexAttribArray(variable.a_Position.local);

    let indexData = new Uint8Array(offsetIndex);
    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);
}

function initEvent() {

}


function initLinePlaneVertex() {

    let index;//顶点索引
    let seg = 0;//线段索引
    for (index = 0; index < vertexData.length - size; index += size) {
        let offsets = initNormal(vertexData, index, size);
        Array.prototype.push.apply(offsetVertex, offsets);
        Array.prototype.push.apply(offsetIndex, [
            index + seg + 0, index + seg + 1, index + seg + 3,
            index + seg + 0, index + seg + 3, index + seg + 2,
        ]);
        seg++;
    }
}

function initNormal(data, index, size) {
    let curr = vec2.fromValues(data[index], data[index + 1]);
    let next;
    if ((index + size + size) > data.length) {
        next = vec2.fromValues(data[index - size], data[index - size + 1]);
    } else {
        next = vec2.fromValues(data[index + size], data[index + size + 1]);
    }
    let lineDirection = vec2.create();
    vec3.subtract(lineDirection, next, curr);
    let fix = 1;
    // 统一到正方向
    if (lineDirection[1] * lineDirection[0] < 0) {
        fix = -1;
    }
    let verticalDirection = vec2.fromValues(-lineDirection[1], lineDirection[0]);
    let radianX = Math.atan(Math.abs(verticalDirection[1] / verticalDirection[0]));
    let dy = lineWidth / 2 * Math.sin(radianX);
    let dx = lineWidth / 2 * Math.cos(radianX);
    let fixedPosition = [
        curr[0] - fix * dx, curr[1] + dy, 0,
        curr[0] + fix * dx, curr[1] - dy, 0,
        next[0] - fix * dx, next[1] + dy, 0,
        next[0] + fix * dx, next[1] - dy, 0
    ];
    return fixedPosition
}