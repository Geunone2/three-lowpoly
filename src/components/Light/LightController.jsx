import sunLight from "./sunLight.jsx";
import nightLight from "./nightLight.jsx";
import * as THREE from "three";

export const LightTypes = {
    SUN: "sun",
    NIGHT: "night",
};

export class LightController {
    constructor(scene, renderer, camera) {
        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;

        this.currentLights = [];

        this.starParticles = null;
        this.glowingStars = [];

        this.background = document.querySelector("#background");

        this.setLight(LightTypes.SUN);
    }

    clearLights() {
        this.currentLights.forEach((light) => this.scene.remove(light));
        this.currentLights = [];
    }

    clearStars() {
        if (this.starParticles) {
            this.scene.remove(this.starParticles);
            this.starParticles.geometry.dispose();
            this.starParticles.material.dispose();
            this.starParticles = null;
        }

        this.glowingStars.forEach(star => this.scene.remove(star));
        this.glowingStars = [];
    }

    setLight(type) {
        this.clearLights();
        this.clearStars();

        if (type === LightTypes.SUN) {
            this.background.style.background = `
            linear-gradient(
                180deg,
                #8fdbff 0%,
                #ffffff 50%,
                #8fdbff 50%,
                #8fdbff 100%
            )
        `;

            this.renderer.setClearColor(0x000000, 0);

            const {sun, hemi} = sunLight(this.scene);
            this.currentLights.push(sun, hemi);

        } else if (type === LightTypes.NIGHT) {

            this.background.style.background = `
            linear-gradient(
               180deg,
               #000000 0%,
               #808080 50%,
               #4b6fa3 50%,
               #4b6fa3 100%
            )
        `;

            this.renderer.setClearColor(0x000000, 0);

            const {night, moon} = nightLight(this.scene);
            this.currentLights.push(night, moon);

            this.createStars(this.camera);
        }
    }

    createStars(camera) {
        const starCount = 200;

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount; i++) {

            const forward = new THREE.Vector3();
            camera.getWorldDirection(forward);

            const distance = 80;
            const basePos = new THREE.Vector3().copy(camera.position)
                .add(forward.multiplyScalar(distance));

            basePos.x = (Math.random() - 0.5) * 40;
            basePos.y = Math.random() * 2 + 6;
            basePos.z = (Math.random() - 0.5) * 40;

            positions[i * 3] = basePos.x;
            positions[i * 3 + 1] = basePos.y;
            positions[i * 3 + 2] = basePos.z;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.2,
            transparent: true,
            opacity: 0.9,
        });

        const stars = new THREE.Points(geometry, material);
        this.starParticles = stars;
        this.scene.add(stars);
    }
}
