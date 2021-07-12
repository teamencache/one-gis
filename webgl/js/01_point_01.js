

let gl, vertexShader, fragmentShader, shaderProgram;

let vertexStr = `
attribute vec4 a_Position;
uniform mat4 u_ModelMatrix;
uniform mat4 u_MvpMatrix;
varying vec3 v_Position;
void main(){
    gl_Position = u_MvpMatrix * a_Position;
    v_Position = vec3(u_ModelMatrix * a_Position);
    gl_PointSize = 300.0;
}
`;

let fragmentStr = `
precision mediump float;
uniform float u_Time;
varying vec3 v_Position;
void main(){
    vec3 u_BlingColor = vec3(0, 1.0, 0);
    float u_Radius = 0.5;
    float u_Frequency = 20.0;//控制重复环的相对多少
    float u_Speed = 2.0;
    float alpha = 0.0;
    //圆
    // float dis = distance(gl_PointCoord.xy, vec2(u_Radius,u_Radius));
    //以viewport圆点为圆心
    // float dis = distance(v_Position.xy, gl_FragCoord.xy);
    //椭圆
    u_Radius = 1.0;
    float dis;
    dis =  pow((gl_PointCoord.x-0.5)/0.48,2.0) + pow((gl_PointCoord.y-0.5)/0.1,2.0);
    float de = abs(cos(dis*u_Frequency + u_Time/3.14/u_Speed));//闪动
    de = clamp(de, 0.1, 1.0);
    if(dis <= u_Radius){
        alpha = sin(dis/(u_Radius/2.0)*3.14/2.0);//半径一半处不透明度最高
        gl_FragColor=vec4(de*u_BlingColor,alpha);
    }else{
        // alpha = sin(dis/(u_Radius/2.0)*3.14/2.0);//半径一半处不透明度最高
        gl_FragColor=vec4(u_BlingColor,0);
        discard;
    }
}
`;

let uniform = {
    u_ModelMatrix: {
        location: null,
        value: null
    },
    u_MvpMatrix: {
        location: null,
        value: null
    },
    u_Time: {
        localtion: null,
        value: 0.0
    }
};
let attribute = {
    a_Position: {
        localtion: null,
        value: vec4.fromValues(0.0, 0.0, 10.0, 1.0)
    }
};
let ele;
let eye, direction, center, up
let ModelMatrix, ProjectionMartrix, ViewMatrix, ViewProjectionMatrix, MvpMatrix;
// 添加鼠标事件监听
var currentAngle = [0.0, 0.0];
(function main() {
    initDom();
    initShader();
    initProgram();
    initParameter();
    initEventHandles(ele, currentAngle);
    // 滑轮缩放处理
    ele.addEventListener('wheel', onMouseWheel, false);
    animate();
})()

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    uniform.u_Time.value -= 0.3;
    /* ModelMatrix.setRotate(currentAngle[0], 1.0, 0.0, 0.0);
    ModelMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0);
    MvpMatrix.set(ViewProjectMatrix).multiply(ModelMatrix); */
    // mat4.rotateX(ModelMatrix, ModelMatrix, currentAngle[0] * Math.PI / 180, vec3.fromValues(1.0, 0, 0))
    // mat4.rotateY(ModelMatrix, ModelMatrix, currentAngle[1] * Math.PI / 180, vec3.fromValues(0, 1.0, 0))

    mat4.multiply(MvpMatrix, ViewProjectionMatrix, ModelMatrix);
    // mat4.multiply(MvpMatrix, MvpMatrix, ModelMatrix);
    uniform.u_MvpMatrix.value = MvpMatrix;
    // 如果把灯光和视图以及模型矩阵一起旋转则使用 mvpMatrix
    // mvpMatrix.rotate(currentAngle[0], 1.0, 0.0, 0.0);
    // mvpMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0);

    gl.uniform1f(uniform.u_Time.localtion, uniform.u_Time.value);
    gl.uniformMatrix4fv(uniform.u_ModelMatrix.localtion, false, uniform.u_ModelMatrix.value);
    gl.uniformMatrix4fv(uniform.u_MvpMatrix.localtion, false, uniform.u_MvpMatrix.value);
    gl.vertexAttrib3fv(attribute.a_Position.localtion, attribute.a_Position.value);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);
}


function initDom() {
    document.title = '移动缩放点';
    ele = document.createElement('canvas');
    ele.id = 'webgl-dom';
    ele.style.width = window.innerWidth + 'px';
    ele.style.height = window.innerHeight + 'px';
    ele.width = window.innerWidth;
    ele.height = window.innerHeight;
    document.body.appendChild(ele);
    gl = ele.getContext('webgl', {
        alpha: true,
        antialias: true,
        depth: true
    });
    gl.viewport(0, 0, ele.width, ele.height);
}

function initShader() {
    vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexStr);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(vertexShader));
        debugger
        return
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
        console.log('Could not initialise shaders');
    }
    gl.useProgram(shaderProgram);
}

