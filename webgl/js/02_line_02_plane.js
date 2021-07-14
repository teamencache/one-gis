let vertexStr = `
    attribute vec3 a_Position;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;
    void main(){
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * vec4(a_Position,1.0);
        // gl_Position = vec4(a_Position,1.0);
        gl_PointSize = 10.0;
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
    -5.0, 10.0, 0,
    0, 5.0, 0,
    3, -5.0, 0,
    -15, -15, 0,
    - 15, 20, 0,
    15, 5, 0,
    10, 20, 0,
    5, 20, 0,
    10, -10, 0,
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
    // gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 0);
    // gl.drawElements(gl.POINTS, offsetIndex.length, gl.UNSIGNED_BYTE, 0);
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
    document.title = '原始的线条_接点圆滑';
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

    let lineSegments = vertexData.length / size - 1;
    for (let lineIndex = 0; lineIndex < lineSegments; lineIndex++) {
        let offsets = initNormal(vertexData, lineIndex, size);
        Array.prototype.push.apply(offsetVertex, offsets);
        Array.prototype.push.apply(offsetIndex, [
            lineIndex * 4 + 0, lineIndex * 4 + 1, lineIndex * 4 + 3,
            lineIndex * 4 + 0, lineIndex * 4 + 3, lineIndex * 4 + 2
        ]);
        //交点处插入三角形
        lineIndex && initIntersection(lineIndex);
    }
}
// 沿垂直线条方向扩展出有宽度的线
function initNormal(data, lineIndex, size) {
    let vertexIndex = lineIndex * size;
    let curr = vec2.fromValues(data[vertexIndex], data[vertexIndex + 1]);
    let lineDirection = vec2.create();
    let next = vec2.fromValues(data[vertexIndex + size], data[vertexIndex + size + 1]);
    vec3.subtract(lineDirection, next, curr);

    //通过直线角度直接求
    let radianX = Math.atan2(lineDirection[1], lineDirection[0]);
    let dx1 = lineWidth / 2 * Math.cos(radianX + Math.PI / 2);
    let dy1 = lineWidth / 2 * Math.sin(radianX + Math.PI / 2);
    let dx2 = lineWidth / 2 * Math.cos(radianX - Math.PI / 2);
    let dy2 = lineWidth / 2 * Math.sin(radianX - Math.PI / 2);
    let fixedPosition = [
        curr[0] + dx1, curr[1] + dy1, 0,
        curr[0] + dx2, curr[1] + dy2, 0,
        next[0] + dx1, next[1] + dy1, 0,
        next[0] + dx2, next[1] + dy2, 0,
    ];
    return fixedPosition
}
// 交点处插入一个三角形填充
function initIntersection(lineIndex) {
    let rotateDirection = vec3.create();
    let lastIndex = (lineIndex - 1) * 4 * size;
    let lastBegin = vec2.fromValues(offsetVertex[lastIndex + 0], offsetVertex[lastIndex + 1]);
    let lastEnd = vec2.fromValues(offsetVertex[lastIndex + size * 2 + 0], offsetVertex[lastIndex + size * 2 + 1]);
    let lastParam = mat2.create();
    let lastDirection = vec2.create();
    vec2.subtract(lastDirection, lastEnd, lastBegin);

    let currIndex = lineIndex * 4 * size;
    let currBegin = vec2.fromValues(offsetVertex[currIndex + 0], offsetVertex[currIndex + 1]);
    let currEnd = vec2.fromValues(offsetVertex[currIndex + size * 2 + 0], offsetVertex[currIndex + size * 2 + 1]);
    let currParam = mat2.create();
    let currDirection = vec2.create();
    vec2.subtract(currDirection, currEnd, currBegin);

    vec2.cross(rotateDirection, lastDirection, currDirection);
    if (rotateDirection[2] < 0) {
        lastBegin = vec2.fromValues(offsetVertex[lastIndex + size + 0], offsetVertex[lastIndex + size + 1]);
        lastEnd = vec2.fromValues(offsetVertex[lastIndex + size * 2 + size + 0], offsetVertex[lastIndex + size * 2 + size + 1]);
        currBegin = vec2.fromValues(offsetVertex[currIndex + size + 0], offsetVertex[currIndex + size + 1]);
        currEnd = vec2.fromValues(offsetVertex[currIndex + size * 2 + size + 0], offsetVertex[currIndex + size * 2 + size + 1]);
    }

    // 求两条直线的交点坐标
    let intersectionVertex = mat2.create();
    switch (0) {
        case lastDirection[0]:
            currParam = caculateLineParam(currBegin, currEnd);
            intersectionVertex[0] = lastBegin[0];
            intersectionVertex[2] = currParam[1] - currParam[0] * lastBegin[0];
            break;
        case currDirection[0]:
            lastParam = caculateLineParam(lastBegin, lastEnd);
            intersectionVertex[0] = currBegin[0];
            intersectionVertex[2] = lastParam[1] - lastParam[0] * currBegin[0];
            break;
        default:
            currParam = caculateLineParam(currBegin, currEnd);
            lastParam = caculateLineParam(lastBegin, lastEnd);
            intersectionVertex[0] = (currParam[1] - lastParam[1]) / (currParam[0] - lastParam[0]);
            intersectionVertex[2] = currParam[1] - intersectionVertex[0] * currParam[0];
            break;
    }

    // 顺时针
    if (rotateDirection[2] < 0) {
        offsetVertex[currIndex + size + 0] = intersectionVertex[0];
        offsetVertex[currIndex + size + 1] = intersectionVertex[2];
        offsetVertex[lastIndex + size * 2 + size + 0] = intersectionVertex[0];
        offsetVertex[lastIndex + size * 2 + size + 1] = intersectionVertex[2];
        Array.prototype.push.apply(offsetIndex, [
            lineIndex * 4 - 2, lineIndex * 4 - 1, lineIndex * 4 + 0
        ]);
    } else {
        // 逆时针
        offsetVertex[currIndex + 0] = intersectionVertex[0];
        offsetVertex[currIndex + 1] = intersectionVertex[2];
        offsetVertex[lastIndex + size * 2 + 0] = intersectionVertex[0];
        offsetVertex[lastIndex + size * 2 + 1] = intersectionVertex[2];
        Array.prototype.push.apply(offsetIndex, [
            lineIndex * 4 - 1, lineIndex * 4, lineIndex * 4 + 1
        ]);
    }
}

// 根据两个点，计算直线的系数ax+y=b
function caculateLineParam(begin, end) {
    let paramMat = mat2.create();
    paramMat[0] = -(end[1] - begin[1]) / (end[0] - begin[0]);
    paramMat[2] = end[1] + paramMat[0] * end[0];

    console.log(paramMat);
    return vec2.fromValues(paramMat[0], paramMat[2]);
}
// 计算两个直线的交点ax+y=b;参数是vec2(a,b)
function caculateLineIntersection(begin, end) {
    let paramMat = mat2.create();
    paramMat[0] = begin[0];
    paramMat[1] = 1;
    paramMat[2] = end[0];
    paramMat[3] = 1;

    mat2.invert(paramMat, paramMat);//逆矩阵
    mat2.multiply(paramMat, paramMat, mat2.fromValues(begin[1], 0, end[1], 0));

    console.log(paramMat);
    return paramMat
}
// 根据两个点，计算直线的系数ax+by=1
function caculateLineParam_bak(begin, end) {

    let paramMat = mat2.create();
    paramMat[0] = begin[0];
    paramMat[1] = begin[1];
    paramMat[2] = end[0];
    paramMat[3] = end[1];
    switch (true) {
        case begin[0] == end[0]:
            paramMat[0] = 1 / end[0];
            paramMat[2] = 0;
            break;
        case begin[1] == end[1]:
            paramMat[0] = 0;
            paramMat[2] = 1 / end[1];
            break;
        default:
            mat2.invert(paramMat, paramMat);//逆矩阵
            mat2.multiply(paramMat, paramMat, mat2.fromValues(1, 0, 1, 0));
            break;
    }
    console.log(paramMat);
    return vec2.fromValues(paramMat[0], paramMat[2]);
}
// 计算两个直线的交点ax+by=1;参数是vec2(a,b)
function caculateLineIntersection_bak(begin, end) {
    let paramMat = mat2.create();
    paramMat[0] = begin[0];
    paramMat[1] = begin[1];
    paramMat[2] = end[0];
    paramMat[3] = end[1];
    switch (true) {
        case begin[0] == 0:
            paramMat[0] = 1 / end[0];
            paramMat[2] = 1 / begin[1];
            break;
        case begin[1] == 0:
            paramMat[0] = 1 / begin[0];
            paramMat[2] = 1 / end[1];
            break;
        case end[0] == 0:
            paramMat[0] = 1 / begin[0];
            paramMat[2] = 1 / end[1];
            break;
        case begin[1] == 0:
            paramMat[0] = 1 / end[0];
            paramMat[2] = 1 / begin[1];
            break;
        default:
            mat2.invert(paramMat, paramMat);//逆矩阵
            mat2.multiply(paramMat, paramMat, mat2.fromValues(1, 0, 1, 0));
            break;
    }

    console.log(paramMat);
    return paramMat
}