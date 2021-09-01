let vertexStr = `
    attribute vec3 a_Position;
    attribute vec2 a_LineDirect;
    attribute vec2 a_Direct;
    attribute float a_Offset;
    attribute vec2 a_TexCoord;
    attribute float a_Length;
    
    uniform float lineWidth;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;
    uniform float u_TotalLength;

    varying vec2 v_Direct;
    varying float v_Offset;
    varying float v_IncludedAngle;
    varying float v_Length;
    varying float v_TotalLength;
    
    void main(){
        float halfWidth = 2.0;
        vec2 offsetVec = a_Offset * halfWidth * a_Direct;
        vec2 position = vec2(a_Position.xy)  + offsetVec;
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * vec4(position, 0.0, 1.0);
        float includedAngle = dot(a_LineDirect, a_Direct);

        v_Direct = a_Direct;
        v_Offset = a_Offset;
        v_IncludedAngle = includedAngle;
        v_Length = a_Length;
        v_TotalLength = u_TotalLength;
    }
`;

let fragmentStr = `
    precision mediump float;
    uniform sampler2D u_Sampler2D;
    uniform float u_Time;
    
    varying float v_Direct;
    varying float v_Offset;
    varying float v_IncludedAngle;
    varying float v_Length;
    varying float v_TotalLength;

    void main(){
        vec2 v_TexCoord = vec2(0.0,0.0);
        float texCoord_t = v_Length/v_TotalLength;
        texCoord_t = fract(texCoord_t + u_Time);
        if(v_Offset>0.0){
            v_TexCoord = vec2(1.0, texCoord_t);
        }else{
            v_TexCoord = vec2(0.0, texCoord_t);
        }
        
        vec4 texColor = texture2D(u_Sampler2D, vec2(v_TexCoord.s, texCoord_t));
        gl_FragColor = texColor;
       
        /* float red = sin(50.0 * v_TexCoord.t + u_Time);
        gl_FragColor = vec4(red,1.0,0,1.0); */
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
    a_Direct: {
        local: null,
        value: null
    },
    a_Offset: {
        local: null,
        value: null
    },
    a_LengthPos: {
        local: null,
        value: null
    },
    a_Length: {
        local: null,
        value: null
    },
    a_LengthNeg: {
        local: null,
        value: null
    },
    a_TexCoord: {
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
    u_Sampler2D: {
        local: null,
        value: null
    },
    u_Time: {
        local: null,
        value: 0.0
    },
    u_TotalLength: {
        local: null,
        value: 0.0
    },
};

let size = 3;
let lineWidth = 4;
let offsetSize = 7;
let totalLength = 0;
let offsetVertex = [];
let offsetIndex = [];
let vertexData = [
    -5.0, 5.0, 0.0,
    0.0, 5.0, 0.0,
    0.0, -10, 0,
    /* - 20, 20, 0,
    10, 20, 0,
    10, -15, 0,
    15, -15, 0,
    15, 8, 0,
    -5, 10, 0 */
];

(function main() {
    initDom();
    initShader();
    initLocation();
    initVariable();
    initOffsetLineVertex();
    initTexture();
    initVertex();
    animate();
})();

function render() {
    gl.clearColor(0, 0, 0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFEER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, offsetIndex.length, gl.UNSIGNED_BYTE, 0);
}

function animate() {
    requestAnimationFrame(animate);

    gl.uniform1f(variable.u_TotalLength.local, variable.u_TotalLength.value);
    variable.u_Time.value -= 0.0001;
    gl.uniform1f(variable.u_Time.local, variable.u_Time.value);
    render();

}

function initDom() {
    ele = document.createElement('canvas');
    ele.width = window.innerWidth;
    ele.height = window.innerHeight;
    ele.style.width = ele.width + 'px';
    ele.style.height = ele.height + 'px';
    document.body.appendChild(ele);
    document.title = '角平分线连接';
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

    location = gl.getAttribLocation(shaderProgram, 'a_Direct');
    variable.a_Direct.local = location;

    location = gl.getAttribLocation(shaderProgram, 'a_Offset');
    variable.a_Offset.local = location;

    location = gl.getAttribLocation(shaderProgram, 'a_Length');
    variable.a_Length.local = location;

    location = gl.getAttribLocation(shaderProgram, 'a_TexCoord');
    variable.a_TexCoord.local = location;

    location = gl.getUniformLocation(shaderProgram, 'u_ModelMatrix');
    variable.u_ModelMatrix.local = location;

    location = gl.getUniformLocation(shaderProgram, 'u_ViewMatrix');
    variable.u_ViewMatrix.local = location;

    location = gl.getUniformLocation(shaderProgram, 'u_ProjectionMatrix');
    variable.u_ProjectionMatrix.local = location;

    location = gl.getUniformLocation(shaderProgram, 'u_Time');
    variable.u_Time.local = location;

    location = gl.getUniformLocation(shaderProgram, 'u_TotalLength');
    variable.u_TotalLength.local = location;

    location = gl.getUniformLocation(shaderProgram, 'u_Sampler2D');
    variable.u_Sampler2D.local = location;
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
    let vertexData = new Float32Array(offsetVertex);
    let vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('vertexBuffer failed');
    }
    let FSIZE = vertexData.BYTES_PER_ELEMENT;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
    gl.vertexAttribPointer(variable.a_Position.local, 3, gl.FLOAT, false, FSIZE * offsetSize, 0);
    gl.enableVertexAttribArray(variable.a_Position.local);

    gl.vertexAttribPointer(variable.a_Direct.local, 2, gl.FLOAT, false, FSIZE * offsetSize, FSIZE * 3);
    gl.enableVertexAttribArray(variable.a_Direct.local);

    gl.vertexAttribPointer(variable.a_Offset.local, 1, gl.FLOAT, false, FSIZE * offsetSize, FSIZE * 5);
    gl.enableVertexAttribArray(variable.a_Offset.local);

    gl.vertexAttribPointer(variable.a_Length.local, 1, gl.FLOAT, false, FSIZE * offsetSize, FSIZE * 6);
    gl.enableVertexAttribArray(variable.a_Length.local);

    let indexData = new Uint8Array(offsetIndex);
    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);
}

function initOffsetLineVertex() {
    let vertexLength = vertexData.length / size;
    let vertexIndex = 0;
    let lastInfo = {};
    while (vertexIndex < vertexLength) {
        let currentVertex = vertexData.slice(vertexIndex * size, (vertexIndex + 1) * size);
        let nextVertex = vertexData.slice((vertexIndex + 1) * size, (vertexIndex + 2) * size);
        let nextLength = vec2.distance(currentVertex, nextVertex);
        let currentDirect = vec2.create();
        vec2.subtract(currentDirect, currentVertex, nextVertex);
        let length = vec2.length(currentDirect);
        vec2.normalize(currentDirect, currentDirect);
        let currentNormal = vec2.fromValues(-currentDirect[1], currentDirect[0]);

        // 第一个点
        if (!vertexIndex) {
            lastInfo.length = nextLength;
            lastInfo.normal = currentNormal;

            createOffsetData(currentVertex, currentNormal,currentDirect, 0.0, vertexIndex);
            vertexIndex++;
            continue;
        }
        //最后一个点
        if (vertexIndex == vertexLength - 1) {
            createOffsetData(currentVertex, lastInfo.normal,currentDirect, lastInfo.length, vertexIndex);
            break
        }

        /*  let negateNormal = vec2.create();
         vec2.negate(negateNormal, lastInfo.normal); */
        let cornerDirect = vec2.create();
        vec2.add(cornerDirect, lastInfo.normal, currentNormal);
        length = vec2.length(cornerDirect);
        vec2.normalize(cornerDirect, cornerDirect);


        let cosValue = vec2.dot(cornerDirect, lastInfo.normal);
        length = 1 / cosValue;
        vec2.scale(cornerDirect, cornerDirect, length);
        /* let crossDirect = vec3.create();
        vec2.cross(crossDirect, cornerDirect, lastInfo.normal);
        if(crossDirect[2]<0){
            cornerDirect
        } */

        lastInfo.offsetDirect = cornerDirect;
        createOffsetData(currentVertex, cornerDirect, lastInfo.length, vertexIndex);

        lastInfo.length = nextLength;
        lastInfo.normal = currentNormal;

        vertexIndex++;
    }

}

function createOffsetData(position, direct,segmengtDirect, segmentLength, vertexIndex) {
    variable.u_TotalLength.value += segmentLength;
    // 正
    offsetVertex.push.apply(offsetVertex, position);//x,y,z
    offsetVertex.push.apply(offsetVertex, direct);//dx,dy
    offsetVertex.push(1.0);//offset
    offsetVertex.push(segmentLength);//length
    offsetVertex.push(segmengtDirect);//dx,dy
    // offsetVertex.push(variable.u_TotalLength.value);//totallength
    // 反
    offsetVertex.push.apply(offsetVertex, position);
    offsetVertex.push.apply(offsetVertex, direct);
    offsetVertex.push(-1.0);
    offsetVertex.push(segmentLength);//length
    offsetVertex.push(segmengtDirect);//dx,dy
    // offsetVertex.push(variable.u_TotalLength.value);
    /* // 正
    let testVec = vec2.fromValues(position[0], position[1]);
    let testDirect = vec2.fromValues(direct[0], direct[1]);
    vec2.scale(testDirect, testDirect, 1.0 * 2.0);
    vec2.add(testVec, testVec, testDirect);
    console.log(testVec);
    offsetVertex.push.apply(offsetVertex, testVec);
    offsetVertex.push.apply(offsetVertex, [0.0, 0, 0, 0, 0]);
    // 反

    testVec = vec2.fromValues(position[0], position[1]);
    testDirect = vec2.fromValues(direct[0], direct[1]);
    vec2.scale(testDirect, testDirect, -1.0 * 2.0);
    vec2.add(testVec, testVec, testDirect);
    console.log(testVec);
    offsetVertex.push.apply(offsetVertex, testVec);
    offsetVertex.push.apply(offsetVertex, [0.0, 0, 0, 0, 0]); */


    if (vertexIndex > 0) {
        offsetIndex.push.apply(offsetIndex, [
            (vertexIndex + 1) * 2 - 4, (vertexIndex + 1) * 2 - 2, (vertexIndex + 1) * 2 - 3,
            (vertexIndex + 1) * 2 - 3, (vertexIndex + 1) * 2 - 2, (vertexIndex + 1) * 2 - 1,
        ])
    }

}

function initTexture() {
    let texture0 = gl.createTexture();
    variable.u_Sampler2D.value = texture0;
    let image = new Image();
    image.onload = function () {
        variable.u_Sampler2D.image = image;
        loadTexture(texture0, variable.u_Sampler2D.local, image);
    }
    // image.src = '../images/color.png';
    image.src = '../images/lineTexture.jpeg';
}

function loadTexture(texture, u_Sampler, image) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler, 0);
}