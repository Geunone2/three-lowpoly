import * as THREE from "three";

export default function addLight(scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(0, 1, 0);
    dirLight.castShadow = false;

    scene.add(ambientLight);
    scene.add(dirLight);

    return {ambientLight, dirLight}
}