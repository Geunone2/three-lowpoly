import {OBJLoader} from "three/addons/loaders/OBJLoader.js";
import {MTLLoader} from "three/addons/loaders/MTLLoader.js";

const tileSize = 0.577;   // 👉 river OBJ 실제 폭에 맞게 수정

export const swBuildingModelCache = {};

function hexPosition(q, r, y = 0) {
    const x = tileSize * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
    const z = tileSize * (1.5 * r);
    return [x, y, z];
}

function getRotation(dir) {
    const map = {
        N: 0,                        // 북쪽: +Z 방향 (기본 방향)
        S: Math.PI,                 // 남쪽: -Z 방향 (뒤로 보게 회전)
        E: -Math.PI / 2,            // 동쪽: -X 방향 (오른쪽 방향)
        W: Math.PI / 2,             // 서쪽: +X 방향 (왼쪽 방향)

        NE: -Math.PI / 3,           // 북동: ↗ 대각선 방향 (Z+ & X-)
        NW: Math.PI / 3,            // 북서: ↖ 대각선 방향 (Z+ & X+)
        SE: -Math.PI * 2 / 3,       // 남동: ↘ 대각선 방향 (Z- & X-)
        SW: Math.PI * 2 / 3,        // 남서: ↙ 대각선 방향 (Z- & X+)
    };
    return map[dir] ?? 0;
}


const SWBuildingLayOut2 = [


    // 바다 지형
    {type: 'unit-ship', position: hexPosition(-7, 1, 0.1), dir: "SE"},
    {type: 'unit-ship-large', position: hexPosition(-5, 7, 0.1)},

    {type: 'stone-rocks', position: hexPosition(-4, 3, 0.1)},
    {type: 'stone-rocks', position: hexPosition(-5, 3, 0)},

    {type: 'stone-rocks', position: hexPosition(-4, 4, 0.1)},
    {type: 'stone-mountain', position: hexPosition(-5, 4, 0.3)},
    {type: 'dirt', position: hexPosition(-5, 4, 0.2)},
    {type: 'stone-hill', position: hexPosition(-6, 4, 0.1)},

    {type: 'stone-hill', position: hexPosition(-6, 5, 0.1)},
    {type: 'stone', position: hexPosition(-5, 5, 0)},


    {type: 'unit-ship-large', position: hexPosition(-11, 6, 0.1), dir: "SW"},

    {type: 'unit-tower', position: hexPosition(-3, 6, 0.1)},
    {type: 'stone-rocks', position: hexPosition(-8, 8, 0.1)},
    {type: 'grass-hill', position: hexPosition(-9, 8, 0.0)},

    {type: 'grass-forest', position: hexPosition(-8, 9, 0)},
    {type: 'path-corner-sharp', position: hexPosition(-9, 9, 0.2), dir: "SW"},
    {type: 'path-corner', position: hexPosition(-10, 9, 0.2), dir: "SW"},
    {type: 'path-square-end', position: hexPosition(-11, 9, 0.2), dir: "S"},

    {type: 'grass-forest', position: hexPosition(-8, 10, 0)},
    {type: 'path-straight', position: hexPosition(-9, 10, 0.2), dir: "SW"},
    {type: 'path-intersectionB', position: hexPosition(-10, 10, 0.2), dir: "NW"},
    {type: 'stone-mountain', position: hexPosition(-11, 10, 0.2)},

    {type: 'building-wall', position: hexPosition(-4, 9, 0.1), dir: "E"},
    {type: 'building-wall', position: hexPosition(-3, 9, 0.1)},

    {type: 'building-wall', position: hexPosition(-3, 10, 0.1)},
    {type: 'building-wizard-tower', position: hexPosition(-4, 10, 0.2)},
    {type: 'building-wall', position: hexPosition(-5, 10, 0.1)},

    {type: 'building-wall', position: hexPosition(-5, 11, 0.1)},
    {type: 'building-wall', position: hexPosition(-4, 11, 0.1), dir: "E"},


    {type: 'grass-hill', position: hexPosition(-8, 11, 0)},
    {type: 'path-start', position: hexPosition(-9, 11, 0.2), dir: "NE"},
    {type: 'grass-forest', position: hexPosition(-10, 11, 0)},
    {type: 'building-mine', position: hexPosition(-11, 11, 0.1), dir: "SE"},


];


function loadModel(type) {
    const objUrl = `/assets/hexagon-kit/Models/OBJ/${type}.obj`;
    const mtlUrl = `/assets/hexagon-kit/Models/OBJ/${type}.mtl`;

    return new Promise((resolve, reject) => {
        if (swBuildingModelCache[type]) {
            resolve(swBuildingModelCache[type].clone(true));
            return;
        }

        const mtlLoader = new MTLLoader();
        mtlLoader.load(mtlUrl, (materials) => {
            materials.preload();

            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);

            objLoader.load(objUrl, (obj) => {
                obj.traverse(child => {
                    child.userData.type = type;
                });
                swBuildingModelCache[type] = obj;
                resolve(obj.clone(true));
            }, undefined, reject)
        })
    })
};

export async function loadSWBuildingModels(scene) {

    for (const item of SWBuildingLayOut2) {
        const object = await loadModel(item.type);

        object.position.set(...item.position); // 원래 위치
        if (item.dir) {
            object.rotation.y = getRotation(item.dir);
        }

        object.traverse(child => {
            if (child.isMesh) {
                child.userData.region = "sea";
            }
        });
        scene.add(object);
    }

}