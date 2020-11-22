var path = [
    4.99, 9.38, 0,
    13.69,3.14, 0
];
var radius = 50;
var textureUrl = '../images/riverFlow.png';
var scene,camera,renderer;

(
    function main(){
        init();
        /* var tube = createCube(path, radius);
        scene.add( tube );
        camera.lookAt(tube.position);
        camera.position.z = 10; */
        
        var geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } ); 
        var cube = new THREE.Mesh( geometry, material );
        scene.add(cube);
        camera.position.z = 5;

        new THREE.OrbitControls(camera, renderer.domElement);
        renderer.render( scene, camera );
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
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}