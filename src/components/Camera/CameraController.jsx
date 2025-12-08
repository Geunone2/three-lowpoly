import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {gsap} from "gsap";

export default class CameraController {
    constructor(defaultCamera, renderer, cameraGroup) {

        this.camera = defaultCamera;
        this.cameraGroup = cameraGroup;

        this.controls = new OrbitControls(this.camera, renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.update();

        this.viewType = "default";

        this.viewPositions = {
            default: new THREE.Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z),
            desert: new THREE.Vector3(50, 10, 0),
            prairie: new THREE.Vector3(-25, 10, -45),
            sea: new THREE.Vector3(-32.5, 10, 50),
        };
    }

    switchCamera(type, lookAtTarget = new THREE.Vector3(0, 0, 0)) {
        const targetPos = this.viewPositions[type];
        this.viewType = type;

        this.controls.enabled = false;

        gsap.to(this.camera.position, {
            duration: 2,
            x: targetPos.x,
            y: targetPos.y,
            z: targetPos.z,
            ease: "power2.inOut",
        });

        gsap.to(this.controls.target, {
            duration: 2,
            x: lookAtTarget.x,
            y: lookAtTarget.y,
            z: lookAtTarget.z,
            ease: "power2.inOut",
        });
    }

    update() {

        if (this.viewType === "default") {
            this.cameraGroup.rotation.y += 0.001;
        }

        this.controls.update();
    }
}