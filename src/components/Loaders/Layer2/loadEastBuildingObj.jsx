import {OBJLoader} from "three/addons/loaders/OBJLoader.js";
import {MTLLoader} from "three/addons/loaders/MTLLoader.js";

const tileSize = 0.577;   // 👉 river OBJ 실제 폭에 맞게 수정

export const eastBuildingModelCache = {};

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


const EastBuildingLayOut2 = [


    {type: 'sand', position: hexPosition(10, -9, 0.1)},

    {type: 'sand', position: hexPosition(10, -8, 0.2)},

    {type: 'sand-rocks', position: hexPosition(9, -7, 0.3)},
    {type: 'sand', position: hexPosition(9, -7, 0.1)},
    {type: 'sand-desert', position: hexPosition(10, -7, 0.2)},


    {type: 'sand-desert', position: hexPosition(8, -6, 0.3)},
    {type: 'sand', position: hexPosition(8, -6, 0.1)},
    {type: 'sand-desert', position: hexPosition(9, -6, 0.4)},
    {type: 'sand', position: hexPosition(9, -6, 0.2)},
    {type: 'sand-desert', position: hexPosition(10, -6, 0.3)},
    {type: 'sand', position: hexPosition(10, -6, 0.1)},


    {type: 'unit-tower', position: hexPosition(8, -5, 0.5)},
    {type: 'sand', position: hexPosition(8, -5, 0.3)},
    {type: 'sand', position: hexPosition(8, -5, 0.1)},
    {type: 'sand-desert', position: hexPosition(9, -5, 0.6)},
    {type: 'sand', position: hexPosition(9, -5, 0.4)},
    {type: 'sand', position: hexPosition(9, -5, 0.2)},
    {type: 'sand-rocks', position: hexPosition(10, -5, 0.5)},
    {type: 'sand', position: hexPosition(10, -5, 0.3)},
    {type: 'sand', position: hexPosition(10, -5, 0.1)},

    {type: 'sand', position: hexPosition(6, -4, 0.3)},
    {type: 'sand', position: hexPosition(6, -4, 0.1)},
    {type: 'sand-rocks', position: hexPosition(7, -4, 0.4)},
    {type: 'sand', position: hexPosition(7, -4, 0.2)},
    {type: 'sand-desert', position: hexPosition(8, -4, 0.3)},
    {type: 'sand', position: hexPosition(8, -4, 0.1)},
    {type: 'sand', position: hexPosition(9, -4, 0.2)},

    {type: 'sand', position: hexPosition(5, -3, 0.1)},
    {type: 'unit-tower', position: hexPosition(6, -3, 0.4)},
    {type: 'sand', position: hexPosition(6, -3, 0.2)},
    {type: 'sand-desert', position: hexPosition(7, -3, 0.3)},
    {type: 'sand-desert', position: hexPosition(7, -3, 0.1)},
    {type: 'sand-rocks', position: hexPosition(8, -3, 0.2)},

    {type: 'sand-rocks', position: hexPosition(5, -2, 0.1)},
    {type: 'sand', position: hexPosition(6, -2, 0.1)},
    {type: 'sand-desert', position: hexPosition(7, -2, 0.1)},
    {type: 'sand-desert', position: hexPosition(8, -2, 0.1)},

    {type: 'unit-mill', position: hexPosition(10, -3, 0.2), dir: "SW"},
    {type: 'unit-tree', position: hexPosition(11, -3, 0.2)},

    {type: 'unit-tree', position: hexPosition(9, -2, 0.2)},

    {type: 'unit-ship', position: hexPosition(8, 0, 0.2)},
    {type: 'unit-tree', position: hexPosition(10, 0, 0.2)},

    {type: 'unit-house', position: hexPosition(7, 1, 0.2)},

    {type: 'unit-tower', position: hexPosition(4, 2, 0.2)},

    {type: 'path-corner', position: hexPosition(5, 4, 0.2), dir: "S"},
    {type: 'path-straight', position: hexPosition(6, 4, 0.2)},

    {type: 'path-intersectionD', position: hexPosition(4, 5, 0.2)},
    {type: 'path-straight', position: hexPosition(5, 5, 0.2)},

    {type: 'path-corner', position: hexPosition(4, 6, 0.2), dir: "NE"},


];


function loadModel(type) {
    const objUrl = `/assets/hexagon-kit/Models/OBJ/${type}.obj`;
    const mtlUrl = `/assets/hexagon-kit/Models/OBJ/${type}.mtl`;

    return new Promise((resolve, reject) => {
        if (eastBuildingModelCache[type]) {
            resolve(eastBuildingModelCache[type].clone(true));
            return;
        }

        const mtlLoader = new MTLLoader();
        mtlLoader.load(mtlUrl, (materials) => {
            materials.preload();

            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);

            objLoader.load(objUrl, (obj => {
                obj.traverse(child => {
                    child.userData.type = type;
                });
                eastBuildingModelCache[type] = obj;
                resolve(obj.clone(true));
            }), undefined, reject)
        })
    })
};

export async function loadEastBuildingModels(scene) {

    for (const item of EastBuildingLayOut2) {
        const object = await loadModel(item.type);

        object.position.set(...item.position); // 원래 위치
        if (item.dir) {
            object.rotation.y = getRotation(item.dir);
        }
        object.traverse(child => {
            if (child.isMesh) {
                child.userData.region = "desert";
            }
        });
        scene.add(object);
    }

}