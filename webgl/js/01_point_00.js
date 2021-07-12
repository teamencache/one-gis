let ele;
let gl;
let vertexShader, fragmentShader;
let shaderProgram;


let vertexStr = `
void main(){
    vec3 position = vec3(0.0,0.0,1.0);
    gl_Position = vec4(position, 1.0);
    gl_PointSize = 300.0;
}
`;

let fragmentStr = `
precision mediump float;
uniform float u_time;
void main(){
    vec3 u_BlingColor = vec3(0, 1.0, 0);
    float u_Radius = 0.5;
    float u_Frequency = 20.0;//控制重复环的相对多少
    float u_Speed = 2.0;
    float alpha = 1.0;
    float dis = distance(gl_PointCoord, vec2(u_Radius,u_Radius));
    float de = abs(cos(dis*u_Frequency + u_time/3.14/u_Speed));//闪动
    de = clamp(de, 0.1, 1.0);
    if(dis < u_Radius){
        alpha = sin(dis/(u_Radius/2.0)*3.14/2.0);//半径一半处不透明度最高
        gl_FragColor=vec4(de * u_BlingColor,alpha);
    }
}
`;
let u_time = 0.0;
let uniform = {
    u_time: null
};
(function main() {
    initDom();
    initShader();
    initProgram();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    uniform.u_time = gl.getUniformLocation(shaderProgram, "u_time");
    animate();

})();

function animate() {
    requestAnimationFrame(animate);
    u_time -= 0.3;
    gl.uniform1f(uniform.u_time, u_time);
    gl.drawArrays(gl.POINTS, 0, 1);
}


function initDom() {
    document.title = '圆点-闪烁';
    ele = document.createElement('canvas');
    ele.id = 'webgl-dom';
    ele.style.width = window.innerWidth + 'px';
    ele.style.height = window.innerHeight + 'px';
    ele.width = window.innerWidth;
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