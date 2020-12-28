/* import * as THREE from "http://localhost:8080/three/build/three.module.js";
import { OrbitControls } from "http://localhost:8080/three/examples/jsm/controls/OrbitControls.js";
import Stats from "http://localhost:8080/three/examples/jsm/libs/stats.module.js";
import { GeometryUtils } from "http://localhost:8080/three/examples/jsm/utils/GeometryUtils.js"; */

var renderer, scene, camera, stats, controls;
var objects = [];
var customMateria, customUniforms;

var WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight;

getJsonData("ArcgisJSON");

function getJsonData(type) {
  var url;
  switch (type) {
    case "GeoJSON":
      url = "../data/AllProvinces.json";
      $.getJSON(url, geoJsonHandler);
      break;
    case "ArcgisJSON":
      url = "../data/CZ_SY_Rivers.json";
      $.getJSON(url, arcgisJsonHandler);
      break;
  }
}

function geoJsonHandler(data) {
  let xjRings = null;
  let feature = null;
  for (let i = 0; i < data.features.length; i++) {
    feature = data.features[i];
    if (feature.properties.name == "新疆维吾尔自治区") {
      xjRings = feature.geometry.coordinates[0][0];
      break;
    }
  }
  //设置投影
  let projection = d3
    .geoMercator()
    .center([86.161412, 41.662478])
    .scale(1200)
    .translate([0, 0]);

  let mercatorRings = [];
  let z = 1;
  for (let i = 0, len = xjRings.length; i < len; i++) {
    let coord = xjRings[i];
    let newCoord = projection(coord);
    mercatorRings.push(newCoord[0]);
    mercatorRings.push(-newCoord[1]);
    mercatorRings.push(z);
  }

  init(mercatorRings);
  animate();
}

function arcgisJsonHandler(data) {
  let xjRings = null;
  let feature = null;
  for (let i = 0; i < data.features.length; i++) {
    feature = data.features[i];
    if (feature.attributes.RiverOID == 3) {
      xjRings = feature.geometry.paths[0];
      break;
    }
  }
  //设置投影
  let projection = d3
    .geoMercator()
    .center([120.04314, 31.73057])
    .scale(100000)
    .translate([0, 0]);

  let mercatorRings = [];
  let z = 1;
  for (let i = 0, len = xjRings.length; i < len; i++) {
    let coord = xjRings[i];
    let newCoord = projection(coord);
    mercatorRings.push(newCoord[0]);
    mercatorRings.push(-newCoord[1]);
    mercatorRings.push(z);
  }
  // console.log(mercatorRings);
  /*
  0: -450.3640620528313
  1: 291.9001123656926

  1686:-450.3640620528313
  1687: 291.9001123656926
  */
  init(mercatorRings);
  animate();
}

function init(arrPostion) {
  camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 1, 1000);
  camera.position.z = 800;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdddddd);
  scene.fog = new THREE.Fog(0xdddddd, 900, 1000);

  let geometrySpline = new THREE.BufferGeometry().setAttribute(
    "position",
    new THREE.Float32BufferAttribute(arrPostion, 3)
  );

  /////////////// 自定义材质 ////////////////
  customUniforms = {
    customColor: { value: new THREE.Color(0xff0000) },
    customOffset: { value: 1 },
    scale: { value: 1 },
    dashSize: { value: 20 }, //显示线段的大小。默认为3。
    gapSize: { value: 20 }, //间隙的大小。默认为1
    totalSize: { value: 40 }
  };
  customMateria = new THREE.ShaderMaterial({
    uniforms: customUniforms,
    linewidth: 5,
    vertexShader: document.getElementById("vertexShader_lineDashed")
      .textContent,
    fragmentShader: document.getElementById("fragmentShader_lineDashed")
      .textContent
  });

  line = new THREE.Line(geometrySpline, customMateria);
  ///////////////// 自定义材质 //////////////////

  line.computeLineDistances();

  objects.push(line);
  scene.add(line);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(WIDTH, HEIGHT);

  var container = document.getElementById("container");
  container.appendChild(renderer.domElement);

  /* stats = new Stats();
  container.appendChild(stats.dom);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 10;
  controls.maxDistance = 500; */
  //

  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  render();
  //   stats.update();
}

function render() {
  let customOffsetValue = customUniforms.customOffset.value + 1;
  customOffsetValue %= customUniforms.totalSize.value;
  customOffsetValue = Math.abs(customOffsetValue.toFixed(1));
  customUniforms.customOffset.value = customOffsetValue;
  // console.log(customUniforms.customOffset.value)
  /* var time = Date.now() * 0.001;
  
    scene.traverse(function(object) {
      if (object.isLine) {
        object.rotation.x = 0.25 * time;
        object.rotation.y = 0.25 * time;
      }
    }); */

  renderer.render(scene, camera);
}
