import * as THREE from 'three';
import {loadRiverModels} from "./Loaders/Layer1/loadRiverObj.jsx";
import {loadSWModels} from "./Loaders/Layer1/loadSWObj.jsx";
import {loadSWBuildingModels} from "./Loaders/Layer2/loadSWBuildingObj.jsx";
import {loadNorthModels} from "./Loaders/Layer1/loadNorthObj.jsx";
import {loadNorthBuildingModels} from "./Loaders/Layer2/loadNorthBuildingObj.jsx";
import {loadEastModels} from "./Loaders/Layer1/loadEastObj.jsx";
import {loadEastBuildingModels} from "./Loaders/Layer2/loadEastBuildingObj.jsx";
import {WeatherController} from "./Effect/EffectController.js"
import CameraController from "./Camera/CameraController.js";
import DefaultCamera from "./Camera/DefaultCamera.jsx";
import {LightController} from "./Light/LightController.jsx";
import {LoadingManager} from "../utils/LoadingManager.js";

let weatherController;
let lightController;

export function changeWeather(type) {  // ← UI에서 이 함수 사용
    weatherController?.setWeather(type);
}

export function changeTime(type) {
    lightController?.setLight(type);
}

export default function MainScene({onProgress, onLoaded}) {
    // ✅ Renderer 설정
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
    renderer.setClearColor(0x000000, 0);

    const {camera} = DefaultCamera();

    const scene = new THREE.Scene();

    const cameraGroup = new THREE.Group();
    scene.add(cameraGroup);
    cameraGroup.add(camera);

    const cameraController = new CameraController(camera, renderer, cameraGroup);

    // 조명 추가
    lightController = new LightController(scene, renderer, cameraController.camera);

    const manager = LoadingManager({onProgress, onLoad: onLoaded});

    loadRiverModels(scene, manager);

    // E 방향
    loadEastModels(scene, manager);
    loadEastBuildingModels(scene, manager);

    // SW 방향
    loadSWModels(scene, manager);
    loadSWBuildingModels(scene, manager);

    // N 방향
    loadNorthModels(scene, manager);
    loadNorthBuildingModels(scene, manager);

    // 기상 효과 변화
    weatherController = new WeatherController(scene, manager);

    const clock = new THREE.Clock();

    // 클릭 처리
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    canvas.addEventListener("click", onClick);

    function onClick(event) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Raycaster에 카메라 적용
        raycaster.setFromCamera(mouse, cameraController.camera);

        // 클릭된 객체 찾기 (scene 전체)
        const intersects = raycaster.intersectObjects(scene.children, true);
        if (intersects.length === 0) {
            return;
        }

        const hit = intersects[0].object
        const region = hit.userData.region;

        switch (region) {
            case "sea":
                cameraController.switchCamera("sea", new THREE.Vector3(-3, 2, 6));
                break;

            case "desert":
                cameraController.switchCamera("desert", new THREE.Vector3(6, 2, 0));
                break;

            case "prairie":
                cameraController.switchCamera("prairie", new THREE.Vector3(-3, 2, -5));
                break;

            case "none":
                break;
        }

    }

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }


    function render() {
        const deltaTime = clock.getDelta();

        if (weatherController) {
            weatherController.update(deltaTime);
        }
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        renderer.render(scene, cameraController.camera);

        cameraController.update();
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}
