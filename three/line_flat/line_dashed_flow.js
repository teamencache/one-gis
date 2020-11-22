import * as THREE from "http://localhost:8080/three/build/three.module.js";
import { OrbitControls } from "http://localhost:8080/three/examples/jsm/controls/OrbitControls.js";

import Stats from "http://localhost:8080/three/examples/jsm/libs/stats.module.js";

import { GeometryUtils } from "http://localhost:8080/three/examples/jsm/utils/GeometryUtils.js";

var renderer, scene, camera, stats, controls;
var objects = [];
var customMateria, customUniforms;

var WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight;

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, 1, 200);
  camera.position.z = 150;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdddddd);
  scene.fog = new THREE.Fog(0xdddddd, 150, 200);

  var subdivisions = 6;
  var recursion = 1;

  var points = GeometryUtils.hilbert3D(
    new THREE.Vector3(0, 0, 0),
    25.0,
    recursion,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7
  );
  var spline = new THREE.CatmullRomCurve3(points);

  var samples = spline.getPoints(points.length * subdivisions);
  var geometrySpline = new THREE.BufferGeometry().setFromPoints(samples);

  var line = new THREE.Line(
    geometrySpline,
    new THREE.LineDashedMaterial({
      color: 0xffffff,
      dashSize: 1,
      gapSize: 0.5,
      linewidth: 5
    })
  );

  /////////////// 自定义材质 ////////////////
  customUniforms = {
    customColor:{ value: new THREE.Color( 0xff0000 ) },
    customOffset:{value:1},
    scale:{value:1},
    dashSize: {value:1}, //显示线段的大小。默认为3。
    gapSize: {value:1}, //间隙的大小。默认为1
    totalSize:{value:2},
  };
  customMateria = new THREE.ShaderMaterial({
    uniforms: customUniforms,
    linewidth:5,
    vertexShader: document.getElementById("vertexShader_lineDashed")
      .textContent,
    fragmentShader: document.getElementById("fragmentShader_lineDashed")
      .textContent
  });
  // customMateria.defines.USE_COLOR='';
  line = new THREE.Line(geometrySpline, customMateria);
  ///////////////// 自定义材质 //////////////////

  line.computeLineDistances();

  objects.push(line);
  scene.add(line);

  var geometryBox = box(50, 50, 50);

  var lineSegments = new THREE.LineSegments(
    geometryBox,
    new THREE.LineDashedMaterial({ color: 0xffaa00, dashSize: 3, gapSize: 1 })
  );
  lineSegments.computeLineDistances();

  objects.push(lineSegments);
  scene.add(lineSegments);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(WIDTH, HEIGHT);

  var container = document.getElementById("container");
  container.appendChild(renderer.domElement);

  stats = new Stats();
  container.appendChild(stats.dom);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 10;
  controls.maxDistance = 500;
  //

  window.addEventListener("resize", onWindowResize, false);
}

function box(width, height, depth) {
  (width = width * 0.5), (height = height * 0.5), (depth = depth * 0.5);

  var geometry = new THREE.BufferGeometry();
  var position = [];

  position.push(
    -width,
    -height,
    -depth,
    -width,
    height,
    -depth,

    -width,
    height,
    -depth,
    width,
    height,
    -depth,

    width,
    height,
    -depth,
    width,
    -height,
    -depth,

    width,
    -height,
    -depth,
    -width,
    -height,
    -depth,

    -width,
    -height,
    depth,
    -width,
    height,
    depth,

    -width,
    height,
    depth,
    width,
    height,
    depth,

    width,
    height,
    depth,
    width,
    -height,
    depth,

    width,
    -height,
    depth,
    -width,
    -height,
    depth,

    -width,
    -height,
    -depth,
    -width,
    -height,
    depth,

    -width,
    height,
    -depth,
    -width,
    height,
    depth,

    width,
    height,
    -depth,
    width,
    height,
    depth,

    width,
    -height,
    -depth,
    width,
    -height,
    depth
  );

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(position, 3)
  );

  return geometry;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  // requestAnimationFrame(animate);

  render();
  stats.update();
}

function render() {
  let customOffsetValue = customUniforms.customOffset.value + 0.1;
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
