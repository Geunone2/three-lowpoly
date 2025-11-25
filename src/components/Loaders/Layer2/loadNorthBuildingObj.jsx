import {OBJLoader} from "three/addons/loaders/OBJLoader.js";
import {MTLLoader} from "three/addons/loaders/MTLLoader.js";

const tileSize = 0.577;   // 👉 river OBJ 실제 폭에 맞게 수정

export const northBuildingModelCache = {};

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


const NorthBuildingLayOut2 = [

    // 초원 지형
    {type: 'sand', position: hexPosition(0, -1, 0.1)},
    {type: "building-tower", position: hexPosition(0, -1, 0.3)},
    {type: "grass", position: hexPosition(-1, -1, 0.2)},
    {type: "building-wall", position: hexPosition(-1, -1, 0.3)},
    {type: "grass-hill", position: hexPosition(-2, -1, 0.1)},
    {type: 'path-straight', position: hexPosition(-3, -1, 0.2), dir: "NE"},
    {type: "path-square-end", position: hexPosition(-6, -1, 0.2), dir: "NE"},
    {type: "grass-hill", position: hexPosition(-7, -1, 0.2)},
    {type: "grass-forest", position: hexPosition(-10, -1, 0.2)},

    {type: 'path-end', position: hexPosition(-8, -2, 0.2), dir: "S"},
    {type: 'path-straight', position: hexPosition(-7, -2, 0.2), dir: "S"},
    {type: 'path-intersectionD', position: hexPosition(-6, -2, 0.2), dir: "N"},
    {type: 'path-corner', position: hexPosition(-5, -2, 0.2), dir: "N"},
    {type: 'building-wizard-tower', position: hexPosition(-4, -2, 0.2)},
    {type: 'path-straight', position: hexPosition(-3, -2, 0.2), dir: "SW"},
    {type: 'grass', position: hexPosition(1, -2, 0.2)},
    {type: "building-wall", position: hexPosition(1, -2, 0.3), dir: "S"},
    {type: 'grass', position: hexPosition(0, -2, 0.1), dir: "W"},
    {type: "building-wall", position: hexPosition(0, -2, 0.2), dir: "W"},

    {type: 'unit-mill', position: hexPosition(-6, -3, 0.2), dir: "W"},
    {type: 'path-straight', position: hexPosition(-5, -3, 0.2), dir: "SE"},
    {type: 'path-corner', position: hexPosition(-4, -3, 0.2), dir: "S"},
    {type: 'path-intersectionD', position: hexPosition(-3, -3, 0.2), dir: "N"},
    {type: 'path-straight', position: hexPosition(-2, -3, 0.2)},
    {type: 'building-smelter', position: hexPosition(-1, -3, 0.1)},

    {type: "building-cabin", position: hexPosition(-7, -4, 0.1), dir: "S"},
    {type: "path-straight", position: hexPosition(-6, -4, 0.2)},
    {type: "path-straight", position: hexPosition(-5, -4, 0.2)},
    {type: "path-corner-sharp", position: hexPosition(-4, -4, 0.2), dir: "NW"},
    {type: 'stone-hill', position: hexPosition(-3, -4, 0.2)},
    {type: "path-straight", position: hexPosition(-2, -4, 0.2), dir: "NW"},
    {type: 'unit-mansion', position: hexPosition(-1, -4, 0.2), dir: "E"},
    {type: 'unit-house', position: hexPosition(2, -4, 0.2), dir: "SE"},


    {type: 'path-corner-sharp', position: hexPosition(3, -5, 0.2), dir: "NE"},
    {type: 'grass-hill', position: hexPosition(-3, -5, 0.1)},
    {type: 'grass-forest', position: hexPosition(-4, -5, 0.1)},
    {type: 'grass-forest', position: hexPosition(-5, -5, 0.1)},

    {type: 'path-corner', position: hexPosition(4, -6, 0.2), dir: "S"},
    {type: 'building-tower', position: hexPosition(-3, -6, 0.1)},
    {type: 'path-straight', position: hexPosition(2, -6, 0.2)},
    {type: 'path-intersectionF', position: hexPosition(3, -6, 0.2), dir: "SE"},

    {type: 'path-straight', position: hexPosition(4, -7, 0.2), dir: "SE"},

    {type: "unit-house", position: hexPosition(-3, -8, 0.2), dir: "S"},
    {type: "path-straight", position: hexPosition(-2, -8, 0.2), dir: "S"},
    {type: "path-intersectionH", position: hexPosition(-1, -8, 0.2)},
    {type: "path-straight", position: hexPosition(0, -8, 0.2), dir: "S"},
    {type: "path-intersectionF", position: hexPosition(1, -8, 0.2)},
    {type: 'path-straight', position: hexPosition(5, -8, 0.2), dir: "SE"},

    {type: "unit-tower", position: hexPosition(-2, -9, 0.2)},
    {type: "stone", position: hexPosition(-1, -9, 0.1)},
    {type: "stone", position: hexPosition(0, -9, 0.1)},
    {type: "unit-mill", position: hexPosition(1, -9, 0.1), dir: "SW"},
    {type: "path-corner", position: hexPosition(2, -9, 0.2), dir: "NW"},


    {type: "dirt", position: hexPosition(6, -9, 0.4)},
    {type: "dirt", position: hexPosition(6, -9, 0.3)},

    {type: "dirt", position: hexPosition(7, -9, 0.3)},
    {type: 'path-corner', position: hexPosition(8, -9, 0.2)},

    {type: "grass", position: hexPosition(-1, -10, 0.2)},
    {type: "building-walls", position: hexPosition(-1, -10, 0.3)},
    {type: "stone", position: hexPosition(0, -10, 0.2)},
    {type: "stone", position: hexPosition(1, -10, 0.1)},
    {type: "path-intersectionG", position: hexPosition(2, -10, 0.2)},
    {type: "path-corner", position: hexPosition(3, -10, 0.2), dir: "N"},


    {type: "building-cabin", position: hexPosition(6, -10, 0.4), dir: "SW"},
    {type: "dirt", position: hexPosition(6, -10, 0.4)},
    {type: "dirt", position: hexPosition(6, -10, 0.3)},

    {type: "building-mine", position: hexPosition(7, -10, 0.4), dir: "NW"},
    {type: "dirt", position: hexPosition(7, -10, 0.4)},
    {type: "dirt", position: hexPosition(7, -10, 0.3)},

    {type: "dirt-lumber", position: hexPosition(8, -10, 0.6)},
    {type: "dirt", position: hexPosition(8, -10, 0.5)},
    {type: "dirt", position: hexPosition(8, -10, 0.4)},
    {type: "dirt", position: hexPosition(8, -10, 0.3)},

    {type: 'path-square-end', position: hexPosition(9, -10, 0.2), dir: "NW"},


    {type: "stone-hill", position: hexPosition(9, -11, 0.6)},
    {type: "dirt", position: hexPosition(9, -11, 0.5)},
    {type: "dirt", position: hexPosition(9, -11, 0.4)},
    {type: "dirt", position: hexPosition(9, -11, 0.3)},

    {type: "stone-mountain", position: hexPosition(8, -11, 0.8)},
    {type: "dirt", position: hexPosition(8, -11, 0.7)},
    {type: "dirt", position: hexPosition(8, -11, 0.6)},
    {type: "dirt", position: hexPosition(8, -11, 0.5)},
    {type: "dirt", position: hexPosition(8, -11, 0.4)},
    {type: "dirt", position: hexPosition(8, -11, 0.3)},


    {type: "stone-rocks", position: hexPosition(7, -11, 0.8)},
    {type: "dirt", position: hexPosition(7, -11, 0.7)},
    {type: "dirt", position: hexPosition(7, -11, 0.6)},
    {type: "dirt", position: hexPosition(7, -11, 0.5)},
    {type: "dirt", position: hexPosition(7, -11, 0.4)},
    {type: "dirt", position: hexPosition(7, -11, 0.3)},


    {type: "unit-mansion", position: hexPosition(4, -11, 0.2), dir: "NW"},
    {type: "unit-mansion", position: hexPosition(3, -11, 0.2), dir: "W"},
    {type: "unit-tower", position: hexPosition(2, -11, 0.2)},
    {type: "grass", position: hexPosition(1, -11, 0.2)},
    {type: "building-walls", position: hexPosition(1, -11, 0.3)},
    {type: 'sand', position: hexPosition(0, -11, 0.2)},
    {type: 'building-castle', position: hexPosition(0, -11, 0.4), dir: "SW"},


];


function loadModel(type) {
    const objUrl = `/assets/hexagon-kit/Models/OBJ/${type}.obj`;
    const mtlUrl = `/assets/hexagon-kit/Models/OBJ/${type}.mtl`;

    return new Promise((resolve, reject) => {
        if (northBuildingModelCache[type]) {
            resolve(northBuildingModelCache[type].clone(true));
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
                northBuildingModelCache[type] = obj;
                resolve(obj.clone(true));
            }), undefined, reject)
        })
    })
};

export async function loadNorthBuildingModels(scene) {

    for (const item of NorthBuildingLayOut2) {
        const object = await loadModel(item.type);

        object.position.set(...item.position); // 원래 위치
        if (item.dir) {
            object.rotation.y = getRotation(item.dir);
        }
        scene.add(object);
    }

}