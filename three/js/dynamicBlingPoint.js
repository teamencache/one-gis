var vertexShader = `
varying vec3 v_Position;
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);//改成这样才能用鼠标控制
    v_Position = position.xyz;//使用gl_Position画出来的是椭圆
    // gl_Position = vec4( position, 1.0 );
}
`;


// 圆形闪动
var fragmentShader = `
varying vec3 v_Position;
uniform vec3 u_BlingColor;
uniform vec2 u_resolution;
uniform float u_PlaneWidth;
uniform float u_PlaneHeight;
uniform float u_Radius;
uniform float u_Frequency;
uniform float u_Speed;
uniform float u_time;
void main() {
    float alpha = 1.0;
    float distance = length(v_Position.xy);
    float de = abs(cos(distance*u_Frequency + u_time/3.14/u_Speed));//闪动
    de = clamp(de, 0.1, 1.0);
    if(distance < u_Radius){
        alpha = sin(distance/(u_Radius/2.0)*3.14/2.0);//半径一半处不透明度最高
        gl_FragColor=vec4(de * u_BlingColor,alpha);
    }else{
        // gl_FragColor=vec4(0,0.3,0,0.4);
        discard;
    }
}
`;
var scene, camera, renderer;
var uniforms;
var plane, planeMaterial, planeMesh;

var planeWidth = 6.0;
var planeHeight = 6.0;
var radius = 3.0;
var frequency = 2.0;
var speed = 2.0;
var color = new THREE.Vector3(0, 1.0, 0);
(function main() {
    document.title = 'threejs 实现点位闪动';
    init();
    addHelper();
    addPlane();
    camera.position.z = 3;
    camera.lookAt(planeMesh.position);
    animate();
})(window)

function animate() {
    requestAnimationFrame(animate);
    uniforms.u_time.value -= 0.3;
    renderer.render(scene, camera);
}

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var ambientLight = new THREE.AmbientLight('#FFF');
    scene.add(ambientLight);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function addHelper() {
    var cameraHelper = new THREE.CameraHelper(camera);
    scene.add(cameraHelper);
    var axesHelper = new THREE.AxesHelper(planeHeight);
    scene.add(axesHelper);
    new THREE.OrbitControls(camera, renderer.domElement);

}

function addPlane() {
    plane = new THREE.PlaneBufferGeometry(planeWidth, planeHeight);
    //配置着色器里面的attribute变量的值
    var attributes = {};
    uniforms = {
        u_time: {
            type: "f",
            value: 1.0
        },
        u_alpha: {
            type: 'f',
            value: 1.0
        },
        u_PlaneWidth: {
            type: 'f',
            value: planeWidth
        },
        u_PlaneHeight: {
            type: 'f',
            value: planeHeight
        },
        u_Radius: {
            type: "f",
            value: radius
        },
        u_Frequency: {
            type: "f",
            value: frequency
        },
        u_Speed: {
            type: "f",
            value: speed
        },
        u_BlingColor: {
            type: "v3",
            value: color
        }
    };
    planeMaterial = new THREE.ShaderMaterial({
        defaultAttributeValues: attributes,
        uniforms: uniforms,
        DoubleSide: true,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true//启用透明通道
    });

    planeMesh = new THREE.Mesh(plane, planeMaterial);
    scene.add(planeMesh);
}


