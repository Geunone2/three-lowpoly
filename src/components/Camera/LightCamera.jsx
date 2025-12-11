import * as THREE from "three";

export default function LightCamera() {
    const lightCamera = new THREE.OrthographicCamera(-50, 50, 50, -50, 0.1, 200);

    lightCamera.position.set(0, 50, 0);
    lightCamera.lookAt(0, 0, 0);
}