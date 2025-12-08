import * as THREE from 'three';

export default class DefaultEffect {
    constructor(scene) {
        this.scene = scene;

        this.scene.fog = null;
    }

    update() {
    }

    dispose() {
        this.scene.fog = null;
    }
}