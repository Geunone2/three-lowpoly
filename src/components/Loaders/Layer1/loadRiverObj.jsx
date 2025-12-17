import {createObjLoader} from "../../../utils/ObjLoader.js";
import riverLayout from "../maps/main/River.json";
import {getRotation, hexPosition} from "../../../utils/hex.js";

export const riverModelCache = {};

const resolvedLayout = riverLayout.map(item => ({
    ...item,
    position: hexPosition(item.q, item.r, item.y ?? 0),
}))

export async function loadRiverModels(scene, manager) {

    const loadModel = createObjLoader({
        manager,
        cache: riverModelCache,
    })

    const uniqueTypes = [...new Set(resolvedLayout.map(item => item.type))];

    await Promise.all(uniqueTypes.map(type => loadModel(type)));

    for (const item of resolvedLayout) {
        const original = riverModelCache[item.type];
        if (!original) continue;

        const object = original.clone(true); // deep clone 권장

        object.position.set(...item.position);

        if (item.dir) {
            object.rotation.y = getRotation(item.dir);
        }

        object.traverse(child => {
            if (child.isMesh) {
                child.userData.region = "none";
            }
        });

        scene.add(object);
    }
}