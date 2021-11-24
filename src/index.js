import $ from 'jquery';
import App from './three/app';
import { changeTexture, rotateTexture } from './three/uvController';

/* Target Texture */
var textureNo;
const tileSizeSelect = document.querySelector('.form-select');
const slider = document.querySelector('#slider1');

const container = $("#container")[0];
const smallContainer = $("#smallContainer")[0];
const threeApp = new App(container, smallContainer);
threeApp.start();


/* Texture Names */
const textureNames = [
    'marble',
    'terrazzo',
    'tkogehsi'
];

/* Initialize UI */
slider.value = '90';
tileSizeSelect.value = 2;

/* Texture Image Button Event */
const texBtns = document.querySelectorAll('.imgBtn');
texBtns.forEach((btn, index) => {
    btn.addEventListener('click', async () => {

        /* Set Tile Size To Default */
        tileSizeSelect.value = 2;

        /* Change Button Color */
        texBtns.forEach(b => b.style.background = 'transparent')
        btn.style.background = '#ff0000';

        /* Default Setting */
        slider.value = '90';
        document.querySelector('.slider1Value').innerHTML = '90';
        threeApp.floor.rotation.z = Math.PI / 2;

        /* Change Texture */
        await changeTexture(threeApp.floor, textureNames[index], 18);
        threeApp.render();

        /* Set Target Texture No */
        textureNo = index;
    });
});

/* Rotation of Texture */
slider.addEventListener('pointermove', e => {
    document.querySelector('.slider1Value').innerHTML = slider.value;
    rotateTexture(threeApp.floor, parseInt(slider.value));
    threeApp.render();
});


/* Change Tile Size */
tileSizeSelect.addEventListener('change', async () => {

    /* Return When No Texture Selected */
    if (textureNo === undefined) return;

    /* Change Texture Repeat # */
    switch (tileSizeSelect.value) {
        case "1":
            await changeTexture(threeApp.floor, textureNames[textureNo], 36);
            break;
        case "2":
        default:
            await changeTexture(threeApp.floor, textureNames[textureNo], 18);
            break;
    }

    threeApp.render();
})

