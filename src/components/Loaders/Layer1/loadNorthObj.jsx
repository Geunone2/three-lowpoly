import {OBJLoader} from "three/addons/loaders/OBJLoader.js";
import {MTLLoader} from "three/addons/loaders/MTLLoader.js";

const tileSize = 0.577;   // 👉 river OBJ 실제 폭에 맞게 수정

export const northModelCache = {};

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


const NorthLayOut2 = [

    {type: 'grass', position: hexPosition(0, -1, 0)},
    {type: 'grass', position: hexPosition(-1, -1, 0)},
    {type: 'grass', position: hexPosition(-2, -1, 0)},
    {type: 'grass', position: hexPosition(-3, -1, 0)},
    {type: 'grass-hill', position: hexPosition(-4, -1, 0)},
    {type: 'grass-forest', position: hexPosition(-5, -1, 0)},
    {type: 'grass', position: hexPosition(-6, -1, 0)},
    {type: 'grass', position: hexPosition(-7, -1, 0)},
    {type: 'building-farm', position: hexPosition(-8, -1, 0), dir: "NE"},
    {type: 'building-farm', position: hexPosition(-9, -1, 0), dir: "SE"},
    {type: 'grass', position: hexPosition(-10, -1, 0)},

    {type: 'grass', position: hexPosition(1, -2, 0)},
    {type: 'grass', position: hexPosition(0, -2, 0)},
    {type: 'grass-hill', position: hexPosition(-1, -2, 0)},
    {type: 'grass-forest', position: hexPosition(-2, -2, 0)},
    {type: 'grass', position: hexPosition(-3, -2, 0)},
    {type: 'grass', position: hexPosition(-4, -2, 0)},
    {type: 'grass', position: hexPosition(-5, -2, 0)},
    {type: 'grass', position: hexPosition(-6, -2, 0)},
    {type: 'grass', position: hexPosition(-7, -2, 0)},
    {type: 'grass', position: hexPosition(-8, -2, 0)},
    {type: 'building-village', position: hexPosition(-9, -2, 0), dir: "S"},

    {type: 'grass-forest', position: hexPosition(2, -3, 0)},
    {type: 'grass-forest', position: hexPosition(1, -3, 0)},
    {type: 'grass-forest', position: hexPosition(0, -3, 0)},
    {type: 'grass', position: hexPosition(-1, -3, 0)},
    {type: 'grass', position: hexPosition(-2, -3, 0)},
    {type: 'grass', position: hexPosition(-3, -3, 0)},
    {type: 'grass', position: hexPosition(-4, -3, 0)},
    {type: 'grass', position: hexPosition(-5, -3, 0)},
    {type: 'grass', position: hexPosition(-6, -3, 0)},
    {type: 'grass-forest', position: hexPosition(-7, -3, 0)},
    {type: 'grass', position: hexPosition(-8, -3, 0)},
    {type: 'grass-forest', position: hexPosition(-8, -3, 0.1)},

    {type: 'building-sheep', position: hexPosition(3, -4, 0)},
    {type: 'grass', position: hexPosition(2, -4, 0)},
    {type: 'grass-forest', position: hexPosition(1, -4, 0)},
    {type: 'building-house', position: hexPosition(0, -4, 0), dir: "NE"},
    {type: 'grass', position: hexPosition(-1, -4, 0)},
    {type: 'grass', position: hexPosition(-2, -4, 0)},
    {type: 'grass', position: hexPosition(-3, -4, 0)},
    {type: 'grass', position: hexPosition(-4, -4, 0)},
    {type: 'grass', position: hexPosition(-5, -4, 0)},
    {type: 'grass', position: hexPosition(-6, -4, 0)},
    {type: 'grass', position: hexPosition(-7, -4, 0)},

    {type: 'grass-forest', position: hexPosition(4, -5, 0)},
    {type: 'grass', position: hexPosition(3, -5, 0)},
    {type: 'grass-forest', position: hexPosition(2, -5, 0)},
    {type: 'building-house', position: hexPosition(1, -5, 0)},
    {type: 'dirt', position: hexPosition(0, -5, 0.1)},
    {type: 'dirt', position: hexPosition(-1, -5, 0.1)},
    {type: 'dirt', position: hexPosition(0, -5, 0)},
    {type: 'dirt', position: hexPosition(-1, -5, 0)},
    {type: 'grass-forest', position: hexPosition(-2, -5, 0)},
    {type: 'grass', position: hexPosition(-3, -5, 0)},
    {type: 'grass', position: hexPosition(-4, -5, 0)},
    {type: 'grass', position: hexPosition(-5, -5, 0)},
    {type: 'grass-hill', position: hexPosition(-6, -5, 0)},

    {type: 'grass', position: hexPosition(5, -6, 0)},
    {type: 'grass', position: hexPosition(4, -6, 0)},
    {type: 'grass', position: hexPosition(3, -6, 0)},
    {type: 'grass', position: hexPosition(2, -6, 0)},
    {type: 'dirt', position: hexPosition(1, -6, 0.1)},
    {type: 'dirt', position: hexPosition(1, -6, 0)},
    {type: 'building-market', position: hexPosition(0, -6, 0)},
    {type: 'dirt', position: hexPosition(-1, -6, 0.1)},
    {type: 'dirt', position: hexPosition(-1, -6, 0)},
    {type: 'grass-forest', position: hexPosition(-2, -6, 0)},
    {type: 'grass', position: hexPosition(-3, -6, 0)},
    {type: 'grass-forest', position: hexPosition(-4, -6, 0)},
    {type: 'grass-forest', position: hexPosition(-5, -6, 0)},

    {type: 'grass-forest', position: hexPosition(6, -7, 0)},
    {type: 'grass-forest', position: hexPosition(5, -7, 0)},
    {type: 'grass', position: hexPosition(4, -7, 0)},
    {type: 'grass-forest', position: hexPosition(3, -7, 0)},
    {type: 'building-archery', position: hexPosition(2, -7, 0), dir: "N"},
    {type: 'dirt', position: hexPosition(1, -7, 0.1)},
    {type: 'dirt', position: hexPosition(1, -7, 0)},
    {type: 'dirt', position: hexPosition(0, -7, 0.1)},
    {type: 'dirt', position: hexPosition(0, -7, 0)},
    {type: 'building-wall', position: hexPosition(-1, -7, 0), dir: "SE"},
    {type: 'building-wall', position: hexPosition(-2, -7, 0), dir: "SE"},
    {type: 'building-wall', position: hexPosition(-3, -7, 0), dir: "SE"},
    {type: 'building-walls', position: hexPosition(-4, -7, 0)},


    {type: 'grass-forest', position: hexPosition(7, -8, 0)},
    {type: 'grass-forest', position: hexPosition(6, -8, 0)},
    {type: 'grass', position: hexPosition(5, -8, 0)},
    {type: 'grass-forest', position: hexPosition(4, -8, 0)},
    {type: 'grass-forest', position: hexPosition(3, -8, 0)},
    {type: 'building-wall', position: hexPosition(2, -8, 0), dir: "SW"},
    {type: 'stone', position: hexPosition(1, -8, 0)},
    {type: 'stone', position: hexPosition(0, -8, 0)},
    {type: 'stone', position: hexPosition(-1, -8, 0)},
    {type: 'stone', position: hexPosition(-2, -8, 0)},
    {type: 'stone', position: hexPosition(-3, -8, 0)},

    {type: 'grass', position: hexPosition(8, -9, 0)},
    {type: 'grass', position: hexPosition(7, -9, 0)},
    {type: 'grass', position: hexPosition(6, -9, 0)},
    {type: 'grass-forest', position: hexPosition(5, -9, 0)},
    {type: 'grass-forest', position: hexPosition(4, -9, 0)},
    {type: 'building-wall', position: hexPosition(3, -9, 0), dir: "SW"},
    {type: 'stone', position: hexPosition(2, -9, 0)},
    {type: 'stone', position: hexPosition(1, -9, 0)},
    {type: 'stone', position: hexPosition(0, -9, 0)},
    {type: 'stone', position: hexPosition(-1, -9, 0)},
    {type: 'stone', position: hexPosition(-2, -9, 0)},

    {type: 'grass', position: hexPosition(9, -10, 0)},
    {type: 'grass', position: hexPosition(8, -10, 0)},
    {type: 'grass', position: hexPosition(7, -10, 0)},
    {type: 'grass', position: hexPosition(6, -10, 0)},
    {type: 'grass-forest', position: hexPosition(5, -10, 0)},
    {type: 'building-wall', position: hexPosition(4, -10, 0), dir: "SW"},
    {type: 'stone', position: hexPosition(3, -10, 0)},
    {type: 'stone', position: hexPosition(2, -10, 0)},
    {type: 'stone', position: hexPosition(1, -10, 0)},
    {type: 'stone', position: hexPosition(0, -10, 0)},
    {type: 'stone', position: hexPosition(-1, -10, 0)},


    {type: 'grass-forest', position: hexPosition(10, -11, 0)},
    {type: 'grass', position: hexPosition(9, -11, 0)},
    {type: 'grass', position: hexPosition(8, -11, 0)},
    {type: 'grass', position: hexPosition(7, -11, 0)},
    {type: 'grass-forest', position: hexPosition(6, -11, 0)},
    {type: 'building-walls', position: hexPosition(5, -11, 0)},
    {type: 'stone', position: hexPosition(4, -11, 0)},
    {type: 'stone', position: hexPosition(3, -11, 0)},
    {type: 'stone', position: hexPosition(2, -11, 0)},
    {type: 'stone', position: hexPosition(1, -11, 0)},
    {type: 'stone', position: hexPosition(0, -11, 0)},
];


function loadModel(type) {
    const objUrl = `/assets/hexagon-kit/Models/OBJ/${type}.obj`;
    const mtlUrl = `/assets/hexagon-kit/Models/OBJ/${type}.mtl`;

    return new Promise((resolve, reject) => {
        if (northModelCache[type]) {
            resolve(northModelCache[type].clone(true));
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
                northModelCache[type] = obj;
                resolve(obj.clone(true));
            }, undefined, reject)
        })
    })
};

export async function loadNorthModels(scene) {

    for (const item of NorthLayOut2) {
        const object = await loadModel(item.type);

        object.position.set(...item.position); // 원래 위치
        if (item.dir) {
            object.rotation.y = getRotation(item.dir);
        }
        scene.add(object);
    }

}