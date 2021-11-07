import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'

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



const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load('/textures/v1.png');

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

const geometryTorus = new  THREE.TorusKnotGeometry(8, 4, 100, 10, 2, 3);
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
camera.position.z = 200;
scene.add(camera);


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: !0,
    alpha: !0
});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor( 0xffffff, 0);

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    torus.rotation.y = 0.4 * elapsedTime;
    torus.rotation.x = 0.4 * elapsedTime;

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick)
};

tick();

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

    // console.log(elemBottom, ":", docViewBottom, " | ", elemTop, ":", docViewTop)

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

$(window).scroll(function() {
    const children = document.querySelector('#textBar').childNodes;
    children.forEach( child => {
        // console.log(child)
        child.childNodes.forEach( grandchild => {
            // console.log("#", grandchild.id)
            if (isScrolledIntoView($('#' + grandchild.id))) {
                // console.log("printing")
                $('#' + grandchild.id).addClass('animation');
            }
        })
    });
});

const musicContainer = document.querySelector('.musicContainer');
const playBtn = document.querySelector('#play');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const audio = document.querySelector('#audio');
const progress = document.querySelector('.progress');

function playSong() {
    musicContainer.classList.add('play');
    playBtn.querySelector('i.fas').classList.remove('fa-play');
    playBtn.querySelector('i.fas').classList.add('fa-pause');

    audio.play();
}

function pauseSong() {
    musicContainer.classList.remove('play');
    playBtn.querySelector('i.fas').classList.add('fa-play');
    playBtn.querySelector('i.fas').classList.remove('fa-pause');

    audio.pause();
}

playBtn.addEventListener('click', () => {
    const isPlaying = musicContainer.classList.contains('play');

    if(isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

prevBtn.addEventListener('click', (event) => {
    const time = audio.currentTime;
    if (time <= 30) {
        audio.currentTime = 0;
    } else {
        audio.currentTime -= 30;
    }
});

nextBtn.addEventListener('click', (event) => {
    const time = audio.currentTime;
    const duration = audio.duration;
    if (time >= duration - 30) {
        audio.currentTime = duration;
    } else {
        audio.currentTime += 30;
    }
});

function updateProgress(event) {
    const {duration, currentTime} = event.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`
}

audio.addEventListener('timeupdate', updateProgress)
