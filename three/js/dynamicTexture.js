var path = [
    4.99, 9.38, 0,
    13.69, 3.14, 0
];
var radius = 50;
var textureUrl = '../images/riverFlow.png';
var scene, camera, renderer;
var uniforms;

var vertexShader = `
varying vec3 v_Position;
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);//改成这样才能用鼠标控制
    v_Position = position.xyz;
    // gl_Position = vec4( position, 1.0 );
}`;
var fragmentShader = `
varying vec3 v_Position;
uniform float u_PlaneWidth;
uniform float u_PlaneHeight;
uniform float u_Radius;
uniform vec2 u_resolution;
uniform float u_time;
void main() {
    //vec2 st = gl_FragCoord.xy/u_resolution.xy;
    //gl_FragColor=vec4(st.x,st.y,1.0,0.0);

    float width = 2.0;
    float height = 2.0;
    //----------矩形
    /* if(gl_FragCoord.x>width/2.0 && gl_FragCoord.y > height/2.0){
        gl_FragColor=vec4(1.0,1.0,0.0,0.0);
    }else{
        gl_FragColor=vec4(1.0,0.0,0.0,0.0);
    } */
    //----------圆----- 图形没有跟着平面旋转
    // float size = 2.0;
    float alpha = 1.0;
    float dx = v_Position.x - u_PlaneWidth/16.0;
    float dy = v_Position.y - u_PlaneHeight/16.0;
    float distance = sqrt(dx*dx + dy*dy);
    float de = cos(distance*16.0 + u_time/3.14);
    de = clamp(de, 0.0, 1.0);
    if(distance < u_Radius){
        alpha = cos((u_Radius - 2.0*distance)/u_Radius * 3.14 /2.0);
        gl_FragColor=vec4(de,0,0,alpha);
    }else{
        gl_FragColor=vec4(0,0.3,0,0.4);
    }
}`;

(
    function main() {
        init();
        /* var tube = createCube(path, radius);
        scene.add( tube );
        camera.lookAt(tube.position);
        camera.position.z = 10; */

        camera.position.z = 3;
        // camera.position = new THREE.Vector3(0, 0, 3);


        var boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        var boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var cube = new THREE.Mesh(boxGeometry, boxMaterial);
        // scene.add(cube);

        var planeWidth = 6.0;
        var planeHeight = 6.0;
        var radius = 3.0;
        var plane = new THREE.PlaneBufferGeometry(planeWidth, planeHeight);
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
            u_resolution: {
                type: "v2",
                value: new THREE.Vector2(2560, 1262)
            },
            u_mouse: {
                type: "v2",
                value: new THREE.Vector2()
            }
        };
        var planeMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true//启用透明通道
        });

        var planeMesh = new THREE.Mesh(plane, planeMaterial);
        scene.add(planeMesh);

        new THREE.OrbitControls(camera, renderer.domElement);
        var axesHelper = new THREE.AxesHelper(planeHeight);
        scene.add(axesHelper);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        renderer.render(scene, camera);
        animate();
    }
)()

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var ambientLight = new THREE.AmbientLight('#FFF');
    scene.add(ambientLight);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function createCube(path, radius) {
    var arrCurve = [];
    for (var i = 0; i < path.length; i += 3) {
        arrCurve.push(new THREE.Vector3(path[i], path[i + 1], path[i + 2]));
    }
    var curve = new THREE.CatmullRomCurve3(arrCurve);
    var tubeGeometry = new THREE.TubeGeometry(curve, 100, radius, 50, false);
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load(textureUrl);

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.repeat.x = 10;
    texture.repeat.y = 4;

    texture.offset.y = 0.5;
    var tubeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true
    });
    /* var tubeMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true
    }); */

    var tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    setInterval(() => {
        texture.offset.x -= 0.0076;
    });
    return tube
}

function animate() {
    requestAnimationFrame(animate);
    uniforms.u_time.value -= 0.3;
    renderer.render(scene, camera);
}