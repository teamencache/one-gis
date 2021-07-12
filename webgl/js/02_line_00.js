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
    gl.drawElements(gl.LINE_STRIP, 3, gl.UNSIGNED_BYTE, 0);

    /* gl.vertexAttrib1fv(variable.a_Position.local, vec3.fromValues(0, 0, 0));
    gl.drawArrays(gl.POINTS, 0, 1); */
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function initDom() {
    ele = document.createElement('canvas');
    ele.width = window.innerWidth;
    ele.height = window.innerHeight;
    ele.style.width = ele.width + 'px';
    ele.style.height = ele.height + 'px';
    document.body.appendChild(ele);
    document.title = '最基础的线条';
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
    eye = vec3.fromValues(0, 0, 10);
    direction = vec3.fromValues(0, 0, 0);
    up = vec3.fromValues(0, 1, 0);
    mat4.lookAt(u_ViewMatrix, eye, direction, up);
    variable.u_ViewMatrix.value = u_ViewMatrix;
    gl.uniformMatrix4fv(variable.u_ViewMatrix.local, false, variable.u_ViewMatrix.value);

    u_ProjectionMatrix = mat4.create();
    mat4.perspective(u_ProjectionMatrix, glMatrix.toRadian(45), ele.width / ele.height, 0.1, 1000);
    variable.u_ProjectionMatrix.value = u_ProjectionMatrix;
    gl.uniformMatrix4fv(variable.u_ProjectionMatrix.local, false, variable.u_ProjectionMatrix.value);

}

function initVertex() {

    let vertexData = new Float32Array([
        -1.0, -1.0, 0,
        0, 1.0, 0,
        1.0, -1.0, 0
    ]);
    let vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('vertexBuffer failed');
    }
    let FSIZE = vertexData.BYTES_PER_ELEMENT;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
    gl.vertexAttribPointer(variable.a_Position.local, 3, gl.FLOAT, false, FSIZE * 3, 0);
    gl.enableVertexAttribArray(variable.a_Position.local);

    let indexData = new Uint8Array([
        0, 1, 2
    ]);
    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);
}
function initEvent() {

}