import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export function func() {

  const clock = new THREE.Clock();

  const canvas = document.querySelector("canvas.content");
  const scene = new THREE.Scene();

  var reqNewMouseCords = true;
  var intervalID = window.setInterval(saveMousePos, 500);

  // mouse coordinates = [ 'CURRENT', '500ms AGO' ]
  var currentMousePos = {x: 0, y: 0};
  var prevMousePos = {x: 0, y: 0};

  document.onmousemove = updateCurrentMouse;

  function updateCurrentMouse(e) {
    // console.log(e);
    currentMousePos = {x: e.screenX, y: e.screenY}
    
    if (reqNewMouseCords) {
      prevMousePos = {x: e.screenX, y: e.screenY}
      reqNewMouseCords = false;
    }
  }

  function saveMousePos() {
    reqNewMouseCords = true;
  }

  /**
   * LIGHTS
   */

  var blueLight = new THREE.DirectionalLight(0xe47025, 5);
  blueLight.position.setScalar(10);
  var orangeLight = new THREE.DirectionalLight(0x66b2b2, 2);
  orangeLight.position.setScalar(-10);

  scene.add(orangeLight);
  scene.add(blueLight);
  scene.add(new THREE.AmbientLight(0xffffff, 0.1625));

  /**
   * CAMERA
   */

  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );
  camera.position.set(0, 0, -30);

  /**
   * RENDERER & CONTROLS
   */

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: !0,
    alpha: !0,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true;
  orbitControls.target.set(0, 1, 0);

  const sceneMeshes = [];

  const dragControls = new DragControls(
    sceneMeshes,
    camera,
    renderer.domElement
  );
  dragControls.addEventListener("dragstart", function (event) {
    orbitControls.enabled = false;
  });
  dragControls.addEventListener("dragend", function (event) {
    orbitControls.enabled = true;

    let diffX = (prevMousePos.x - currentMousePos.x);
    let diffY = (prevMousePos.y - currentMousePos.y);

    console.log(diffX);
    console.log(diffY);
    console.log("-----");

    event.object.translateX(diffX*10);
    event.object.translateY(diffY*10);
    
  });

  const gltfLoader = new GLTFLoader();

  let modelReady = false;
  let modelPaths = [
    "/objects/ball.gltf",
    "/objects/column.gltf",
    "/objects/cone.gltf",
    "/objects/lantern.gltf",
    "/objects/shoe.gltf",
    "/objects/tree.gltf",
  ];

  let models = [];
  let groups = [];
  let dragBoxes = [];

  let positions = [];

  for (var i in modelPaths) {
    let modelGroup = new THREE.Group();
    let modelDragBox = new THREE.Mesh();

    gltfLoader.load(modelPaths[i], (gltf) => {
      gltf.scene.traverse(function (child) {
        if (child instanceof THREE.Group) {
          modelGroup = child;
        }
        if (child.isMesh) {
          child.castShadow = true;
          child.frustumCulled = false;
          child.geometry.computeVertexNormals();
        }
      });

      const box = new THREE.Box3().setFromObject(gltf.scene);
      const size = box.getSize(new THREE.Vector3());

      const randomPosX = THREE.MathUtils.randFloat(-20, 20);
      const randomPosY = THREE.MathUtils.randFloat(-8, 8);

      modelDragBox = new THREE.Mesh(
        new THREE.BoxGeometry(size.x, size.y, size.z),
        new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 0,
          //   color: 0x00ff00,
        })
      );

      modelDragBox.position.set(randomPosX, randomPosY, 0);
      gltf.scene.position.set(randomPosX, randomPosY, 0);

      scene.add(modelDragBox);
      sceneMeshes.push(modelDragBox);

      scene.add(gltf.scene);

      models.push(gltf);
      dragBoxes.push(modelDragBox);
      groups.push(modelGroup);

      positions.push([gltf.scene.position, gltf.scene.position]);

      modelReady = true;
    });
  }

  function animate() {
    requestAnimationFrame(animate);

    orbitControls.update();

    if (modelReady) {
      for (var i = 0; i < models.length; i++) {
        groups[i].position.copy(dragBoxes[i].position);
      }

      models[0].scene.rotation.y = 0.5 * clock.getElapsedTime();
      dragBoxes[0].rotation.y = 0.5 * clock.getElapsedTime();
      dragBoxes[0].position.y += Math.cos(clock.getElapsedTime()) * 0.01;

      models[1].scene.rotation.y = 2 * clock.getElapsedTime();
      models[1].scene.rotation.z = Math.cos(clock.getElapsedTime()) * 0.2;
      dragBoxes[1].rotation.y = 2 * clock.getElapsedTime();
      dragBoxes[1].rotation.z = Math.cos(clock.getElapsedTime()) * 0.2;
      dragBoxes[1].position.y += Math.cos(clock.getElapsedTime()) * 0.01;

      models[2].scene.rotation.x = 0.6 * clock.getElapsedTime();
      models[2].scene.rotation.y = 0.6 * clock.getElapsedTime();
      models[2].scene.rotation.z = 1 * clock.getElapsedTime();
      dragBoxes[2].rotation.x = 0.6 * clock.getElapsedTime();
      dragBoxes[2].rotation.y = 0.6 * clock.getElapsedTime();
      dragBoxes[2].rotation.z = 1 * clock.getElapsedTime();
      dragBoxes[2].position.y += Math.cos(clock.getElapsedTime()) * 0.01;

      models[3].scene.rotation.y = 2 * clock.getElapsedTime();
      models[3].scene.rotation.z = Math.cos(clock.getElapsedTime()) * 0.8;
      dragBoxes[3].rotation.y = 2 * clock.getElapsedTime();
      dragBoxes[3].rotation.z = Math.cos(clock.getElapsedTime()) * 0.8;
      dragBoxes[3].position.y += Math.cos(clock.getElapsedTime()) * 0.01;

      models[4].scene.rotation.x = 0.3 * clock.getElapsedTime();
      models[4].scene.rotation.y = 0.3 * clock.getElapsedTime();
      models[4].scene.rotation.x = Math.cos(clock.getElapsedTime() + 5) * 0.2;
      dragBoxes[4].rotation.x = 0.3 * clock.getElapsedTime();
      dragBoxes[4].rotation.y = 0.3 * clock.getElapsedTime();
      dragBoxes[4].rotation.x = Math.cos(clock.getElapsedTime() + 5) * 0.2;
      dragBoxes[4].position.y += Math.cos(clock.getElapsedTime()) * 0.01;

      models[5].scene.rotation.y = 0.5 * clock.getElapsedTime();
      dragBoxes[5].rotation.y = 0.5 * clock.getElapsedTime();
      dragBoxes[5].position.y += Math.cos(clock.getElapsedTime()) * 0.01;
    }

    render();
  }

  function render() {
    renderer.render(scene, camera);
  }

  animate();
}
