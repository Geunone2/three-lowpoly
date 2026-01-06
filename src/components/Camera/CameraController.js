import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {gsap} from "gsap";

export default class CameraController {
    constructor(defaultCamera, renderer, cameraGroup) {
        this.camera = defaultCamera;
        this.cameraGroup = cameraGroup;

        // OrbitControls 설정
        this.controls = new OrbitControls(this.camera, renderer.domElement);
        this.controls.target.set(0, 0, 0);

        this.controls.enablePan = false;
        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.15; // 지면 아래 못 봄
        this.controls.minDistance = 30;                  // 최소 줌
        this.controls.maxDistance = 80;                  // 최대 줌

        this.controls.enabled = true;
        this.controls.update();

        this.viewType = "default";

        // 방향 벡터
        const desertDirection = new THREE.Vector3(6, 0, 0);
        const seaDirection = new THREE.Vector3(-3, 0, 6);
        const prairieDirection = new THREE.Vector3(-3, 0, -5);

        const distance = 55;
        const height = 10;

        const desertPos = desertDirection.clone().normalize().multiplyScalar(distance);
        const seaPos = seaDirection.clone().normalize().multiplyScalar(distance);
        const prairiePos = prairieDirection.clone().normalize().multiplyScalar(distance);

        desertPos.y = height;
        seaPos.y = height;
        prairiePos.y = height;

        this.viewPositions = {
            default: this.camera.position.clone(),
            desert: desertPos,
            sea: seaPos,
            prairie: prairiePos,
        };
    }

    switchCamera(type, lookAtTarget = new THREE.Vector3(0, 0, 0)) {
        const targetPos = this.viewPositions[type];
        this.viewType = type;

        this.controls.enabled = false;

        if (type !== "default") {
            gsap.to(this.cameraGroup.rotation, {
                duration: 2,
                y: 0,
                ease: "power2.inOut",
            });
        }

        // 카메라 위치 이동
        gsap.to(this.camera.position, {
            duration: 2,
            x: targetPos.x,
            y: targetPos.y,
            z: targetPos.z,
            ease: "power2.inOut",
        });

        // 시선 이동
        gsap.to(this.controls.target, {
            duration: 2,
            x: lookAtTarget.x,
            y: Math.max(-0.5, lookAtTarget.y),
            z: lookAtTarget.z,
            ease: "power2.inOut",
            onComplete: () => {
                // default 뷰일 때만 다시 마우스 제어 허용
                this.controls.enabled = (type === "default");
            },
        });
    }

    update() {
        if (this.viewType === "default") {
            this.cameraGroup.rotation.y += 0.001;

            if (this.controls.target.y < -0.5) {
                this.controls.target.y = 0;
            }
        }

        this.controls.update();
    }
}