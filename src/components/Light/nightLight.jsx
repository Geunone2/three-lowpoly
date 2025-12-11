import * as THREE from "three";

export default function nightLight(scene) {

    const night = new THREE.AmbientLight(0x111122, 0.4);
    night.position.set(0, 0, 0);
    scene.add(night);

    const moon = new THREE.DirectionalLight(0x8888ff, 1.5);
    moon.position.set(5, 10, -5);
    scene.add(moon);

    return {night, moon};
}