import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { createRenderer, createCamera, createMap, createOrbitControls } from './utils';

export default class ThreeApp {
    constructor(container, smallContainer) {
        this.container = container;
        const width = container.clientWidth;
        const height = container.clientHeight;
        /* Create Scenes */
        this.scene = new THREE.Scene();

        this.renderer = createRenderer(container, 1);

        /* Create Cameras */
        this.camera = createCamera(container);
        this.camera.position.set(8, 5, 5)

        const imgDiv = document.createElement('div');
        imgDiv.style.backgroundImage = `url('../assets/Background_images/camera.png')`
        imgDiv.style.backgroundSize = `${width}px ${height}px`;
        imgDiv.style.position = 'absolute';
        imgDiv.style.top = 0;
        imgDiv.style.left = 0;
        imgDiv.style.zIndex = 10;
        imgDiv.style.width = '100%';
        imgDiv.style.height = '100%';
        this.container.appendChild(imgDiv);

        this.container1 = smallContainer;
        this.camera1 = createCamera(this.container1);
        this.camera1.position.set(8, 1, 5);
        this.camera1.lookAt(8, 0, 5);
        this.renderer1 = new THREE.WebGLRenderer({ antialias: true });
        this.renderer1.setPixelRatio(window.devicePixelRatio);
        this.renderer1.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer1.toneMappingExposure = 1;
        this.renderer1.outputEncoding = THREE.sRGBEncoding;
        this.container1.appendChild(this.renderer1.domElement);
        this.renderer1.setSize(200, 200);
        /* Add Lighting */
        this.buildEnv();

        window.addEventListener('resize', this.resize.bind(this), false);

        // createOrbitControls(this.camera, this.renderer.domElement, this.render.bind(this));
    }

    /* Set Reflection Texture */
    setEnvironment(renderer, scene) {
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();
        scene.environment = pmremGenerator.fromEquirectangular(this.envTexture).texture;
        pmremGenerator.dispose();
    }

    /* Start Application */
    async start() {
        /* Load EnvMap */
        this.envTexture = await new RGBELoader().setDataType(THREE.UnsignedByteType).loadAsync('./assets/env/royal_esplanade_1k.hdr');

        /* Set EnvMap */
        // this.setEnvironment(this.renderer, this.scene);
        // this.setEnvironment(this.renderer1, this.scene1);
        this.envTexture.dispose();

        /* Set Camera Position From Metadata JSON */
        const input = await fetch('./assets/Background_images/metadata_bg.json').then(resp => resp.json());
        this.camera.position.fromArray(input.camera1.loc)
        this.camera.setFocalLength(input.camera1.FocalLength);

        const room = (await new GLTFLoader().loadAsync('./assets/Floorplan_model/model.glb')).scene;
        room.traverse(child => {
            if (child.name !== 'Camera') return;
            this.camera = child.children[0];
        });
        this.scene.add(room);
        room.visible = false;

        /* Create Floor*/
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0x12487,
            wireframe: true
        });
        this.floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20, 30, 30), floorMat)
        this.floor.rotation.x = -Math.PI / 2;
        this.floor.rotation.z = Math.PI / 2;
        this.floor.position.set(8, 0, 5)
        this.scene.add(this.floor);

        /* First Render */
        this.render();
    }


    buildEnv() {
        /* Add Ambient Color */
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xeeeeee, 1);
        this.scene.add(hemiLight);

        /* Directional Sun Light */
        // const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
        // dirLight.position.set(5, 5, 5);
        // this.scene.add(dirLight);
    }
    resize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.render();
    }
    render() {
        this.renderer.render(this.scene, this.camera);
        this.renderer1.render(this.scene, this.camera1);
    }
}