function initParameter() {
    uniform.u_Time.localtion = gl.getUniformLocation(shaderProgram, 'u_Time');
    uniform.u_ModelMatrix.localtion = gl.getUniformLocation(shaderProgram, 'u_ModelMatrix');
    uniform.u_MvpMatrix.localtion = gl.getUniformLocation(shaderProgram, 'u_MvpMatrix');

    attribute.a_Position.localtion = gl.getUniformLocation(shaderProgram, 'a_Position');

    ModelMatrix = mat4.create();
    ViewMatrix = mat4.create();
    ProjectionMartrix = mat4.create();
    ViewProjectionMatrix = mat4.create();
    MvpMatrix = mat4.create();

    eye = vec3.fromValues(0, 0, 100);
    center = vec3.fromValues(0, 0, 0);
    up = vec3.fromValues(0, 1, 0);
    mat4.perspective(ProjectionMartrix, Math.PI / 2, ele.width / ele.height, 0.01, 1000);
    mat4.lookAt(ViewMatrix, eye, center, up);
    mat4.multiply(ViewProjectionMatrix, ProjectionMartrix, ViewMatrix);
    mat4.multiply(MvpMatrix, ViewProjectionMatrix, ModelMatrix);
    mat4.multiply(MvpMatrix, MvpMatrix, ModelMatrix);
    uniform.u_ModelMatrix.value = ModelMatrix;
    uniform.u_MvpMatrix.value = MvpMatrix;

    /*  ModelMatrix = new Matrix4(); // 模型矩阵
     MvpMatrix = new Matrix4(); // 模型视图矩阵
     var normalMatrix = new Matrix4();// 法向量变换矩阵
     ViewProjectMatrix = new Matrix4();
 
     // 设置正射投影可是区域
     ViewProjectMatrix.setPerspective(90, ele.width / ele.height, 0.01, 1000);
     ViewProjectMatrix.lookAt(0, 0, 100, 0, 0, 0, 0, 1, 0);
     ViewProjectMatrix.multiply(ModelMatrix);
     MvpMatrix.set(ViewProjectMatrix).multiply(ModelMatrix);
     uniform.u_ModelMatrix.value = ModelMatrix;
     uniform.u_MvpMatrix.value = MvpMatrix; */
}



function onMouseWheel(event) {

    mat4.translate(ViewProjectionMatrix, ViewProjectionMatrix, vec3.fromValues(0.0, 0.0, -event.deltaY * 0.004))
    mat4.multiply(MvpMatrix, ViewProjectionMatrix, ModelMatrix);
    mat4.multiply(MvpMatrix, MvpMatrix, ModelMatrix);
    gl.uniformMatrix4fv(uniform.u_MvpMatrix.localtion, false, MvpMatrix);

    /* ViewProjectMatrix.translate();

    MvpMatrix.set(ViewProjectMatrix).multiply(ModelMatrix);

    gl.uniformMatrix4fv(uniform.u_MvpMatrix.localtion, false, MvpMatrix.elements); */
}

// 添加鼠标事件监听处理
function initEventHandles(domElement, currentAngle) {

    var dragging = false;

    var lastX = -1;
    var lastY = -1;

    // 添加事件监听的dom元素
    domElement = (domElement !== undefined) ? domElement : document;

    // 角度默认值位0.0
    currentAngle = (currentAngle !== undefined) ? currentAngle : [0.0, 0.0];

    // 鼠标按下事件
    domElement.onmousedown = function (event) {

        event.preventDefault();

        // 鼠标点击位置
        var x = event.clientX;
        var y = event.clientY;

        lastX = x;
        lastY = y;

        dragging = true;

    }

    domElement.onmouseleave = function (event) {

        event.preventDefault();
        dragging = false;

    }

    // 鼠标抬起事件
    domElement.onmouseup = function (event) {

        event.preventDefault();
        dragging = false;

    }

    // 鼠标移动事件
    domElement.onmousemove = function (event) {

        event.preventDefault();

        var x = event.clientX, y = event.clientY;

        if (dragging) {

            // 旋转比例--速度
            var factor = 100 / domElement.height;

            var dx = factor * (x - lastX);
            var dy = factor * (y - lastY);

            // 限制 x轴的旋转角度 -90 --- 90
            currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 90.0), -90.0)
            currentAngle[1] = currentAngle[1] + dx;
            // console.log(currentAngle)
            mat4.rotateX(ModelMatrix, ModelMatrix, currentAngle[0] * Math.PI / 180, vec3.fromValues(1.0, 0, 0))
            mat4.rotateY(ModelMatrix, ModelMatrix, currentAngle[1] * Math.PI / 180, vec3.fromValues(0, 1.0, 0))
        }

        lastX = x, lastY = y;
    }
}
// 点无所谓旋转，要使点有旋转效果，只能计算片元颜色，间接达到旋转的效果