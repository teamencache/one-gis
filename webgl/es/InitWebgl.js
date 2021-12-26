let nodeOption = {
    id:'webgl-box',
    class:'webgl-box',
    width:'100%',
    height:'100%'
};
let MyGL = {
    node:null,
    gl:null,
    vertexShader:null,
    fragmentShader:null,
    shaderProgram:null,
    attribute:{},
    uniform:{},

    // 初始化dom
    initNode(option) {
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
        
        this.node = node;
        this.gl = node.getContext('webgl');
        this.gl.viewport(0, 0, opt.width, opt.height);
        return this;
    },
    // 绑定着色器
    initSource(VertexGLSL, FragmentGLSL) {
        let gl = this.gl;
        let vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader,VertexGLSL);
        gl.compileShader(vertexShader);
        if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
            console.log(gl.getShaderInfoLog(vertexShader));
            return
        }

        let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader,FragmentGLSL);
        gl.compileShader(fragmentShader);
        if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
            console.log(gl.getShaderInfoLog(fragmentShader));
            return
        }

        this.initProgram(vertexShader, fragmentShader);
        return this;
    },

    //初始化渲染主程序
    initProgram(vertexShader, fragmentShader) {
        let gl = this.gl;
        let shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
            console.log('could not initialise program');
            return
        }
        gl.useProgram(shaderProgram);
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
        this.shaderProgram = shaderProgram;
    },

    initLocation(params, type){
        let store;
        switch(type){
            case 'attribute':
                store = this.attribute;
                break;
            case 'uniform':
                store = this.uniform;
                break;
        }
        if(params instanceof Array){
            params.forEach(name=>{
                store[name] = {
                    local:this.getLocation(name, type),
                    value:null
                }
            })
        }else if(typeof params == 'string'){
            store[params] = {
                local:this.getLocation(params, type),
                value:null
            }
        }else{
            for(let key in params){
                store[key] = {
                    local:this.getLocation(key, type),
                    value:params[key]
                }
            }
        }
        return this;
    },
    
    getLocation(name, type){
        let local;
        switch (type) {
            case 'attribute':
                local = this.gl.getAttribLocation(this.shaderProgram, name);
                break;
            case 'uniform':
                local = this.gl.getUniformLocation(this.shaderProgram, name);
                break;
        }
        return local;
    },

    setLocation(name, value, type){
        let store;
        switch(type){
            case 'attribute':
                store = this.attribute;
            case 'uniform':
                store = this.uniform;
        }
        store[name].value = value;
    },

    initTexture(name, url) {
        let me = this;
        let texture0 = this.gl.createTexture();
        this.uniform[name].value = texture0;
        let image = new Image();
        image.onload = function () {
            me.uniform[name].image = image;
            me.loadTexture(texture0, me.uniform[name].local, image);
        };
        image.src = url;
    },
    
    loadTexture(texture, u_Sampler, image) {
        let gl = this.gl;
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
    
};



export default MyGL;