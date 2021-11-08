import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';


function loadImage(path, id, css, target) {
    $('<img class="images" id="'+ id +'" src="'+ path +'" style="'+ css +'">').load(function() {
        $(this).appendTo(target);
    });
}

let css1 = '';
let css2 = 'grid-column: span 2;';
let css3 = 'border-color: red; border-style:solid;'

for (let i = 0; i < 33; i++) {
    if (i == 1 || i == 7 || i == 11 || i == 14 || i == 15 || i == 17 || i == 19 || i == 20) {
        loadImage('/images/' + i + '.jpg', 'image1', css2,'#pictureBar');
    } else if (i == 22) {
        loadImage('/images/blank' + i + '.png', 'image1', css1, '#pictureBar');
        loadImage('/images/' + i + '.jpg', 'image1', css1, '#pictureBar');
    } else if (i == 23) {
        loadImage('/images/blank' + i + '.png', 'image1', css1, '#pictureBar');
        loadImage('/images/blank' + i + '.png', 'image1', css1, '#pictureBar');
        loadImage('/images/blank' + i + '.png', 'image1', css1, '#pictureBar');
        loadImage('/images/' + i + '.jpg', 'image1', css1, '#pictureBar');
    } else if (i == 25) {
        loadImage('/images/blank' + i + '.png', 'image1', css1, '#pictureBar');
        loadImage('/images/' + i + '.jpg', 'image1', css1, '#pictureBar');
    } else if (i == 26) {
        loadImage('/images/blank' + i + '.png', 'image1', css1, '#pictureBar');
        loadImage('/images/' + i + '.jpg', 'image1', css1, '#pictureBar');
    } else if (i == 27) {
        loadImage('/images/blank' + i + '.png', 'image1', css1, '#pictureBar');
        loadImage('/images/' + i + '.jpg', 'image1', css1, '#pictureBar');
    } else if (i == 28) {
        loadImage('/images/blank' + i + '.png', 'image1', css1, '#pictureBar');
        loadImage('/images/blank' + i + '.png', 'image1', css1, '#pictureBar');
        loadImage('/images/' + i + '.jpg', 'image1', css1, '#pictureBar');
    } else if (i == 29) {
        loadImage('/images/blank' + i + '.png', 'image1', css1, '#pictureBar');
        loadImage('/images/' + i + '.jpg', 'image1', css1, '#pictureBar');
    } else if (i == 30) {
        loadImage('/images/blank' + i + '.png', 'image1', css1, '#pictureBar');
        loadImage('/images/blank' + i + '.png', 'image1', css1, '#pictureBar');
        loadImage('/images/blank' + i + '.png', 'image1', css1, '#pictureBar');
        loadImage('/images/' + i + '.jpg', 'image1', css1, '#pictureBar');
        loadImage('/images/blank' + i + '.png', 'image1', css1, '#pictureBar');
        loadImage('/images/blank' + i + '.png', 'image1', css1, '#pictureBar');
    }  else if (i == 31) {
        loadImage('/images/blank' + i + '.png', 'image1', css1, '#pictureBar');
        loadImage('/images/blank' + i + '.png', 'image1', css1, '#pictureBar');
        loadImage('/images/blank' + i + '.png', 'image1', css1, '#pictureBar');
        loadImage('/images/blank' + i + '.png', 'image1', css1, '#pictureBar');
        loadImage('/images/blank' + i + '.png', 'image1', css1, '#pictureBar');
        loadImage('/images/' + i + '.jpg', 'image1', css1, '#pictureBar');
    } else if (i == 32) {
        loadImage('/images/' + i + '.jpg', 'image1', css1, '#pictureBar');
    } else if ( i==2 ) {
        // do nothing
    } else {
        loadImage('/images/' + i + '.jpg', 'image1', css1, '#pictureBar');
    }


}

for (let i = 0; i < 24; i++) {
    loadImage('/images/blank.png', 'image1', css1, '#pictureBar');
}

for (let i = 33; i < 53; i++) {
    if (i == 42 || i == 43 || i == 49 || i == 51 || i == 52) {
        loadImage('/images/' + i + '.jpg', 'image1', css2, '#pictureBar');
    } else {
        loadImage('/images/' + i + '.jpg', 'image1', css1, '#pictureBar');
    }
}


const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

