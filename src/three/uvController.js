import * as THREE from 'three';

import { createMap } from './utils';

export const changeTexture = async (floor, texNo, repeat) => {

    /* Remove WireFrame */
    floor.material.wireframe = false;

    /* Remove Color */
    floor.material.color = new THREE.Color();

    /* Create New Map */
    floor.material.map = await createMap(`${texNo}/base.png`, repeat);

    /* Create NormalMap */
    floor.material.normalMap = await createMap(`${texNo}/normal.png`, repeat);

    /* Set NormalMap Scale */
    floor.material.normalScale = new THREE.Vector2(4, 4);

    /* Create Roughness Map */
    // floor.material.roughnessMap = await createMap(`${texNo}/roughness.png`, repeat);


    /* Update Material */
    floor.material.needsUpdate = true;

}

export const rotateTexture = (floor, angle) => {

    /* Get Radian Value */
    const radAngle = THREE.MathUtils.degToRad(angle);

    /* Rotate Floor Mesh */
    floor.rotation.z = radAngle;

}
