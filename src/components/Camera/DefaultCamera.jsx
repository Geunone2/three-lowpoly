import * as THREE from 'three'

export default function DefaultCamera() {

    const camera = new THREE.PerspectiveCamera(10.5, 2, 10, 300);
    camera.position.set(-40, 10, 60);
    camera.lookAt(0, 0, 0);

    return {camera};
}