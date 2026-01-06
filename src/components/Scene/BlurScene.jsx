import * as THREE from "three";
import {gsap} from "gsap";

let regionGroups = {
    desert: [],
    sea: [],
    prairie: [],
    none: [],
};

let sceneRef = null;

function categorizeObjects(scene) {
    sceneRef = scene;

    let _totalObjects = 0;

    scene.traverse((object) => {
        if (object.isMesh) {
            _totalObjects++;

            if (object.userData.region) {
                const region = object.userData.region;
                if (regionGroups[region]) {
                    regionGroups[region].push(object);
                }
            }
        }
    });
}

function setRegionVisibility(selectedRegion, duration) {
    if (!sceneRef) return;

    Object.keys(regionGroups).forEach(region => {
        const enableFog = (region !== selectedRegion);

        regionGroups[region].forEach(object => {
            if (object.material) {
                const materials = Array.isArray(object.material) ? object.material : [object.material];

                materials.forEach(material => {
                    material.fog = enableFog;
                    material.needsUpdate = true;
                });
            }
        });
    });

    if (!sceneRef.fog || !(sceneRef.fog instanceof THREE.FogExp2)) {
        sceneRef.fog = new THREE.FogExp2(0x888888, 0);
    } else {
        sceneRef.fog.density = 0;
    }

    gsap.to(sceneRef.fog, {
        duration: duration,
        density: 0.03,
        ease: "power2.inOut",
    });
}

function resetRegionVisibility(duration) {
    if (!sceneRef) return;

    if (sceneRef.fog) {
        gsap.to(sceneRef.fog, {
            duration: duration,
            density: 0,
            ease: "power2.inOut",
            onComplete: () => {
                sceneRef.fog = null;

                Object.keys(regionGroups).forEach(region => {
                    regionGroups[region].forEach(object => {
                        if (object.material) {
                            const materials = Array.isArray(object.material) ? object.material : [object.material];

                            materials.forEach(material => {
                                material.fog = true;
                                material.needsUpdate = true;
                            });
                        }
                    });
                });
            }
        });
    }
}

export {categorizeObjects, setRegionVisibility, resetRegionVisibility}