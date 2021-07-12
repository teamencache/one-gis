let vertexStr = `
attribute vec3 a_Position;
attribute float a_PointSize;
attribute vec2 a_TexCoord;

uniform mat4 u_ModelMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;

varying vec2 v_TexCoord;
varying vec3 v_Position;
void main(){

    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * vec4(a_Position, 1.0);
    v_Position = gl_Position.xyz;
    v_TexCoord = vec2(a_TexCoord);
    gl_PointSize = a_PointSize;
}
`;

let fragmentStr = `
precision mediump float;
uniform float u_Time;
varying vec2 v_TexCoord;
varying vec3 v_Position;
void main(){
    vec3 u_BlingColor = vec3(0, 1.0, 0);
    float u_Radius = 0.5;
    float u_Frequency = 10.0;//控制重复环的相对多少
    float u_Speed = 2.0;
    float alpha = 0.0;
    //圆
    float dis = distance(v_TexCoord.xy, vec2(u_Radius,u_Radius));
    /* u_Radius = 1.0;
    float dis = distance(v_Position.xy, vec2(0.0,0.0)); */
    float de = abs(cos(dis*u_Frequency + u_Time/3.14/u_Speed));//闪动
    de = clamp(de, 0.1, 1.0);
    if(dis > u_Radius){
        discard;
    }
    alpha = sin(dis/(u_Radius/2.0)*3.14/2.0);//半径一半处不透明度最高
    gl_FragColor=vec4(de * u_BlingColor,alpha);
}
`;
let ele;
let gl, shaderProgram, vertexShader, fragmentShader;

let ModelMatrix, mvpMatrix, mvMatrix, ProjectionMatrix, ViewMatrix, eye, direction, up;

let local = {
    a_Position: {
        value: null,
        location: null
    },
    a_PointSize: {
        value: null,
        location: null
    },
    a_TexCoord: {
        value: null,
        location: null,
    },
    u_Time: {
        value: null,
        location: null,
    },
    u_ModelMatrix: {
        value: null,
        location: null
    },
    u_ViewMatrix: {
        value: null,
        location: null
    },
    u_ProjectionMatrix: {
        value: null,
        location: null
    },
};

(function main() {
    initDom();
    initShader();
    initProgram();
    initLocation();
    initVertex();
    initController();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPATH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    animate();
})();

function render() {
    let param = local.u_Time;
    param.value -= 0.3;
    gl.uniform1f(param.location, param.value);
    // gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);

}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function initVertex() {
    let location = local.a_Position.location;
    let data = new Float32Array([
        //顶点x，顶点y，顶点z，纹理s，纹理t
        1.0, 1.0, 0.0, 1.0, 1.0,
        -1.0, 1.0, 0.0, 0.0, 1.0,
        -1.0, -1.0, 0.0, 0.0, 0.0,
        1.0, -1.0, 0.0, 1.0, 0.0
    ]);
    let buffer = gl.createBuffer();
    if (!buffer) {
        console.log('createBuffer failed.')
        debugger
    }
    // 顶点相关信息-顶点坐标
    var FSIZE = data.BYTES_PER_ELEMENT;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(location, 3, gl.FLOAT, false, FSIZE * 5, 0);
    gl.enableVertexAttribArray(location);
    // 顶点相关信息-顶点纹理坐标
    location = local.a_TexCoord.location;
    gl.vertexAttribPointer(location, 2, gl.FLOAT, false, FSIZE * 5, FSIZE * 3);
    gl.enableVertexAttribArray(location);
    // 索引
    data = new Uint8Array([
        0, 1, 2,
        0, 2, 3
    ]);
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

}

function initLocation() {
    let location = gl.getAttribLocation(shaderProgram, 'a_Position');
    local.a_Position.location = location;
    location = gl.getAttribLocation(shaderProgram, 'a_PointSize');
    local.a_PointSize.location = location;

    location = gl.getUniformLocation(shaderProgram, 'u_Time');
    local.u_Time.location = location;
    local.u_Time.value = 0.0;

    location = gl.getAttribLocation(shaderProgram, 'a_TexCoord');
    local.a_TexCoord.location = location;
    // 模型矩阵
    location = gl.getUniformLocation(shaderProgram, 'u_ModelMatrix');
    local.u_ModelMatrix.location = location;
    local.u_ModelMatrix.value = mat4.create();
    gl.uniformMatrix4fv(local.u_ModelMatrix.location, false, local.u_ModelMatrix.value);
    // 投影矩阵
    location = gl.getUniformLocation(shaderProgram, 'u_ProjectionMatrix');
    local.u_ProjectionMatrix.location = location;
    ProjectionMatrix = mat4.create();
    mat4.perspective(ProjectionMatrix, Math.PI / 180 * 45, ele.width / ele.height, 0.1, 1000);
    local.u_ProjectionMatrix.value = ProjectionMatrix;
    gl.uniformMatrix4fv(local.u_ProjectionMatrix.location, false, local.u_ProjectionMatrix.value);
    // 视图矩阵
    location = gl.getUniformLocation(shaderProgram, 'u_ViewMatrix');
    local.u_ViewMatrix.location = location;
    eye = vec3.fromValues(0, 0, 10);
    direction = vec3.fromValues(0, 0, 0);
    up = vec3.fromValues(0, 1, 0);
    ViewMatrix = mat4.create();
    mat4.lookAt(ViewMatrix, eye, direction, up);
    local.u_ViewMatrix.value = ViewMatrix;
    gl.uniformMatrix4fv(local.u_ViewMatrix.location, false, local.u_ViewMatrix.value);

}

function initController() {
    let angles = [0, 0, 0];
    let lastEvt;
    let dragging = false;
    let rate = 2000;
    let param = local.u_ModelMatrix;

    document.onwheel = function (evt) {
        mat4.translate(param.value, param.value, vec3.fromValues(0.0, 0.0, -evt.deltaY * 0.004));
        gl.uniformMatrix4fv(param.location, false, param.value);
        /* mat4.scale(param.value, param.value, vec2.fromValues(-evt.deltaY * 0.004, -evt.deltaY * 0.004)) */
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

        mat4.rotateX(param.value, param.value, angles[0]);
        mat4.rotateY(param.value, param.value, angles[1]);

        gl.uniformMatrix4fv(param.location, false, param.value);

        lastEvt = evt;
    }
}

function initParameter() {

}

function initDom() {
    document.title = '平面闪烁点，只用gl-Matrix插件';
    ele = document.createElement('canvas');
    ele.width = window.innerHeight;//window.innerWidth;
    ele.height = window.innerHeight;
    document.body.appendChild(ele);
    gl = ele.getContext('webgl');
    gl.viewport(0, 0, ele.width, ele.height);
}

function initShader() {
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
}

function initProgram() {
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log('could not initialise program');
        debugger
    }
    gl.useProgram(shaderProgram);
}
