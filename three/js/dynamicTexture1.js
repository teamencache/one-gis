var container;
var camera, scene, renderer;
var orbitControls;
var uniforms;
var vertexShader = `void main() {
    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);//改成这样才能用鼠标控制
    gl_Position = vec4( position, 1.0 );
}`;
var fragmentShader = `uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    gl_FragColor=vec4(st.x,st.y,1.0,0.0);
    //----------
    //float dx = gl_FragCoord.x - 0.5;
    //float dy = gl_FragCoord.y -0.5;
    //float distance = sqrt(dx*dx + dy*dy);
    //float de = cos(distance/0.5);
    //de = clamp(de, 0.0, 1.0);
    //gl_FragColor=vec4(de,de,1.0,0.0);
}`;

init();
animate();

function init() {
    container = document.body;
    /* camera = new THREE.Camera();
    camera.position.z = 3;
    camera.position.x = 0;
    camera.position.y = 0; */
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position = new THREE.Vector3(0, 0, 3);
    var ambientLight = new THREE.AmbientLight('#FFF');
    scene.add(ambientLight);

    var geometry = new THREE.PlaneBufferGeometry(1, 1);

    uniforms = {
        u_time: {
            type: "f",
            value: 1.0
        },
        u_resolution: {
            type: "v2",
            value: new THREE.Vector2()
        },
        u_mouse: {
            type: "v2",
            value: new THREE.Vector2()
        }
    };

    var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    var box = new THREE.BoxGeometry(1, 1, 1);
    var boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(box, boxMaterial);
    scene.add(cube);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);

    /* document.onmousemove = function (e) {
        uniforms.u_resolution.value.x = e.pageX
        uniforms.u_resolution.value.y = e.pageY
    } */
}

function onWindowResize(event) {
    renderer.setSize(window.innerWidth, window.innerHeight);
    uniforms.u_resolution.value.x = renderer.domElement.width;
    uniforms.u_resolution.value.y = renderer.domElement.height;
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    uniforms.u_time.value += 0.05;
    renderer.render(scene, camera);
}