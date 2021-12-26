import MyGL from '../es/InitWebgl.js'
import MatrixTool from '../es/MatrixTool.js'
import VertexGLSL from '../es/glsl/triggle_vertex.glsl.js'
import FragmentGLSL from '../es/glsl/triggle_fragment.glsl.js'

let nodeOption = {
    width:window.innerWidth,
    height:window.innerHeight
};
/* let arrVertex = [
    //x,y,z,s,t
    0, -10.0, 0, 0.5, 0.0,
    10, 10.0, 0, 1.0, 1.0,
    -10.0, 10.0, 0, 0.0, 1.0,
]; */
let arrVertex = [
    //x,y,z,s,t
    -10, 10, 0, 0, 1,
    -10, 0, 0, 0, 0,
    0, 10, 0, 10/(20 + 14.1), 1,
    0, 0, 0, 10/(20 + 14.1), 0,
    10, 0, 0, 14/(20 + 14.1), 1,
    0, 0, 0, 14/(20 + 14.1), 0,
    10, -10, 0, 1, 1,
    10, -10, 0, 1, 0,
];
let arrIndex = [
    0,1,3,
    0,3,2,
    2,3,5,
    2,5,4,
    4,5,7,
    4,7,6
];
let offsetSize = 5;
let attributes = ['a_Position','a_Uv'];
let myMatrixTool = MatrixTool.projectionMartrix(1.7,nodeOption.width,nodeOption.height,1, 100)
                            .viewMatrix()
                            .modelMatrix();

let uniform = {
    u_Time: 0.0,
    u_Length: 1.0,
    u_ProjectionMatrix: myMatrixTool.projection,
    u_ViewMatrix: myMatrixTool.view,
    u_ModelMatrix: myMatrixTool.model,
    u_Sampler2D: null
};
let myGL = MyGL.initNode(nodeOption)
            .initSource(VertexGLSL,FragmentGLSL)
            .initLocation(uniform,'uniform')
            .initLocation(attributes,'attribute');

let matrixItem = myGL.uniform.u_ProjectionMatrix;
myGL.gl.uniformMatrix4fv(matrixItem.local, false, matrixItem.value);
matrixItem = myGL.uniform.u_ViewMatrix;
myGL.gl.uniformMatrix4fv(matrixItem.local, false, matrixItem.value);
matrixItem = myGL.uniform.u_ModelMatrix;
myGL.gl.uniformMatrix4fv(matrixItem.local, false, matrixItem.value);

myGL.initTexture('u_Sampler2D','/one-gis/resource/images/riverFlow.png');

let vertexData = new Float32Array(arrVertex);
let vertexBuffer = myGL.gl.createBuffer();
if (!vertexBuffer) {
    console.log('vertexBuffer failed');
}
let FSIZE = vertexData.BYTES_PER_ELEMENT;
myGL.gl.bindBuffer(myGL.gl.ARRAY_BUFFER, vertexBuffer);
myGL.gl.bufferData(myGL.gl.ARRAY_BUFFER, vertexData, myGL.gl.STATIC_DRAW);
myGL.gl.vertexAttribPointer(myGL.attribute.a_Position.local, 3, myGL.gl.FLOAT, false, FSIZE * offsetSize, 0);
myGL.gl.enableVertexAttribArray(myGL.attribute.a_Position.local);

myGL.gl.vertexAttribPointer(myGL.attribute.a_Uv.local, 2, myGL.gl.FLOAT, false, FSIZE * offsetSize, FSIZE * 3);
myGL.gl.enableVertexAttribArray(myGL.attribute.a_Uv.local);

let indexData = new Uint8Array(arrIndex);
let indexBuffer = myGL.gl.createBuffer();
myGL.gl.bindBuffer(myGL.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
myGL.gl.bufferData(myGL.gl.ELEMENT_ARRAY_BUFFER, indexData, myGL.gl.STATIC_DRAW);

myGL.gl.clearColor(0.0, 0.0, 0.0, 1.0);
// gl.enable(gl.DEPTH_TEST);

animate();

function animate() {
    requestAnimationFrame(animate);
    myGL.gl.clear(myGL.gl.COLOR_BUFFER_BIT | myGL.gl.DEPTH_BUFFER_BIT);
    uniform.u_Time += 0.004;
    myGL.gl.uniform1f(myGL.uniform.u_Time.local, uniform.u_Time);
    myGL.gl.drawElements(myGL.gl.TRIANGLES, arrIndex.length, myGL.gl.UNSIGNED_BYTE, 0);
    // myGL.gl.drawArrays(myGL.gl.POINTS, 0, 1);
}