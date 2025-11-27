import * as THREE from 'three';

export default class FogEffect {
    constructor(scene) {
        this.scene = scene;

        this.scene.fog = new THREE.FogExp2(0xCCCCCC, 0.00);

        this.startDensity = 0.00;
        this.targetDensity = 0.06;
        this.duration = 5000;
        this.startTime = null;
        this.isAnimating = true;
    }

    update() {
        if (!this.isAnimating) return;

        if (!this.startTime) this.startTime = performance.now();

        const elapsed = performance.now() - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1);

        this.scene.fog.density = this.startDensity + (this.targetDensity - this.startDensity) * progress;

        if (progress >= 1) {
            this.isAnimating = false;
        }
    }

    dispose() {
        this.scene.fog = null;

    }
}
