

export function personal(THREE) {

    let image_array = [];
    let png_array = [22, 24, 25, 26, 29, 31, 33, 35, 36, 37, 39, 40, 41, 43, 44, 45, 46];
    let css2_array = [13, 14, 16, 18, 19, 1, 3, 6, 57, 58, 65, 66];

    for (let i = 0; i < 67; i++) {
        if (png_array.includes(i)) {
            let imgPreload = new Image();
            let temp = {name: i, value: $(imgPreload).attr({src: '/images/' + i + '.png'})};
            image_array.push(temp);
        } else if (i == 47) {
            let imgPreload = new Image();
            let temp = {name: i, value: $(imgPreload).attr({src: '/images/' + i + '.jpg'})};
            image_array.push(temp);
            for (let j = 0; j < 23; j++){
                let imgPreload = new Image();
                let temp = {name: j, value: $(imgPreload).attr({src: '/images/40.png'})};
                image_array.push(temp);
            }
        } else {
            let imgPreload = new Image();
            let temp = {name: i, value: $(imgPreload).attr({src: '/images/' + i + '.jpg'})};
            image_array.push(temp);
        }
    }

    for (let i = 0; i < image_array.length; i++) {
        let img = document.createElement("img");
        img.src = image_array[i].value.get(0).currentSrc;
        img.classList.add("images");

        if (css2_array.includes(i)) img.style.gridColumn = 'span 2';

        document.querySelector('#pictureBar').appendChild(img);
    }

    window.onload = function() {
        if(!window.location.hash) {
            window.location = window.location + '#loaded';
            window.location.reload();
        }
    }


    const textureLoader = new THREE.TextureLoader();
    const normalTexture = textureLoader.load('/textures/NormalMap.png');

    const canvas = document.querySelector('canvas.webgl');
    const scene = new THREE.Scene();

    const geometrySphere = new THREE.SphereBufferGeometry(1, 64, 64);
    geometrySphere.translate(0, 0, 0);
    const materialSphere = new THREE.MeshStandardMaterial();
    materialSphere.metalness = 0.7;
    materialSphere.roughness = 0.5;
    materialSphere.normalMap = normalTexture;
    materialSphere.color = new THREE.Color(0x15b097);

    const sphere = new THREE.Mesh(geometrySphere, materialSphere);
    sphere.scale.set(0.4, 0.4, 0.4);

    scene.add(sphere);

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
    let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 100000);
    camera.position.z = 2;
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

    const clock = new THREE.Clock();

    const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        sphere.rotation.y = 0.4 * elapsedTime;
        sphere.rotation.x = 0.4 * elapsedTime;

        renderer.render(scene, camera);
        window.requestAnimationFrame(tick)
    };

    tick();

    /* ***************
     * Parallax Scroll
     ***************** */

    // var parallaxElements = $('#textBar'),
    // parallaxQuantity = parallaxElements.length;

    // $(window).on('scroll', function () {

    //     window.requestAnimationFrame(function () {

    //         for (var i = 0; i < parallaxQuantity; i++) {
    //         var currentElement =  parallaxElements.eq(i);
    //         var scrolled = $(window).scrollTop();
                
    //             currentElement.css({
    //             'transform': 'translate3d(0,' + scrolled * -0.3 + 'px, 0)'
    //             });
    //         }
    //     });
    // });

    /* ************************
     * Image Fade in on Scroll
     ************************** */

    function showImages(el) {
        let windowHeight = jQuery(window).height();
        $(el).each(function () {
            let thisPos = $(this).offset().top;

            let topOfWindow = $(window).scrollTop();
            if (topOfWindow + windowHeight - 200 > thisPos) {
                $(this).addClass("fadeIn");
            }

            // console.log(
            //     "Top of window: " + topOfWindow +
            //     "\nWindow Height: " + windowHeight +
            //     "\nThis Position: " + thisPos +
            //     "\nInternal Scroll Pos: " + $('.parent').scrollTop()
            // )
        });
    }

// if the image in the window of browser when the page is loaded, show that image
    $(document).ready(function () {
        showImages('.images');
    });

// if the image in the window of browser when scrolling the page, show that image
    $(window).scroll(function () {
        showImages('.images');
    });

     /* ****************************
     * Text Typewriter in on Scroll
     ******************************* */

    function isScrolledIntoView(elem, v) {
        console.log("...checking");
        // debugger;
        let docViewTop = $(window).scrollTop();
        let docViewBottom = docViewTop + $(window).height();

        let elemTop = $(elem).offset().top;
        let elemBottom = elemTop + $(elem).height();

        if (!v) return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
        
        return ((elemBottom <= docViewBottom) || (elemTop >= docViewTop))
    }

    $(window).scroll(function () {
        const children = document.querySelector('.text-subdivision').childNodes;
        children.forEach(child => {
            console.log("------CHILD------")
            console.log(child)
            console.log("---2--CHILD------")
            child.childNodes.forEach(grandchild => {
                if (grandchild.id != null && isScrolledIntoView('#' + grandchild.id)) {
                    console.log("#..", grandchild.id)
                    $('#' + grandchild.id).addClass('animation');
                }
            })
        });
    });

    document.querySelector('#home_container').addEventListener('click', () => {
        document.location.href = "/index.html";
    });

    console.log(
        "Text: " + $("#textBar").height() +
        "\nPics: " + $("#pictureBar").height()
    );

}
