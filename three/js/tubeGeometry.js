function CustomSinCurve(scale) {

    THREE.Curve.call(this);

    this.scale = (scale === undefined) ? 1 : scale;

}

CustomSinCurve.prototype = Object.create(THREE.Curve.prototype);
CustomSinCurve.prototype.constructor = CustomSinCurve;

CustomSinCurve.prototype.getPoint = function (t) {

    var tx = t * 3 - 1.5;
    var ty = Math.sin(2 * Math.PI * t);
    var tz = 0;

    return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);

};

function createCube(path) {
    var seg = path ? path.length : 20;
    path = path || new CustomSinCurve(10);
    var geometry = new THREE.TubeGeometry(path, seg, 2, 8, false);
    //var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

    var textureLoader = new THREE.TextureLoader();
    var textureUrl = '../images/riverFlow.png';
    var texture = textureLoader.load(textureUrl);

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.repeat.x = 10;
    texture.repeat.y = 4;

    texture.offset.y = 0.5;
    /* var tubeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true
    }); */
    var tubeMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true
    });

    var tubeMesh = new THREE.Mesh(geometry, tubeMaterial);
    setInterval(() => {
        texture.offset.x -= 0.0076;
    });
    return tubeMesh
}

function createLine(path){
    var thing = new THREE.Object3D()
    var shape = new THREE.Shape();
    /* var linGeometry = new THREE.Geometry();
    for (let i = 0; i < path.length; i++) {
        var x = path[i].x;
        var y = path[i].y;
        var z = path[i].z;
        if (i === 0) {
            shape.moveTo(x, y);
            camera.lookAt(path[i]);
        }
        shape.lineTo(x, y);
        linGeometry.vertices.push(new THREE.Vector3(x, y, z))
    } */
    //path = [new THREE.Vector3(-2,-2,0),new THREE.Vector3(2,2,0)];
    path = [new THREE.Vector3(9.74,-22.6,0),new THREE.Vector3(9.73,22.7,0)];
    var linGeometry = new THREE.BufferGeometry().setFromPoints( path );
    var extrudeSettings = {
        depth: 4,
        bevelEnabled: false
    };
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    var material = new THREE.MeshBasicMaterial({ color: '#d13a34', transparent: true, opacity: 0.6 })
    var mesh = new THREE.Mesh(geometry, material);
    
    var lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0xffffff ,
        lineWidth:6
    })
    var line = new THREE.Line2(linGeometry, lineMaterial);
    //thing.add(mesh);
    //thing.add(line);
    return line
}

function loadGeoJson(callbak) {
    var url = 'data/water_SNST.json';
    
    $.getJSON(url, function (result) {
        var features = result.features;
        var tubePath = [];
        for (var i = 0; i < features.length; i++) {
            var feature = features[i];
            var path = feature.geometry.rings[0];
            var arr = [];
            for (var j = 0; j < path.length; j++) {
                var coord = lnglatToMector(path[j]);
                // var coord = path[j];
                var vec3 = new THREE.Vector3(coord[0],coord[1],0);
                arr.push(vec3);
            }
            tubePath.push(arr);
        }
        callbak(tubePath);
    })
}

var projection;
function lnglatToMector(coord) {
    if (!projection) {
        projection = d3.geoMercator().center([104.0, 37.5]).scale(80).translate([0, 0]);
      /* projection = d3
        .geoMercator()
        .center([108.904496, 32.668849])
        .scale(80)
        .rotate(Math.PI / 4)
        .translate([0, 0]); */
    }
    const [y, x] = projection([...coord]);
    let z = 0;
    return [x, -y, z];
  }



var scene, camera, renderer, controls;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;
    var ambientLight = new THREE.AmbientLight('#FFF');
    scene.add(ambientLight);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}



(
    function main() {
        init();
        loadGeoJson(function(tubePath){
            for(var i=0; i<tubePath.length; i++){
                if(i>0){
                    break;
                }
                //var curve = new THREE.CatmullRomCurve3(tubePath[i]);
                // var tubeMesh = createCube(curve);
                //var tubeMesh = createCube();
                // scene.add(tubeMesh);

                var lineMesh = createLine(tubePath[i]);
                scene.add(lineMesh);
                camera.lookAt(lineMesh);
                
            }
            camera.position.x=9.73;
            camera.position.y = -22.26;
            camera.position.z = 5;
            
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            renderer.render(scene, camera);
            animate();
        });
        
        
    }
)()