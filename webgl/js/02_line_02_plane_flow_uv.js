let vertexStr = `
    attribute vec3 a_Position;
    attribute float a_Length;
    attribute float a_LengthBefore;
    attribute float a_VerticalDirect;
    attribute float a_TexCoord;


    uniform mat4 u_ModelMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;

    varying float v_Length;
    varying float v_LengthBefore;
    varying float v_VerticalDirect;
    varying float v_TexCoord;

    void main(){
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * vec4(a_Position,1.0);
        // gl_Position = vec4(a_Position,1.0);
        // gl_PointSize = 10.0;
        v_Length = a_Length;
        v_LengthBefore = a_LengthBefore;
        v_VerticalDirect = a_VerticalDirect;
        v_TexCoord = a_TexCoord;
    }
`;

let fragmentStr = `
    precision mediump float;

    uniform float u_Time;
    uniform float u_TotalLength_n;
    uniform float u_TotalLength_p;

    varying float v_Length;
    varying float v_LengthBefore;
    varying float v_VerticalDirect;
    varying float v_TexCoord;

    void main(){
        float red =0.0;
        red = sin(50.0 * v_LengthBefore / u_TotalLength_p + u_Time);
        /* if(v_VerticalDirect > 0.0){
            red = sin(50.0 * v_LengthBefore / u_TotalLength_p + u_Time);
        }else{
            red = sin(50.0 * v_LengthBefore / u_TotalLength_n + u_Time);
        } */
        gl_FragColor = vec4(abs(red),1.0,0,1.0);
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
    a_Length: {
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
    a_LengthBefore: {
        local: null,
        value: null
    },
    u_TotalLength_n: {
        local: null,
        value: 0.0
    },
    u_TotalLength_p: {
        local: null,
        value: 0.0
    },
    u_Time: {
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

let pointLength = 3;
let lineWidth = 4;
let offsetSize = 7;//[x,y,z,rotateDirect,length, totalLegth,a_TexCoord]
let offsetVertex = [];
let offsetIndex = [];
let vertexData = [
    -5.0, 10.0, 0,
    0, 10.0, 0,
    0, -10.0, 0,
    10, -10, 0,
    10, 15, 0,
    -5, 15, 0,
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

    gl.uniform1f(variable.u_Time.local, variable.u_Time.value);
    gl.uniform1f(variable.u_TotalLength_n.local, variable.u_TotalLength_n.value);
    gl.uniform1f(variable.u_TotalLength_p.local, variable.u_TotalLength_p.value);

    gl.drawElements(gl.TRIANGLES, offsetIndex.length, gl.UNSIGNED_BYTE, 0);
    // gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 0);
    // gl.drawElements(gl.POINTS, offsetIndex.length, gl.UNSIGNED_BYTE, 0);
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

    location = gl.getAttribLocation(shaderProgram, 'a_Length');
    variable.a_Length.local = location;

    location = gl.getAttribLocation(shaderProgram, 'a_LengthBefore');
    variable.a_LengthBefore.local = location;

    location = gl.getAttribLocation(shaderProgram, 'a_VerticalDirect');
    variable.a_VerticalDirect.local = location;

    location = gl.getAttribLocation(shaderProgram, 'a_TexCoord');
    variable.a_TexCoord.local = location;

    location = gl.getUniformLocation(shaderProgram, 'u_TotalLength_n');
    variable.u_TotalLength_n.local = location;

    location = gl.getUniformLocation(shaderProgram, 'u_TotalLength_p');
    variable.u_TotalLength_p.local = location;

    location = gl.getUniformLocation(shaderProgram, 'u_Time');
    variable.u_Time.local = location;

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
    initLinePlaneVertex();
    let arrVertex = new Float32Array(offsetVertex);
    let vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('vertexBuffer failed');
    }
    let FSIZE = arrVertex.BYTES_PER_ELEMENT;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, arrVertex, gl.STATIC_DRAW);
    gl.vertexAttribPointer(variable.a_Position.local, 3, gl.FLOAT, false, FSIZE * offsetSize, 0);
    gl.enableVertexAttribArray(variable.a_Position.local);

    gl.vertexAttribPointer(variable.a_VerticalDirect.local, 1, gl.FLOAT, false, FSIZE * offsetSize, FSIZE * 3);
    gl.enableVertexAttribArray(variable.a_VerticalDirect.local);

    gl.vertexAttribPointer(variable.a_Length.local, 1, gl.FLOAT, false, FSIZE * offsetSize, FSIZE * 4);
    gl.enableVertexAttribArray(variable.a_Length.local);

    gl.vertexAttribPointer(variable.a_LengthBefore.local, 1, gl.FLOAT, false, FSIZE * offsetSize, FSIZE * 5);
    gl.enableVertexAttribArray(variable.a_LengthBefore.local);

    gl.vertexAttribPointer(variable.a_TexCoord.local, 1, gl.FLOAT, false, FSIZE * offsetSize, FSIZE * 6);
    gl.enableVertexAttribArray(variable.a_TexCoord.local);

    let indexData = new Uint8Array(offsetIndex);
    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);
}

function initEvent() {

}


function initLinePlaneVertex() {

    let lineSegments = vertexData.length / pointLength - 1;//最后一段线条排除
    for (let lineIndex = 0; lineIndex < lineSegments; lineIndex++) {
        let offsets = initNormal(vertexData, lineIndex, lineSegments);
        Array.prototype.push.apply(offsetVertex, offsets);
        Array.prototype.push.apply(offsetIndex, [
            lineIndex * 4 + 0, lineIndex * 4 + 1, lineIndex * 4 + 3,
            lineIndex * 4 + 0, lineIndex * 4 + 3, lineIndex * 4 + 2
        ]);
        //交点处插入三角形
        lineIndex && initIntersection(lineIndex);
    }
    for (let lineIndex = 0; lineIndex <= lineSegments; lineIndex++) {
        lineIndex && caculateLineLength(lineIndex, lineSegments);
    }
}
// 沿垂直线条方向扩展出有宽度的线
function initNormal(data, lineIndex, lineSegments) {
    let vertexIndex = lineIndex * pointLength;
    let currBegin = vec2.fromValues(data[vertexIndex], data[vertexIndex + 1]);
    let currEnd = vec2.fromValues(data[vertexIndex + pointLength], data[vertexIndex + pointLength + 1]);
    let currDirection = vec2.create();
    vec3.subtract(currDirection, currEnd, currBegin);

    let nextBegin = vec2.fromValues(data[vertexIndex + pointLength], data[vertexIndex + pointLength + 1]);
    let nextEnd = vec2.fromValues(data[vertexIndex + 2 * pointLength], data[vertexIndex + 2 * pointLength + 1]);
    let nextDirection = vec2.create();
    vec3.subtract(nextDirection, nextEnd, nextBegin);

    let rotateDirection = vec3.create();
    vec2.cross(rotateDirection, currDirection, nextDirection);
    let crossDirection = rotateDirection[3] > 0 ? 1 : -1;

    //通过直线角度直接求
    let radianX = Math.atan2(currDirection[1], currDirection[0]);
    let dx1 = lineWidth / 2 * Math.cos(radianX + Math.PI / 2);
    let dy1 = lineWidth / 2 * Math.sin(radianX + Math.PI / 2);
    let dx2 = -dx1;
    let dy2 = -dy1;
    /* let dx2 = lineWidth / 2 * Math.cos(radianX - Math.PI / 2);
    let dy2 = lineWidth / 2 * Math.sin(radianX - Math.PI / 2); */
    let fixedPosition = [//x,y,z,side,length,lengthBefore,t,s
        currBegin[0] + dx1, currBegin[1] + dy1, 0, 1.0, 0.0, 0.0, 0.0,
        currBegin[0] + dx2, currBegin[1] + dy2, 0, -1.0, 0.0, 0.0, 0.0,
        currEnd[0] + dx1, currEnd[1] + dy1, 0, 1.0, 0.0, 0.0, 0.0,
        currEnd[0] + dx2, currEnd[1] + dy2, 0, -1.0, 0.0, 0.0, 0.0,
    ];
    return fixedPosition
}
// 交点处插入一个三角形填充
function initIntersection(lineIndex) {
    let rotateDirection = vec3.create();
    let lastIndex = (lineIndex - 1) * 4 * offsetSize;
    let lastBegin = vec2.fromValues(offsetVertex[lastIndex + 0], offsetVertex[lastIndex + 1]);
    let lastEnd = vec2.fromValues(offsetVertex[lastIndex + offsetSize * 2 + 0], offsetVertex[lastIndex + offsetSize * 2 + 1]);
    let lastParam = mat2.create();
    let lastDirection = vec2.create();
    vec2.subtract(lastDirection, lastEnd, lastBegin);

    let currIndex = lineIndex * 4 * offsetSize;
    let currBegin = vec2.fromValues(offsetVertex[currIndex + 0], offsetVertex[currIndex + 1]);
    let currEnd = vec2.fromValues(offsetVertex[currIndex + offsetSize * 2 + 0], offsetVertex[currIndex + offsetSize * 2 + 1]);
    let currParam = mat2.create();
    let currDirection = vec2.create();
    vec2.subtract(currDirection, currEnd, currBegin);

    vec2.cross(rotateDirection, lastDirection, currDirection);
    let crossDirection = rotateDirection[2] > 0 ? 1 : -1;
    // crossDirection = 1;
    if (crossDirection < 0) {
        lastBegin = vec2.fromValues(offsetVertex[lastIndex + offsetSize + 0], offsetVertex[lastIndex + offsetSize + 1]);
        lastEnd = vec2.fromValues(offsetVertex[lastIndex + offsetSize * 2 + offsetSize + 0], offsetVertex[lastIndex + offsetSize * 2 + offsetSize + 1]);
        currBegin = vec2.fromValues(offsetVertex[currIndex + offsetSize + 0], offsetVertex[currIndex + offsetSize + 1]);
        currEnd = vec2.fromValues(offsetVertex[currIndex + offsetSize * 2 + offsetSize + 0], offsetVertex[currIndex + offsetSize * 2 + offsetSize + 1]);
    }

    // 求两条直线的交点坐标，区分x=a、ax+y=b两种情况
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

    if (crossDirection < 0) {// 顺时针
        offsetVertex[currIndex + offsetSize + 0] = intersectionVertex[0];
        offsetVertex[currIndex + offsetSize + 1] = intersectionVertex[2];
        offsetVertex[lastIndex + offsetSize * 2 + offsetSize + 0] = intersectionVertex[0];
        offsetVertex[lastIndex + offsetSize * 2 + offsetSize + 1] = intersectionVertex[2];
        Array.prototype.push.apply(offsetIndex, [
            lineIndex * 4 - 2, lineIndex * 4 - 1, lineIndex * 4 + 0
        ]);
    } else {// 逆时针
        offsetVertex[currIndex + 0] = intersectionVertex[0];
        offsetVertex[currIndex + 1] = intersectionVertex[2];
        offsetVertex[lastIndex + offsetSize * 2 + 0] = intersectionVertex[0];
        offsetVertex[lastIndex + offsetSize * 2 + 1] = intersectionVertex[2];
        Array.prototype.push.apply(offsetIndex, [
            // lineIndex * 4 - 1, lineIndex * 4, lineIndex * 4 + 1
            lineIndex * 4 - 2, lineIndex * 4 - 1, lineIndex * 4 + 1
        ]);
    }
}

// 根据两个点，计算直线的系数ax+y=b
function caculateLineParam(begin, end) {
    let paramMat = mat2.create();
    paramMat[0] = -(end[1] - begin[1]) / (end[0] - begin[0]);
    paramMat[2] = end[1] + paramMat[0] * end[0];
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

function caculateLineLength(lineNumber, lineSegments) {
    let nextLineStartIndex = lineNumber * 4 * offsetSize;
    let length = distanceByIndex(nextLineStartIndex - offsetSize * 1);
    variable.u_TotalLength_n.value += length;

    length = distanceByIndex(nextLineStartIndex - offsetSize * 2);
    variable.u_TotalLength_p.value += length;

    if (lineSegments <= lineNumber) {
        return
    }

    length = distanceByIndex(nextLineStartIndex);
    variable.u_TotalLength_p.value += length;

    length = distanceByIndex(nextLineStartIndex + offsetSize);
    variable.u_TotalLength_n.value += length;
}
// endIndex：后一个点的索引
function distanceByIndex(endIndex) {
    let end = vec2.fromValues(offsetVertex[endIndex], offsetVertex[endIndex + 1]);
    let start = vec2.fromValues(offsetVertex[endIndex - 2 * offsetSize], offsetVertex[endIndex - 2 * offsetSize + 1]);
    let length = vec2.distance(start, end);
    length = 3.0;
    offsetVertex[endIndex + 4] = length;
    offsetVertex[endIndex + 5] = offsetVertex[endIndex - 2 * offsetSize + 5] + length;
    return length;
}