import {MTLLoader} from "three/addons/loaders/MTLLoader.js";
import {OBJLoader} from "three/addons/loaders/OBJLoader.js";

export function createObjLoader({
                                    manager, cache, basePath = `/assets/hexagon-kit/Models/OBJ`,
                                }) {
    return function loadModel(type) {
        const objUrl = `${basePath}/${type}.obj`;
        const mtlUrl = `${basePath}/${type}.mtl`;

        return new Promise((resolve, reject) => {
            // ✅ 캐시에 있으면 즉시 복사본 반환 (네트워크 요청 없음)
            if (cache[type]) {
                resolve(cache[type].clone(true));
                return;
            }

            // ⚠️ 이미 로딩 중이면 같은 Promise 재사용 (중복 요청 방지)
            if (cache[`${type}_loading`]) {
                cache[`${type}_loading`].then(() => {
                    resolve(cache[type].clone(true));
                }).catch(reject);
                return;
            }

            // 🔄 새로운 로딩 시작
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
                                delete cache[`${type}_loading`]; // 로딩 완료, 플래그 제거
                                res(obj.clone(true));
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