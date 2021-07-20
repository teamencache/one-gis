
var vertexSource = `
uniform mat4 u_ModelMatrix;
varying vec2 vuv;

void main(){
    gl_Position = projectionMatrix * modelViewMatrix * u_ModelMatrix * vec4(position,1.0);
    vuv = uv;
}
`;
var fragmentSource = `
precision mediump float;

uniform sampler2D u_Sampler2D;
uniform float u_Time;

varying vec2 vuv;

void main(){
    vec4 color = texture2D(u_Sampler2D, vuv);
    gl_FragColor = color;
}
`;


var container;
var camera, scene, renderer;
var orbitControls;
var uniforms;
var variable = {
    width: 1,
    height: 1,
    u_Time: 0,
};

init();
animate();

function init() {
    document.title = 'threejs 手绘四棱锥、每面个性化贴图';
    container = document.body;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    var ambientLight = new THREE.AmbientLight('#FFF');
    scene.add(ambientLight);

    /* PointLight = new THREE.PointLight(0xffffff, 1, 1000);
    PointLight.position.set(0, 0, 20);
    PointLight.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(PointLight); */


    uniforms = {
        u_Time: { type: "f", value: 0.0 },
        u_Sampler2D: {
            value: new THREE.TextureLoader().load("../images/渐变色1.jpg")
        },
        u_ModelMatrix: {
            type: 'm4',
            value: new THREE.Matrix4()
        }
    };

    uniforms.u_Sampler2D.value.wrapS = uniforms.u_Sampler2D.value.wrapT = THREE.ClampToEdgeWrapping;
    // uniforms.u_Sampler2D.value.warpS = uniforms.u_Sampler2D.value.warpT = THREE.RepeatWrapping;
    // 自定义
    material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexSource,
        fragmentShader: fragmentSource,
    });

    /* 凹凸
    if (bump) {
        var bump = THREE.ImageUtils.loadTexture("../assets/textures/general/" + bump);
        material.bumpMap = bump;
        material.bumpScale = 0.2;
        console.log('d');
    } 
    */

    initPyramidVertex([{ x: 0, y: 0, z: 0 }]);
    geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(variable.vertex, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(variable.texCoord, 2));
    // geometry.setAttribute('normal', new THREE.Float32BufferAttribute(variable.normal, 3));
    geometry.setIndex(new THREE.Uint16BufferAttribute(variable.index, 1));
    // geometry.computeBoundingSphere();

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);


    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize(event) {
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    uniforms.u_Time.value += 0.01;
    uniforms.u_ModelMatrix.value = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 0, 1),
        uniforms.u_Time.value
    );
    renderer.render(scene, camera);
}

function initPyramidVertex(gisPoints) {
    let geometry = [], indexData = [], texCoord = [], normal = [];
    for (let index = 0; index < gisPoints.length; index++) {
        let xyz = [gisPoints[index].x, gisPoints[index].y, gisPoints[index].z];
        let dWidth = variable.width / 2;
        geometry.push.apply(geometry, [
            // x,y,z,
            xyz[0], xyz[1], xyz[2],
            xyz[0] + dWidth, xyz[1] - dWidth, xyz[2] + variable.height,
            xyz[0] - dWidth, xyz[1] - dWidth, xyz[2] + variable.height,

            xyz[0], xyz[1], xyz[2],
            xyz[0] + dWidth, xyz[1] + dWidth, xyz[2] + variable.height,
            xyz[0] + dWidth, xyz[1] - dWidth, xyz[2] + variable.height,

            xyz[0], xyz[1], xyz[2],
            xyz[0] - dWidth, xyz[1] + dWidth, xyz[2] + variable.height,
            xyz[0] + dWidth, xyz[1] + dWidth, xyz[2] + variable.height,

            xyz[0], xyz[1], xyz[2],
            xyz[0] - dWidth, xyz[1] - dWidth, xyz[2] + variable.height,
            xyz[0] - dWidth, xyz[1] + dWidth, xyz[2] + variable.height,

            xyz[0] - dWidth, xyz[1] - dWidth, xyz[2] + variable.height,
            xyz[0] + dWidth, xyz[1] - dWidth, xyz[2] + variable.height,
            xyz[0] + dWidth, xyz[1] + dWidth, xyz[2] + variable.height,

            xyz[0] - dWidth, xyz[1] - dWidth, xyz[2] + variable.height,
            xyz[0] + dWidth, xyz[1] + dWidth, xyz[2] + variable.height,
            xyz[0] - dWidth, xyz[1] + dWidth, xyz[2] + variable.height,
        ]);
        texCoord.push.apply(texCoord, [
            // s,t
            0.5, 0.3,
            1.0, 0.8,
            0.0, 0.8,

            0.5, 0.3,
            1.0, 0.8,
            0.0, 0.8,

            0.5, 0.3,
            1.0, 0.8,
            0.0, 0.8,

            0.5, 0.3,
            1.0, 0.8,
            0.0, 0.8,

            0.5, 0.3,
            0.5, 0.3,
            0.5, 0.3,

            0.5, 0.3,
            0.5, 0.3,
            0.5, 0.3,
        ]);
        indexData.push.apply(indexData, [
            0, 1, 2,
            3, 4, 5,
            6, 7, 8,
            9, 10, 11,
            12, 13, 14,
            15, 16, 17,
        ]);

        normal.push.apply(normal, [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
        ])
    }
    variable.vertex = geometry;
    variable.texCoord = texCoord;
    variable.index = indexData;
    variable.normal = normal;
}