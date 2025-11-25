import {OBJLoader} from "three/addons/loaders/OBJLoader.js";
import {MTLLoader} from "three/addons/loaders/MTLLoader.js";

const tileSize = 0.577;   // 👉 river OBJ 실제 폭에 맞게 수정

export const riverModelCache = {};

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


const riverLayOut2 = [

    // 중심
    {type: 'river-intersectionF', position: hexPosition(0, 0, 0)},

    // 대각선(남동쪽 ↘) 물줄기
    {type: "river-straight", position: hexPosition(0, 1, 0), dir: "NE"},
    {type: "river-straight", position: hexPosition(0, 2, 0), dir: "NE"},
    {type: "river-straight", position: hexPosition(0, 3, 0), dir: "NE"},
    {type: "river-straight", position: hexPosition(0, 4, 0), dir: "NE"},
    {type: "river-straight", position: hexPosition(0, 5, 0), dir: "NE"},
    {type: "river-straight", position: hexPosition(0, 6, 0), dir: "NE"},
    {type: "river-straight", position: hexPosition(0, 7, 0), dir: "NE"},
    {type: "river-straight", position: hexPosition(0, 8, 0), dir: "NE"},
    {type: "river-straight", position: hexPosition(0, 9, 0), dir: "NE"},
    {type: "river-straight", position: hexPosition(0, 10, 0), dir: "NE"},
    {type: "river-straight", position: hexPosition(0, 11, 0), dir: "NE"},
    {type: 'river-corner-sharp', position: hexPosition(0, 12, 0), dir: 'NE'},

    // 대각선 (남동쪽 ↗) 물줄기
    {type: "river-straight", position: hexPosition(1, 11, 0), dir: "SE"},
    {type: "river-straight", position: hexPosition(2, 10, 0), dir: "SE"},
    {type: "river-straight", position: hexPosition(3, 9, 0), dir: "SE"},
    {type: "river-straight", position: hexPosition(4, 8, 0), dir: "SE"},
    {type: "river-straight", position: hexPosition(5, 7, 0), dir: "SE"},
    {type: "river-straight", position: hexPosition(6, 6, 0), dir: "SE"},
    {type: "river-straight", position: hexPosition(7, 5, 0), dir: "SE"},
    {type: "river-straight", position: hexPosition(8, 4, 0), dir: "SE"},
    {type: "river-straight", position: hexPosition(9, 3, 0), dir: "SE"},
    {type: "river-straight", position: hexPosition(10, 2, 0), dir: "SE"},
    {type: "river-straight", position: hexPosition(11, 1, 0), dir: "SE"},
    {type: "river-intersectionA", position: hexPosition(12, 0, 0), dir: "NW"},

    // 대각선 (북동쪽 ↗) 물줄기
    {type: "river-straight", position: hexPosition(1, -1, 0), dir: "SE"},
    {type: "river-straight", position: hexPosition(2, -2, 0), dir: "SE"},
    {type: "river-straight", position: hexPosition(3, -3, 0), dir: "SE"},
    {type: "river-straight", position: hexPosition(4, -4, 0), dir: "SE"},
    {type: "river-straight", position: hexPosition(5, -5, 0), dir: "SE"},
    {type: 'building-watermill', position: hexPosition(6, -6, 0), dir: "SE"}, {type: "river-straight", position: hexPosition(7, -7, 0), dir: "SE"},
    {type: "river-straight", position: hexPosition(8, -8, 0), dir: "SE"},
    {type: "river-straight", position: hexPosition(9, -9, 0), dir: "SE"},
    {type: "bridge", position: hexPosition(10, -10, 0), dir: "SE"},
    {type: "river-straight", position: hexPosition(11, -11, 0), dir: "SE"},
    {type: 'river-intersectionA', position: hexPosition(12, -12, 0), dir: 'SW'},

    // 대각선(북동쪽 ↘) 물줄기
    {type: "river-straight", position: hexPosition(12, -1, 0), dir: "NE"},
    {type: "river-straight", position: hexPosition(12, -2, 0), dir: "NE"},
    {type: "river-straight", position: hexPosition(12, -3, 0), dir: "NE"},
    {type: "river-straight", position: hexPosition(12, -4, 0), dir: "NE"},
    {type: "river-straight", position: hexPosition(12, -5, 0), dir: "NE"},
    {type: "river-straight", position: hexPosition(12, -6, 0), dir: "NE"},
    {type: "river-straight", position: hexPosition(12, -7, 0), dir: "NE"},
    {type: "river-straight", position: hexPosition(12, -8, 0), dir: "NE"},
    {type: "river-straight", position: hexPosition(12, -9, 0), dir: "NE"},
    {type: "river-straight", position: hexPosition(12, -10, 0), dir: "NE"},
    {type: "river-straight", position: hexPosition(12, -11, 0), dir: "NE"},


    // 직선 (서쪽 ←) 물줄기
    {type: "river-straight", position: hexPosition(-1, 0, 0), dir: "S"},
    {type: "river-straight", position: hexPosition(-2, 0, 0), dir: "S"},
    {type: "building-watermill", position: hexPosition(-3, 0, 0), dir: "S"},
    {type: "river-straight", position: hexPosition(-4, 0, 0), dir: "S"},
    {type: "river-end", position: hexPosition(-5, 0, 0), dir: "S"},
    {type: "building-port", position: hexPosition(-6, 0, 0), dir: "NW"},
    {type: "river-end", position: hexPosition(-7, 0, 0), dir: "N"},
    {type: "river-straight", position: hexPosition(-8, 0, 0), dir: "S"},
    {type: "river-straight", position: hexPosition(-9, 0, 0), dir: "S"},
    {type: "river-straight", position: hexPosition(-10, 0, 0), dir: "S"},
    {type: "river-straight", position: hexPosition(-11, 0, 0), dir: "S"},
    {type: "river-intersectionA", position: hexPosition(-12, 0, 0), dir: "SE"},

    // 대각선 (남서쪽 ↘) 물줄기
    {type: "water", position: hexPosition(-12, 1, 0), dir: "SW"},
    {type: "water", position: hexPosition(-12, 2, 0), dir: "SW"},
    {type: "water", position: hexPosition(-12, 3, 0), dir: "SW"},
    {type: "water", position: hexPosition(-12, 4, 0), dir: "SW"},
    {type: "water", position: hexPosition(-12, 5, 0), dir: "SW"},
    {type: "water", position: hexPosition(-12, 6, 0), dir: "SW"},
    {type: "water", position: hexPosition(-12, 7, 0), dir: "SW"},
    {type: "water", position: hexPosition(-12, 8, 0), dir: "SW"},
    {type: "water", position: hexPosition(-12, 9, 0), dir: "SW"},
    {type: "water", position: hexPosition(-12, 10, 0), dir: "SW"},
    {type: "water", position: hexPosition(-12, 11, 0), dir: "SW"},
    {type: "water", position: hexPosition(-12, 12, 0), dir: "NE"},

    // 직선 (남서쪽 →) 물줄기
    {type: "water", position: hexPosition(-11, 12, 0), dir: "S"},
    {type: "water", position: hexPosition(-10, 12, 0), dir: "S"},
    {type: "water", position: hexPosition(-9, 12, 0), dir: "S"},
    {type: "water", position: hexPosition(-8, 12, 0), dir: "S"},
    {type: "water", position: hexPosition(-7, 12, 0), dir: "S"},
    {type: "water", position: hexPosition(-6, 12, 0), dir: "S"},
    {type: "water", position: hexPosition(-5, 12, 0), dir: "S"},
    {type: "water", position: hexPosition(-4, 12, 0), dir: "S"},
    {type: "water", position: hexPosition(-3, 12, 0), dir: "S"},
    {type: "water", position: hexPosition(-2, 12, 0), dir: "S"},
    {type: "water", position: hexPosition(-1, 12, 0), dir: "S"},

    // 대각선 (북서쪽 ↗) 물줄기
    {type: "river-straight", position: hexPosition(-11, -1, 0), dir: "NW"},
    {type: "river-straight", position: hexPosition(-10, -2, 0), dir: "NW"},
    {type: "river-straight", position: hexPosition(-9, -3, 0), dir: "NW"},
    {type: "river-straight", position: hexPosition(-8, -4, 0), dir: "NW"},
    {type: "river-straight", position: hexPosition(-7, -5, 0), dir: "NW"},
    {type: "river-straight", position: hexPosition(-6, -6, 0), dir: "NW"},
    {type: "river-straight", position: hexPosition(-5, -7, 0), dir: "NW"},
    {type: "river-straight", position: hexPosition(-4, -8, 0), dir: "NW"},
    {type: "river-straight", position: hexPosition(-3, -9, 0), dir: "NW"},
    {type: "river-straight", position: hexPosition(-2, -10, 0), dir: "NW"},
    {type: "river-straight", position: hexPosition(-1, -11, 0), dir: "NW"},
    {type: "river-corner", position: hexPosition(0, -12, 0), dir: "S"},

    // 직선 (북서쪽 →) 물줄기
    {type: "river-straight", position: hexPosition(1, -12, 0), dir: "N"},
    {type: "river-straight", position: hexPosition(2, -12, 0), dir: "N"},
    {type: "river-straight", position: hexPosition(3, -12, 0), dir: "N"},
    {type: "river-straight", position: hexPosition(4, -12, 0), dir: "N"},
    {type: "river-straight", position: hexPosition(5, -12, 0), dir: "N"},
    {type: "river-straight", position: hexPosition(6, -12, 0), dir: "N"},
    {type: "river-straight", position: hexPosition(7, -12, 0), dir: "N"},
    {type: "river-straight", position: hexPosition(8, -12, 0), dir: "N"},
    {type: "river-straight", position: hexPosition(9, -12, 0), dir: "N"},
    {type: "river-straight", position: hexPosition(10, -12, 0), dir: "N"},
    {type: "river-straight", position: hexPosition(11, -12, 0), dir: "N"},
];


function loadModel(type) {
    const objUrl = `/assets/hexagon-kit/Models/OBJ/${type}.obj`;
    const mtlUrl = `/assets/hexagon-kit/Models/OBJ/${type}.mtl`;

    return new Promise((resolve, reject) => {
        if (riverModelCache[type]) {
            resolve(riverModelCache[type].clone(true));
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
                riverModelCache[type] = obj;
                resolve(obj.clone(true));
            }, undefined, reject)
        })
    })
};

export async function loadRiverModels(scene) {

    for (const item of riverLayOut2) {
        const object = await loadModel(item.type);

        object.position.set(...item.position); // 원래 위치
        if (item.dir) {
            object.rotation.y = getRotation(item.dir);
        }
        scene.add(object);
    }

}