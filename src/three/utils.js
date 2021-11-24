import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const createRenderer = (container, zIndex) => {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = 0;
    renderer.domElement.style.left = 0;
    renderer.domElement.style.zIndex = zIndex;
    renderer.setSize(container.clientWidth, container.clientHeight);
    return renderer;
}

export const createCamera = (container) => {
    const fov = 45;
    const aspect = container.clientWidth / container.clientHeight;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    return camera;
}

/* Create Floor Texture Map From URL */
export const createMap = async (path, repeat) => {
    const map = await new THREE.TextureLoader().loadAsync(`./assets/textures/${path}`);
    map.encoding = THREE.sRGBEncoding;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(repeat, repeat);
    return map;
}

export const createOrbitControls = (camera, domElement, render) => {
    const orbit = new OrbitControls(camera, domElement);
    orbit.target.set(8, 0, 5)
    orbit.update();
    orbit.addEventListener('change', () => {
        render();
    })
}