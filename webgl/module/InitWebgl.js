let nodeOption = {
    id:'webgl-box',
    class:'webgl-box',
    width:'100%',
    height:'100%'
};
let MyGL = {
    node:null,
    gl:null,
};
// 初始化dom
function initNode(option) {
    console.log('init node');
    let opt = Object.assign({}, nodeOption, option);
    let node = document.createElement('canvas');
    node.id = opt.id;
    node.class = node.class;
    node.style.width = opt.width;
    node.style.height = opt.height;
    node.width = opt.width;
    node.height = opt.height;
    document.body.appendChild(node);
    
    MyGL.node = node;
    MyGL.gl = node.getContext('webgl');
    MyGL.gl.viewport(0, 0, opt.width, opt.height);
}

// 加载glsl
function loadGLSL(){

}

// 绑定着色器
function initSource(gl, framentSource, framentType) {
    console.log('init source');
}
//初始化渲染主程序
function initProgram(params) {
    
}
export{
    initNode,
    initSource
}