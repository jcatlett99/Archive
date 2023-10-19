import { func } from "./test-file";

export function social(THREE, OBJLoader, GLTFLoader) {
  func();

  window.onload = function () {
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
  };

  const textureLoader = new THREE.TextureLoader();
  const normalTexture = textureLoader.load("/textures/v1.png");

  const canvas = document.querySelector("canvas.webgl");
  const scene = new THREE.Scene();

  const sceneContent = new THREE.Scene();

  const geometryTorus = new THREE.TorusKnotGeometry(8, 4, 100, 10, 2, 3);
  geometryTorus.translate(0, 0, 0);
  const materialTorus = new THREE.MeshStandardMaterial();
  materialTorus.depthTest = false;
  materialTorus.normalMap = normalTexture;
  materialTorus.color = new THREE.Color(0x4fafa8);

  const torus = new THREE.Mesh(geometryTorus, materialTorus);
  torus.scale.set(4, 4, 4);
  scene.add(torus);

  /**
   * Lights
   */

  const pointLight2 = new THREE.PointLight(0xffffff, 10);
  pointLight2.position.set(-500, -500, -400);
  scene.add(pointLight2);

  const pointLight1 = new THREE.PointLight(0xffffff);
  pointLight1.position.set(600, 2000, -200);
  scene.add(pointLight1);

  //   var AmbientLight = new THREE.AmbientLight(0xffffff);
  //   AmbientLight.position.set(-100, 0, 0);
  //   AmbientLight.intensity = 5;
  //   scene.add(AmbientLight);

  /**
   * Camera
   */
  let camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );
  camera.position.z = 200;

  /**
   * Renderer
   */

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: !0,
    alpha: !0,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xffffff, 0);

  /**
   * Animate
   */

  const clock = new THREE.Clock();

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    torus.rotation.y = 0.4 * elapsedTime;
    torus.rotation.x = 0.4 * elapsedTime;

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };

  tick();

  const musicContainer = document.querySelector(".musicContainer");
  const playBtn = document.querySelector("#play");
  const prevBtn = document.querySelector("#prev");
  const nextBtn = document.querySelector("#next");
  const audio = document.querySelector("#audio");
  const progress = document.querySelector(".progress");

  function playSong() {
    musicContainer.classList.add("play");
    playBtn.querySelector("i.fas").classList.remove("fa-play");
    playBtn.querySelector("i.fas").classList.add("fa-pause");

    audio.play();
  }

  function pauseSong() {
    musicContainer.classList.remove("play");
    playBtn.querySelector("i.fas").classList.add("fa-play");
    playBtn.querySelector("i.fas").classList.remove("fa-pause");

    audio.pause();
  }

  playBtn.addEventListener("click", () => {
    const isPlaying = musicContainer.classList.contains("play");

    if (isPlaying) {
      pauseSong();
    } else {
      playSong();
    }
  });

  prevBtn.addEventListener("click", (event) => {
    const time = audio.currentTime;
    if (time <= 30) {
      audio.currentTime = 0;
    } else {
      audio.currentTime -= 30;
    }
  });

  nextBtn.addEventListener("click", (event) => {
    const time = audio.currentTime;
    const duration = audio.duration;
    if (time >= duration - 30) {
      audio.currentTime = duration;
    } else {
      audio.currentTime += 30;
    }
  });

  function updateProgress(event) {
    const { duration, currentTime } = event.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
  }

  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("ended", () => {
    document.location.href = "/index.html";
  });

  document.querySelector("#home_container").addEventListener("click", () => {
    document.location.href = "/index.html";
  });
}
