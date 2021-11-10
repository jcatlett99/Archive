import './style.css';

export function index(OBJLoader, THREE) {

    const textureLoader = new THREE.TextureLoader();
    const normalTexture = textureLoader.load('/textures/NormalMap.png');
    const torusTexture = textureLoader.load('/textures/v1.png');

    const canvas = document.querySelector('canvas.webgl');
    const scene = new THREE.Scene();

    const geometryTorus = new THREE.TorusKnotGeometry(8, 4, 100, 10, 2, 3);
    geometryTorus.translate(-35, 0, -20);
    const materialTorus = new THREE.MeshStandardMaterial();
    materialTorus.depthTest = false;
    materialTorus.normalMap = torusTexture;
    materialTorus.color = new THREE.Color(0x4fafa8);

    const torus = new THREE.Mesh(geometryTorus, materialTorus);
    scene.add(torus);

    const geometrySphere = new THREE.SphereBufferGeometry(10, 64, 64);
    geometrySphere.translate(35, 0, -20);
    const materialSphere = new THREE.MeshStandardMaterial();
    materialSphere.metalness = 0.7;
    materialSphere.roughness = 0.5;
    materialSphere.normalMap = normalTexture;
    materialSphere.color = new THREE.Color(0x15b097);

    const sphere = new THREE.Mesh(geometrySphere, materialSphere);
    scene.add(sphere);

    const r = "psuedoflat/";
    const urls2 = [
        r + "px-s@2x.png", r + "nx-s@2x.png",
        r + "py-s@2x.png", r + "ny-s@2x.png",
        r + "pz-s@2x.png", r + "nz-s@2x.png"
    ];

    const textureCube = new THREE.CubeTextureLoader().load(urls2);
    textureCube.mapping = THREE.CubeRefractionMapping;
    const texture = new THREE.TextureLoader().load("/textures/diffuse.jpg");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    const normal = new THREE.TextureLoader().load("/textures/stone3_uv_Default_Normal.png");
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
    objLoader.load('/textures/stone3_uv.obj', (object) => {
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                if (child.isMesh) obj = child.clone();

                obj.position.x = 0;
                obj.position.y = 0;
                obj.position.z = 50;

                obj.scale.set(0.5, 0.5, 0.5);
                obj.material = cubeMaterial;

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
    group.position.x = 0;
    group.position.y = 0;

// Lights
    const ambient = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambient);

    const pointLight2 = new THREE.PointLight(0xff0000, 10);
    pointLight2.position.set(-500, -500, -400);
    scene.add(pointLight2);

    const pointLight1 = new THREE.PointLight(0xdd5577, 5);
    pointLight1.position.set(600, 2000, -200);
    scene.add(pointLight1);

    /**
     * Sizes
     */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    };
    document.addEventListener('mousedown', () => {
            let i = 0;
            if (intersection(sphere)) i = 1;
            if (intersection(torus)) i = 2;
            if (intersection(group)) i = 3;

            switch (i) {
                case 1:
                    console.log(sphere);
                    document.location.href = "/personal_index.html";
                    break;
                case 2:
                    console.log(torus);
                    document.location.href = "/social_index.html";
                    break;
                case 3:
                    console.log(group);
                    document.location.href = "/physical_index.html";
                    break;
                default:
                    console.log("nothing");
                    break;
            }
        }
    );

    let mouseX, mouseY;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.pageX;
        mouseY = e.pageY;
    });
    document.addEventListener('pointermove', onPointerMove);
    window.addEventListener('resize', () => {
        // Update sizes
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        // Update camera
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        // Update renderer
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    });

    /**
     * Camera
     */
    let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 100000);
    camera.position.z = 150;
    scene.add(camera);

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: !0,
        alpha: !0
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xffffff, 0);

    /**
     * Animate
     */
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const objects = [sphere, torus, group];

    function onPointerMove(event) {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);
        let bool = false;
        let name = "";
        for (const thing of objects) {
            if (thing instanceof THREE.Mesh) {
                const intersects = raycaster.intersectObject(thing);
                if (intersects.length > 0) {
                    name = thing.geometry.type;
                    bool = true;
                }
            } else {
                thing.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        const intersects1 = raycaster.intersectObject(child);
                        if (intersects1.length > 0) {
                            bool = true;
                            name = thing.type;
                        }
                    }
                });
            }
        }

        if (bool) {
            $('html,body').css('cursor', 'pointer');
            const tip = document.querySelector('#tooltip');
            tip.style = "left:" + mouseX + "px;top:" + mouseY + "px;visibility: visible;";

            switch (name) {
                case "SphereGeometry":
                    tip.innerHTML = "A Personal Story";
                    break;
                case "TorusKnotGeometry":
                    tip.innerHTML = "A Social Story";
                    break;
                case "Group":
                    tip.innerHTML = "A Physical Story";
                    break;
                default:
                    break;
            }
        } else {
            $('html,body').css('cursor', 'default');
            const tip = document.querySelector('#tooltip');
            tip.style = "visibility: hidden;"
        }

    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(4 * 3), 3));
    const lineMaterial = new THREE.LineBasicMaterial({color: 0xffffff, transparent: true});
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);

    const clock = new THREE.Clock();

    function intersection(object) {
        raycaster.setFromCamera(pointer, camera);

        if (object instanceof THREE.Mesh) {
            const intersects = raycaster.intersectObject(object);
            if (intersects.length > 0) return true;
        } else {
            let bool = false;
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    const intersects1 = raycaster.intersectObject(child);
                    bool = intersects1.length > 0;
                }
            });
            return bool;
        }
        return false;
    }

    const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        group.rotation.y = 0.2 * elapsedTime;
        torus.rotation.y = 0.5 * elapsedTime;
        sphere.rotation.y = 0.4 * elapsedTime;

        group.rotation.x = 0.8 * elapsedTime;
        torus.rotation.x = 0.5 * elapsedTime;
        sphere.rotation.x = 0.4 * elapsedTime;

        renderer.render(scene, camera);
        window.requestAnimationFrame(tick)
    };

    tick();

    const vid = document.querySelector('#intro');

    if (vid) {
        vid.addEventListener('ended', () => {
            console.log("finished");
            document.querySelector('.webgl').classList.add("fadeIn");
            vid.classList.add("fadeOut");
        });
    }

    document.querySelector('#skipButton').addEventListener('click', () => {

        vid.currentTime = vid.duration - 0.1;

    });
}
