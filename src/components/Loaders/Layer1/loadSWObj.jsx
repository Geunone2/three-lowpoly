import {createObjLoader} from "../../../utils/ObjLoader.js";
import groundLayout from "../maps/southWest/Ground.json";
import {getRotation, hexPosition} from "../../../utils/hex.js";

export const swModelCache = {};

const resolvedLayout = groundLayout.map(item => ({
    ...item,
    position: hexPosition(item.q, item.r, item.y ?? 0),
}))

export async function loadSWModels(scene, manager) {

    const loadModel = createObjLoader({
        manager,
        cache: swModelCache,
    })

    const uniqueTypes = [...new Set(resolvedLayout.map(item => item.type))];

    await Promise.all(uniqueTypes.map(type => loadModel(type)));

    for (const item of resolvedLayout) {
        const original = swModelCache[item.type];
        if (!original) continue;

        const object = original.clone(true); // deep clone 권장

        object.position.set(...item.position);

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