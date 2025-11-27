import * as THREE from 'three';

export default class DefaultEffect {
    constructor(scene) {
        this.scene = scene;

        this.defaultBackground = new THREE.Color(0x000000);

        this.scene.fog = null;

        this.scene.background = this.defaultBackground;
    }

    update() {
    }

    dispose() {
        this.scene.fog = null;

        this.scene.background = this.defaultBackground;
    }
}