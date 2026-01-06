import {createObjLoader} from "../../../utils/ObjLoader.js";
import buildingLayout from "../maps/southWest/Building.json";
import {getRotation, hexPosition} from "../../../utils/hex.js";

export const swBuildingModelCache = {};

const resolvedLayout = buildingLayout.map(item => ({
    ...item,
    position: hexPosition(item.q, item.r, item.y ?? 0),
}))

export async function loadSWBuildingModels(scene, manager) {

    const loadModel = createObjLoader({
        manager,
        cache: swBuildingModelCache,
    })

    const uniqueTypes = [...new Set(resolvedLayout.map(item => item.type))];

    await Promise.all(uniqueTypes.map(type => loadModel(type)));

    for (const item of resolvedLayout) {
        const original = swBuildingModelCache[item.type];
        if (!original) continue;

        const object = original.clone(true);

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