const r = "psuedoflat/";
const urls2 = [
    r + "px-s@2x.png", r + "nx-s@2x.png",
    r + "py-s@2x.png", r + "ny-s@2x.png",
    r + "pz-s@2x.png", r + "nz-s@2x.png"
];

const textureCube = new THREE.CubeTextureLoader().load( urls2 );
textureCube.mapping = THREE.CubeRefractionMapping;
const texture = new THREE.TextureLoader().load( "/textures/diffuse.jpg" );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 1, 1 );
const normal = new THREE.TextureLoader().load( "/textures/stone3_uv_Default_Normal.png" );
normal.wrapS = THREE.RepeatWrapping;
normal.wrapT = THREE.RepeatWrapping;
normal.repeat.set( 1, 1 );

const cubeMaterial = new THREE.MeshPhongMaterial( {
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
} );

const group = new THREE.Group();
const objLoader = new OBJLoader();
let obj;
objLoader.load('/textures/centred_stone.obj', (object) => {
    object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            if (child.isMesh) obj = child.clone();

            obj.scale.set(0.90, 0.90, 0.90);
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

            for ( let j = 0, jl = position.count; j < jl; j ++ ) {

                position.setXYZ(
                    j,
                    position.getX( j ) * 2,
                    position.getY( j ) * 2,
                    position.getZ( j ) * 2
                );

            }

            morphAttributes.position.push(position); // I forgot this earlier.
            obj.updateMorphTargets();
            obj.morphTargetInfluences[ 0 ] = 0;

            group.add(obj);

        }
    });
});

scene.add(group);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: !0,
    alpha: !0
});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor( 0xffffff, 0);

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
let camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 100000 );
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
    window.requestAnimationFrame(tick)
};
tick();


const cameraCanvas = document.querySelector('canvas.videoCanvas');
const cameraScene = new THREE.Scene();

let video = document.getElementById( 'video' );
const videoTexture = new THREE.VideoTexture( video );

let w = cameraCanvas.width;
let h = cameraCanvas.height;

const videoGeometry = new THREE.PlaneGeometry( w, h );
videoGeometry.scale( 0.5, 0.5, 0.5 );
const videoMaterial = new THREE.MeshBasicMaterial( { map: videoTexture } );

const videoMesh = new THREE.Mesh( videoGeometry, videoMaterial );
cameraScene.add( videoMesh );

initWebcamInput();

function initWebcamInput() {

    if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {

        navigator.mediaDevices.getUserMedia( { video: true } ).then( function ( stream ) {

            video.srcObject = stream;
            video.play();

        } ).catch( function ( error ) {
            console.error( 'Unable to access the camera/webcam.', error );
        } );
    } else {
        console.error( 'MediaDevices interface not available.' );
    }

}

const cameraRenderer = new THREE.WebGLRenderer({
    canvas: cameraCanvas,
    antialias: !0,
    alpha: !0
});
cameraRenderer.setSize( window.innerWidth, window.innerHeight );
cameraRenderer.setPixelRatio(window.devicePixelRatio);
cameraRenderer.setClearColor( 0xffffff, 0);

let vidCamera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 100000 );
vidCamera.position.z = 100;
cameraScene.add(vidCamera);

const video_tick = () => {
    cameraRenderer.render(cameraScene, vidCamera);
    window.requestAnimationFrame(video_tick)
};
video_tick();

function showImages(el) {
    let windowHeight = jQuery( window ).height();
    $(el).each(function(){
        let thisPos = $(this).offset().top;

        let topOfWindow = $(window).scrollTop();
        if (topOfWindow + windowHeight - 200 > thisPos ) {
            $(this).addClass("fadeIn");
        }
    });
}

// if the image in the window of browser when the page is loaded, show that image
$(document).ready(function(){
    showImages('.images');
});

// if the image in the window of browser when scrolling the page, show that image
$(window).scroll(function() {
    showImages('.images');
});


function isScrolledIntoView(elem)
{
    let docViewTop = $(window).scrollTop();
    let docViewBottom = docViewTop + $(window).height();

    let elemTop = $(elem).offset().top;
    let elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

$(window).scroll(function() {
    const children = document.querySelector('#textBar').childNodes;
    children.forEach( child => {
        child.childNodes.forEach( grandchild => {
            if (isScrolledIntoView($('#' + grandchild.id))) {
                $('#' + grandchild.id).addClass('animation');
            }
        })
    });
});
