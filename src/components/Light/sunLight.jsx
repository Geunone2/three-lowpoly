import * as THREE from "three";

export default function sunLight(scene) {

    const sun = new THREE.DirectionalLight(0xffffff, 3.5);
    sun.position.set(5, 10, 5);
    scene.add(sun);

    const hemi = new THREE.HemisphereLight(0xffffff, 0xeeeeff, 0.8);
    scene.add(hemi);

    return {sun, hemi};
}
