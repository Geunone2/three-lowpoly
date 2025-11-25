import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {loadRiverModels} from "./Loaders/Layer1/loadRiverObj.jsx";
import {loadSWModels} from "./Loaders/Layer1/loadSWObj.jsx";
import {loadSWBuildingModels} from "./Loaders/Layer2/loadSWBuildingObj.jsx";
import {loadNorthModels} from "./Loaders/Layer1/loadNorthObj.jsx";
import {loadNorthBuildingModels} from "./Loaders/Layer2/loadNorthBuildingObj.jsx";
import {loadEastModels} from "./Loaders/Layer1/loadEastObj.jsx";
import {loadEastBuildingModels} from "./Loaders/Layer2/loadEastBuildingObj.jsx";

export default function MainScene() {
    // ✅ Renderer 설정
    const canvas = document.querySelector('#c');

    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 1000);
    camera.position.set(0, 5, 20);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('white');

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
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        scene.background = new THREE.Color(0x000000);

        camera.updateProjectionMatrix();

        scene.background.set(0x000000);

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}