import {MTLLoader} from "three/addons/loaders/MTLLoader.js";
import {OBJLoader} from "three/addons/loaders/OBJLoader.js";

export function createObjLoader({
                                    manager, cache, basePath = `/assets/hexagon-kit/Models/OBJ`,
                                }) {
    return function loadModel(type) {
        const objUrl = `${basePath}/${type}.obj`;
        const mtlUrl = `${basePath}/${type}.mtl`;

        return new Promise((resolve, reject) => {
            if (cache[type]) {
                resolve(cache[type].clone(true));
                return;
            }

            if (cache[`${type}_loading`]) {
                cache[`${type}_loading`].then(() => {
                    resolve(cache[type].clone(true));
                }).catch(reject);
                return;
            }

            const loadingPromise = new Promise((res, rej) => {
                const mtlLoader = new MTLLoader(manager);
                mtlLoader.load(
                    mtlUrl, (materials) => {
                        materials.preload();

                        const objLoader = new OBJLoader(manager);
                        objLoader.setMaterials(materials);

                        objLoader.load(
                            objUrl, (obj) => {
                                obj.traverse(child => {
                                    child.userData.type = type;
                                });

                                cache[type] = obj;
                                delete cache[`${type}_loading`];                                res(obj.clone(true));
                            },
                            undefined,
                            (error) => {
                                delete cache[`${type}_loading`];
                                rej(error);
                            }
                        );
                    },
                    undefined,
                    (error) => {
                        delete cache[`${type}_loading`];
                        rej(error);
                    }
                )
            });

            cache[`${type}_loading`] = loadingPromise;
            loadingPromise.then(resolve).catch(reject);
        })
    }
}