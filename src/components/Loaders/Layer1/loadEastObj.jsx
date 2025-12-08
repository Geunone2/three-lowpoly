import {OBJLoader} from "three/addons/loaders/OBJLoader.js";
import {MTLLoader} from "three/addons/loaders/MTLLoader.js";

const tileSize = 0.577;   // 👉 river OBJ 실제 폭에 맞게 수정

export const eastModelCache = {};

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


const EastLayOut2 = [

    {type: 'sand-desert', position: hexPosition(11, -10, 0)},

    {type: 'sand', position: hexPosition(10, -9, 0)},
    {type: 'sand-rocks', position: hexPosition(11, -9, 0)},

    {type: 'sand', position: hexPosition(9, -8, 0)},
    {type: 'sand', position: hexPosition(10, -8, 0)},
    {type: 'sand-desert', position: hexPosition(11, -8, 0)},

    {type: 'sand', position: hexPosition(8, -7, 0)},
    {type: 'sand', position: hexPosition(9, -7, 0)},
    {type: 'sand', position: hexPosition(10, -7, 0)},
    {type: 'sand-desert', position: hexPosition(11, -7, 0)},

    {type: 'sand', position: hexPosition(7, -6, 0)},
    {type: 'sand', position: hexPosition(8, -6, 0)},
    {type: 'sand', position: hexPosition(9, -6, 0)},
    {type: 'sand', position: hexPosition(10, -6, 0)},
    {type: 'sand-desert', position: hexPosition(11, -6, 0)},

    {type: 'sand', position: hexPosition(6, -5, 0)},
    {type: 'sand', position: hexPosition(7, -5, 0)},
    {type: 'sand', position: hexPosition(8, -5, 0)},
    {type: 'sand', position: hexPosition(9, -5, 0)},
    {type: 'sand-desert', position: hexPosition(10, -5, 0)},
    {type: 'sand-rocks', position: hexPosition(11, -5, 0)},

    {type: 'sand', position: hexPosition(5, -4, 0)},
    {type: 'sand', position: hexPosition(6, -4, 0)},
    {type: 'sand', position: hexPosition(7, -4, 0)},
    {type: 'sand', position: hexPosition(8, -4, 0)},
    {type: 'sand-desert', position: hexPosition(9, -4, 0)},
    {type: 'sand-desert', position: hexPosition(10, -4, 0)},
    {type: 'sand-desert', position: hexPosition(11, -4, 0)},

    {type: 'sand', position: hexPosition(4, -3, 0)},
    {type: 'sand', position: hexPosition(5, -3, 0)},
    {type: 'sand', position: hexPosition(6, -3, 0)},
    {type: 'sand', position: hexPosition(7, -3, 0)},
    {type: 'sand', position: hexPosition(8, -3, 0)},
    {type: 'sand', position: hexPosition(9, -3, 0)},
    {type: 'sand', position: hexPosition(10, -3, 0)},
    {type: 'sand-desert', position: hexPosition(11, -3, 0)},

    {type: 'sand', position: hexPosition(3, -2, 0)},
    {type: 'sand', position: hexPosition(4, -2, 0)},
    {type: 'sand', position: hexPosition(5, -2, 0)},
    {type: 'sand', position: hexPosition(6, -2, 0)},
    {type: 'sand', position: hexPosition(7, -2, 0)},
    {type: 'sand', position: hexPosition(8, -2, 0)},
    {type: 'sand', position: hexPosition(9, -2, 0)},
    {type: 'water', position: hexPosition(10, -2, 0)},
    {type: 'water', position: hexPosition(11, -2, 0)},

    {type: 'sand-desert', position: hexPosition(2, -1, 0)},
    {type: 'sand-desert', position: hexPosition(3, -1, 0)},
    {type: 'sand-desert', position: hexPosition(4, -1, 0)},
    {type: 'sand-desert', position: hexPosition(5, -1, 0)},
    {type: 'sand-desert', position: hexPosition(6, -1, 0)},
    {type: 'sand-rocks', position: hexPosition(7, -1, 0)},
    {type: 'sand-rocks', position: hexPosition(8, -1, 0)},
    {type: 'water', position: hexPosition(9, -1, 0)},
    {type: 'water', position: hexPosition(10, -1, 0)},
    {type: 'water', position: hexPosition(11, -1, 0)},

    {type: 'sand-desert', position: hexPosition(1, 0, 0)},
    {type: 'sand-rocks', position: hexPosition(2, 0, 0)},
    {type: 'sand-rocks', position: hexPosition(3, 0, 0)},
    {type: 'sand-desert', position: hexPosition(4, 0, 0)},
    {type: 'sand-rocks', position: hexPosition(5, 0, 0)},
    {type: 'sand-desert', position: hexPosition(6, 0, 0)},
    {type: 'sand', position: hexPosition(7, 0, 0)},
    {type: 'sand-desert', position: hexPosition(8, 0, 0)},
    {type: 'water', position: hexPosition(9, 0, 0)},
    {type: 'water-island', position: hexPosition(10, 0, 0)},
    {type: 'water', position: hexPosition(11, 0, 0)},

    {type: 'sand-rocks', position: hexPosition(1, 1, 0)},
    {type: 'sand-desert', position: hexPosition(2, 1, 0)},
    {type: 'sand-desert', position: hexPosition(3, 1, 0)},
    {type: 'sand-desert', position: hexPosition(4, 1, 0)},
    {type: 'sand-rocks', position: hexPosition(5, 1, 0)},
    {type: 'sand-rocks', position: hexPosition(6, 1, 0)},
    {type: 'sand', position: hexPosition(7, 1, 0)},
    {type: 'water', position: hexPosition(8, 1, 0)},
    {type: 'water', position: hexPosition(9, 1, 0)},
    {type: 'water', position: hexPosition(10, 1, 0)},


    {type: 'sand-rocks', position: hexPosition(1, 2, 0)},
    {type: 'sand-desert', position: hexPosition(2, 2, 0)},
    {type: 'sand-desert', position: hexPosition(3, 2, 0)},
    {type: 'sand', position: hexPosition(4, 2, 0)},
    {type: 'sand-rocks', position: hexPosition(5, 2, 0)},
    {type: 'sand-desert', position: hexPosition(6, 2, 0)},
    {type: 'sand-desert', position: hexPosition(7, 2, 0)},
    {type: 'water', position: hexPosition(8, 2, 0)},
    {type: 'water', position: hexPosition(9, 2, 0)},

    {type: 'sand-desert', position: hexPosition(1, 3, 0)},
    {type: 'sand-desert', position: hexPosition(2, 3, 0)},
    {type: 'sand-desert', position: hexPosition(3, 3, 0)},
    {type: 'sand-desert', position: hexPosition(4, 3, 0)},
    {type: 'sand-rocks', position: hexPosition(5, 3, 0)},
    {type: 'sand-rocks', position: hexPosition(6, 3, 0)},
    {type: 'sand-rocks', position: hexPosition(7, 3, 0)},
    {type: 'sand-rocks', position: hexPosition(8, 3, 0)},

    {type: 'sand-desert', position: hexPosition(1, 4, 0)},
    {type: 'sand-desert', position: hexPosition(2, 4, 0)},
    {type: 'sand-desert', position: hexPosition(3, 4, 0)},
    {type: 'water', position: hexPosition(4, 4, 0.1)},
    {type: 'sand', position: hexPosition(5, 4, 0)},
    {type: 'sand', position: hexPosition(6, 4, 0)},
    {type: 'building-mine', position: hexPosition(7, 4, 0)},

    {type: 'sand-desert', position: hexPosition(1, 5, 0)},
    {type: 'sand-rocks', position: hexPosition(2, 5, 0)},
    {type: 'building-smelter', position: hexPosition(3, 5, 0)},
    {type: 'sand', position: hexPosition(4, 5, 0)},
    {type: 'sand', position: hexPosition(5, 5, 0)},
    {type: 'building-mine', position: hexPosition(6, 5, 0)},

    {type: 'sand-desert', position: hexPosition(1, 6, 0)},
    {type: 'sand-desert', position: hexPosition(2, 6, 0)},
    {type: 'building-sheep', position: hexPosition(3, 6, 0)},
    {type: 'sand', position: hexPosition(4, 6, 0)},
    {type: 'building-mine', position: hexPosition(5, 6, 0), dir: "SW"},

    {type: 'sand', position: hexPosition(1, 7, 0)},
    {type: 'sand-desert', position: hexPosition(2, 7, 0)},
    {type: 'sand', position: hexPosition(3, 7, 0)},
    {type: 'sand-rocks', position: hexPosition(4, 7, 0)},

    {type: 'sand', position: hexPosition(1, 8, 0)},
    {type: 'sand-desert', position: hexPosition(2, 8, 0)},
    {type: 'sand-desert', position: hexPosition(3, 8, 0)},

    {type: 'sand-rocks', position: hexPosition(1, 9, 0)},
    {type: 'sand-rocks', position: hexPosition(2, 9, 0)},


    {type: 'sand-rocks', position: hexPosition(1, 10, 0)},
];


function loadModel(type) {
    const objUrl = `/assets/hexagon-kit/Models/OBJ/${type}.obj`;
    const mtlUrl = `/assets/hexagon-kit/Models/OBJ/${type}.mtl`;

    return new Promise((resolve, reject) => {
        if (eastModelCache[type]) {
            resolve(eastModelCache[type].clone(true));
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
                eastModelCache[type] = obj;
                resolve(obj.clone(true));
            }, undefined, reject)
        })
    })
};

export async function loadEastModels(scene) {

    for (const item of EastLayOut2) {
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