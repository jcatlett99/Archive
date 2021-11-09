import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import {index} from "./index_script";
import {social} from "./social_script";
import {physical} from "./physical_script";
import {personal} from "./personal_script";


const href = window.location.href;

if (href.includes("social")) {
    social(THREE);
} else if (href.includes("physical")) {
    physical(THREE, OBJLoader);
} else if (href.includes("personal")) {
    personal(THREE);
} else {
    index(OBJLoader, THREE);
}