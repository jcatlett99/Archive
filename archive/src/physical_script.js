import "../static/personal_style.css";
import file from "../static/maze.json";

export function physical(THREE, OBJLoader) {

  let c = document.getElementById("raycastingCanvas");
  let context = c.getContext("2d");
  let canvasWidth = (c.width = window.innerWidth - 32);
  let canvasHeight = (c.height = window.innerHeight - 100);
  let offsetX = c.offsetLeft;
  let offsetY = c.offsetTop;
  let cols = 30;
  let rows = 30;

  let walls = [];
  let grid = [];

  let gridJSON = file;

  let current;

  let mouse = {
    x: 0,
    y: 0,
  };

  let mouseMove = function (event) {
    mouse.x = event.pageX - offsetX;
    mouse.y = event.pageY - offsetY;
  };

  c.addEventListener("mousemove", mouseMove);

  // helper functions
  let degreeToRadian = function (degree) {
    return (degree / 180) * Math.PI;
  };

  // vector object
  let Vector = function (x, y) {
    this.x = x;
    this.y = y;
  };

  // static vector object methods
  Vector.fromAngle = function (angle, v) {
    if (v === undefined || v === null) {
      v = new Vector();
    }
    v.x = Math.cos(angle);
    v.y = Math.sin(angle);
    return v;
  };

  Vector.dist = function (v1, v2) {
    let dx = v1.x - v2.x,
      dy = v1.y - v2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // vector object instance methods
  Vector.prototype.mag = function () {
    let x = this.x,
      y = this.y,
      z = this.z;
    return Math.sqrt(x * x + y * y + z * z);
  };

  Vector.prototype.div = function (v) {
    if (typeof v === "number") {
      this.x /= v;
      this.y /= v;
      this.z /= v;
    } else {
      this.x /= v.x;
      this.y /= v.y;
      this.z /= v.z;
    }
  };

  Vector.prototype.normalize = function () {
    let m = this.mag();
    if (m > 0) {
      this.div(m);
    }
  };

  let Cell = function (i, j, walls) {
    this.i = i;
    this.j = j;

    this.walls = walls;
    this.visited = false;
  };

  Cell.prototype.show = function () {
    let x = this.i * (canvasWidth / cols);
    let y = this.j * (canvasHeight / rows);

    if (this.walls[0])
      walls.push(
        new Boundary(new Vector(x, y), new Vector(x + canvasWidth / cols, y))
      );
    if (this.walls[1])
      walls.push(
        new Boundary(
          new Vector(x + canvasWidth / cols, y),
          new Vector(x + canvasWidth / cols, y + canvasHeight / rows)
        )
      );
    if (this.walls[2])
      walls.push(
        new Boundary(
          new Vector(x + canvasWidth / cols, y + canvasHeight / rows),
          new Vector(x, y + canvasHeight / rows)
        )
      );
    if (this.walls[3])
      walls.push(
        new Boundary(new Vector(x, y + canvasHeight / rows), new Vector(x, y))
      );
  };

  // boundary object a: vector, b: vector
  let Boundary = function (aVec, bVec) {
    this.a = aVec;
    this.b = bVec;
  };

  Boundary.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.moveTo(this.a.x, this.a.y);
    ctx.lineTo(this.b.x, this.b.y);
    ctx.strokeStyle = "rgba(255, 255, 255, 1)";
    ctx.stroke();
  };

  // ray object
  let Ray = function (pos, angle) {
    this.pos = pos;
    this.dir = Vector.fromAngle(angle);
  };

  Ray.prototype.cast = function (boundary) {
    const x1 = boundary.a.x;
    const y1 = boundary.a.y;
    const x2 = boundary.b.x;
    const y2 = boundary.b.y;

    const x3 = this.pos.x;
    const y3 = this.pos.y;
    const x4 = this.pos.x + this.dir.x;
    const y4 = this.pos.y + this.dir.y;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    // if denominator is zero then the ray and boundary are parallel
    if (den === 0) {
      return;
    }

    // numerator divided by denominator
    let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    let u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    if (t > 0 && t < 1 && u > 0) {
      const pt = new Vector();
      pt.x = x1 + t * (x2 - x1);
      pt.y = y1 + t * (y2 - y1);
      return pt;
    } else {
      return;
    }
  };

  // particle object
  let Particle = function (pos, divisor) {
    this.pos = pos;
    this.rays = [];
    this.divisor = divisor || 10; // the degree of approximation
    for (let a = 0; a < 360; a += this.divisor) {
      this.rays.push(new Ray(this.pos, degreeToRadian(a)));
    }
  };

  Particle.prototype.update = function (x, y) {
    this.pos.x = x;
    this.pos.y = y;
  };

  Particle.prototype.look = function (ctx, walls) {
    for (let i = 0; i < this.rays.length; i++) {
      let pt;
      let closest = null;
      let record = Infinity;

      for (let j = 0; j < walls.length; j++) {
        pt = this.rays[i].cast(walls[j]);

        if (pt) {
          const dist = Vector.dist(this.pos, pt);
          if (dist < record) {
            record = dist;
            closest = pt;
          }
        }
      }

      if (closest) {
        ctx.beginPath();
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(closest.x, closest.y);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.stroke();
      }
    }
  };

  Particle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 5, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(255, 255, 255, 1)";
    ctx.stroke();
    /* test line to show all rays
      for (let i = 0; i < this.rays.length; i++) {
        this.rays[i].draw(ctx);
      }*/
  };

  for (let index in gridJSON) {
    let item = gridJSON[index];
    let cell = new Cell(item.i, item.j, item.walls);
    grid.push(cell);
    cell.show();
  }

  console.log(grid);

  current = grid[0];
  current.visited = true;

  // let wall = new Boundary(new Vector(375, 250), new Vector(375,50));
  // walls.push(wall);
  // let wall2 = new Boundary(new Vector(100, 100), new Vector(250, 250));
  // walls.push(wall2);
  // let wall3 = new Boundary(new Vector(50, 100), new Vector(250, 100));
  // walls.push(wall3);
  // let wall4 = new Boundary(new Vector(50, 50), new Vector(250, 50));
  // walls.push(wall4);
  let wall5 = new Boundary(new Vector(0, 0), new Vector(0, canvasHeight));
  walls.push(wall5);
  let wall6 = new Boundary(new Vector(0, 0), new Vector(canvasWidth, 0));
  walls.push(wall6);
  let wall8 = new Boundary(
    new Vector(0, canvasHeight),
    new Vector(canvasWidth, canvasHeight)
  );
  walls.push(wall8);
  let wall7 = new Boundary(
    new Vector(canvasWidth, 0),
    new Vector(canvasWidth, canvasHeight)
  );
  walls.push(wall7);

  let particle = new Particle(new Vector(200, 200), 1);

  // main loop
  let main = function () {
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    context.fillStyle = "black";
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    for (let i = 0; i < walls.length; i++) {
      walls[i].draw(context);
    }

    wall7.draw(context);

    particle.update(mouse.x, mouse.y); // moves particle
    particle.draw(context); // draws particle
    particle.look(context, walls); // draws rays

    window.requestAnimationFrame(main);
  };
  main();

  //////////////////////

  let image_array = [];
  let css3_array = [2, 3, 20, 24];
  let css2_array = [1, 6, 8, 12, 13, 17, 22];

  for (let i = 0; i < 39; i++) {
    let imgPreload = new Image();
    let temp = {
      name: i,
      value: $(imgPreload).attr({ src: "/physical_images/" + i + ".jpg" }),
    };
    image_array.push(temp);
  }

  for (let i = 0; i < image_array.length; i++) {
    let img = document.createElement("img");
    img.src = image_array[i].value.get(0).currentSrc;
    img.classList.add("images");

    if (css2_array.includes(i)) img.style.gridColumn = "1 / span 2";
    if (css3_array.includes(i)) img.style.gridColumn = "span 3";

    document.querySelector("#pictureBar").appendChild(img);
  }

  window.onload = function () {
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
  };

  const canvas = document.querySelector("canvas.webgl");
  const scene = new THREE.Scene();

  const r = "psuedoflat/";
  const urls2 = [
    r + "px-s@2x.png",
    r + "nx-s@2x.png",
    r + "py-s@2x.png",
    r + "ny-s@2x.png",
    r + "pz-s@2x.png",
    r + "nz-s@2x.png",
  ];

  const textureCube = new THREE.CubeTextureLoader().load(urls2);
  textureCube.mapping = THREE.CubeRefractionMapping;
  const texture = new THREE.TextureLoader().load("/textures/diffuse.jpg");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  const normal = new THREE.TextureLoader().load(
    "/textures/stone3_uv_Default_Normal.png"
  );
  normal.wrapS = THREE.RepeatWrapping;
  normal.wrapT = THREE.RepeatWrapping;
  normal.repeat.set(1, 1);

  const cubeMaterial = new THREE.MeshPhongMaterial({
    color: 0x000001,
    normalMap: texture,
    normalScale: new THREE.Vector3(0.001, 0.001),
    envMap: textureCube,
    aoMap: normal,
    aoMapIntensity: 10,
    alphaMap: texture,
    refractionRatio: 0.2,
    reflectivity: 1,
    shininess: 100,
    specular: 0xffffff,
    emissive: 0xffffff,
    morphTargets: true,
  });

  const group = new THREE.Group();
  const objLoader = new OBJLoader();
  let obj;
  objLoader.load("/textures/centred_stone.obj", (object) => {
    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        if (child.isMesh) obj = child.clone();

        obj.scale.set(0.9, 0.9, 0.9);
        obj.material = cubeMaterial;

        var center = new THREE.Vector3();
        obj.geometry.computeBoundingBox();
        obj.geometry.boundingBox.getCenter(center);
        obj.geometry.center();
        obj.position.copy(center);

        let morphAttributes = obj.geometry.morphAttributes;
        morphAttributes.position = [];
        obj.material.morphTargets = true;

        let position = obj.geometry.attributes.position.clone();

        for (let j = 0, jl = position.count; j < jl; j++) {
          position.setXYZ(
            j,
            position.getX(j) * 2,
            position.getY(j) * 2,
            position.getZ(j) * 2
          );
        }

        morphAttributes.position.push(position); // I forgot this earlier.
        obj.updateMorphTargets();
        obj.morphTargetInfluences[0] = 0;

        group.add(obj);
      }
    });
  });

  scene.add(group);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: !0,
    alpha: !0,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xffffff, 0);

  /**
   * Lights
   */
  const pointLight2 = new THREE.PointLight(0xff0000, 10);
  pointLight2.position.set(-500, -500, -400);
  scene.add(pointLight2);

  const pointLight1 = new THREE.PointLight(0xdd5577, 5);
  pointLight1.position.set(600, 2000, -200);
  scene.add(pointLight1);

  /**
   * Camera
   */
  let camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );
  camera.position.z = 100;
  scene.add(camera);

  /**
   * Animate
   */

  const clock = new THREE.Clock();

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    group.rotation.x = 0.8 * elapsedTime;
    group.rotation.y = 0.8 * elapsedTime;

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };
  tick();

  const cameraCanvas = document.querySelector("canvas.videoCanvas");
  const cameraScene = new THREE.Scene();

  let video = document.getElementById("video");
  const videoTexture = new THREE.VideoTexture(video);

  let w = cameraCanvas.width;
  let h = cameraCanvas.height;

  const videoGeometry = new THREE.PlaneGeometry(w, h);
  videoGeometry.scale(0.5, 0.5, 0.5);
  const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });

  const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
  cameraScene.add(videoMesh);

  initWebcamInput();

  function initWebcamInput() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          video.srcObject = stream;
          video.play();
        })
        .catch(function (error) {
          console.error("Unable to access the camera/webcam.", error);
        });
    } else {
      console.error("MediaDevices interface not available.");
    }
  }

  const cameraRenderer = new THREE.WebGLRenderer({
    canvas: cameraCanvas,
    antialias: !0,
    alpha: !0,
  });
  cameraRenderer.setSize(window.innerWidth, window.innerHeight);
  cameraRenderer.setPixelRatio(window.devicePixelRatio);
  cameraRenderer.setClearColor(0xffffff, 0);

  let vidCamera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );
  vidCamera.position.z = 100;
  cameraScene.add(vidCamera);

  const video_tick = () => {
    cameraRenderer.render(cameraScene, vidCamera);
    window.requestAnimationFrame(video_tick);
  };
  video_tick();

  function showImages(el) {
    let windowHeight = jQuery(window).height();
    $(el).each(function () {
      let thisPos = $(this).offset().top;

      let topOfWindow = $(window).scrollTop();
      if (topOfWindow + windowHeight - 200 > thisPos) {
        $(this).addClass("fadeIn");
      }
    });
  }

  // if the image in the window of browser when the page is loaded, show that image
  $(document).ready(function () {
    showImages(".images");
  });

  // if the image in the window of browser when scrolling the page, show that image
  $(window).scroll(function () {
    showImages(".images");
  });

  function isScrolledIntoView(elem) {
    let docViewTop = $(window).scrollTop();
    let docViewBottom = docViewTop + $(window).height();

    let elemTop = $(elem).offset().top;
    let elemBottom = elemTop + $(elem).height();

    return elemBottom <= docViewBottom && elemTop >= docViewTop;
  }

    $(window).scroll(function () {
        const children = document.querySelector('#textBar').childNodes;
        children.forEach(child => {
            // console.log(child)
            child.childNodes.forEach(grandchild => {
                if (grandchild.id != null && isScrolledIntoView('#' + grandchild.id)) {
                    // console.log("#..", grandchild.id)
                    $('#' + grandchild.id).addClass('animation');
                }
            })
        });
    });

  document.querySelector("#go_home").addEventListener("click", () => {
    document.location.href = "/index.html";
  });
}
