import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {loadRiverModels} from "./Loaders/Layer1/loadRiverObj.jsx";
import {loadSWModels} from "./Loaders/Layer1/loadSWObj.jsx";
import {loadSWBuildingModels} from "./Loaders/Layer2/loadSWBuildingObj.jsx";
import {loadNorthModels} from "./Loaders/Layer1/loadNorthObj.jsx";
import {loadNorthBuildingModels} from "./Loaders/Layer2/loadNorthBuildingObj.jsx";
import {loadEastModels} from "./Loaders/Layer1/loadEastObj.jsx";
import {loadEastBuildingModels} from "./Loaders/Layer2/loadEastBuildingObj.jsx";
import {WeatherController} from "./Effect/EffectController.js"

let weatherController;

export function changeWeather(type) {  // ← UI에서 이 함수 사용
    weatherController?.setWeather(type);
}

export default function MainScene() {
    // ✅ Renderer 설정
    const canvas = document.querySelector('#c');

    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 1000);
    camera.position.set(0, 5, 20);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0); // OBJ 중심을 바라보게
    controls.update();


    // ✅ 라이트 추가
    function addLight(...pos) {
        const color = 0xffffff;
        const intensity = 2.5;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(...pos);
        scene.add(light);
        scene.add(light.target);
    }

    addLight(5, 5, 2);
    addLight(-5, 5, 5);

    loadRiverModels(scene);

    // E 방향
    loadEastModels(scene);
    loadEastBuildingModels(scene);

    // SW 방향
    loadSWModels(scene);
    loadSWBuildingModels(scene);

    // N 방향
    loadNorthModels(scene);
    loadNorthBuildingModels(scene);

    // 기상 효과 변화
    weatherController = new WeatherController(scene);

    const clock = new THREE.Clock();

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

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}
