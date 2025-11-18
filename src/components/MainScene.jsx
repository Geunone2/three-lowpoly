import * as THREE from 'three';
import {OBJLoader} from "three/addons/loaders/OBJLoader.js";
import {MTLLoader} from "three/addons";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

export default function MainScene() {
    // ✅ Renderer 설정
    const canvas = document.querySelector('#c');

    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 1000);
    camera.position.set(0, 5, 10);
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

    const objFiles = Object.values(
        import.meta.glob("../assets/hexagon-kit/Models/OBJ/*.obj", {eager: true})
    ).map(m => m.default);


    const mtlFiles = Object.values(
        import.meta.glob("../assets/hexagon-kit/Models/OBJ/*.mtl", {eager: true})
    ).map(m => m.default);

    function loadModel(objUrl, mtlUrl) {
        return new Promise((resolve) => {
            const mtlLoader = new MTLLoader();
            mtlLoader.load(mtlUrl, (materials) => {
                materials.preload();

                const objLoader = new OBJLoader();
                objLoader.setMaterials(materials);

                objLoader.load(objUrl, (object) => {
                    resolve(object);
                })
            })
        })
    }

    async function loadAllModels() {
        const count = objFiles.length;

        // 정사각형 크기 (2x2, 3x3, 4x4...)
        const gridSize = Math.ceil(Math.sqrt(count));

        const gap = 2; // 모델 간 간격
        const half = (gridSize - 1) / 2; // 중심으로 맞추기 offset

        for (let i = 0; i < count; i++) {
            const objUrl = objFiles[i];
            const mtlUrl = mtlFiles[i];

            const object = await loadModel(objUrl, mtlUrl);

            // grid 좌표 계산
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;

            // 중심 기준 좌표로 변환 (중요!)
            const x = (col - half) * gap;
            const z = (row - half) * gap;

            object.position.set(x, 0, z);

            scene.add(object);
        }
    }

    loadAllModels();

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