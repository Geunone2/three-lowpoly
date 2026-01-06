import * as THREE from "three";
import gsap from "gsap";

let sceneRef = null;
let originalTextures = new Map();
let alternativeTexture = null;

const textureLoader = new THREE.TextureLoader();

function initTextureManager(scene) {
    sceneRef = scene;

    alternativeTexture = textureLoader.load('/assets/hexagon-kit/Models/OBJ/Textures/colormap2.png');
    alternativeTexture.colorSpace = THREE.SRGBColorSpace;

    saveOriginalTextures();
}

function saveOriginalTextures() {
    if (!sceneRef) return;

    sceneRef.traverse((object) => {
        if (object.isMesh && object.material) {
            const materials = Array.isArray(object.material) ? object.material : [object.material];

            materials.forEach((material, index) => {
                if (material.map && !originalTextures.has(material.uuid)) {
                    originalTextures.set(material.uuid, {
                        texture: material.map.clone(),
                        material: material,
                        index: index
                    });
                }
            })
        }
    })
}

function applySnowTexture() {
    if (!sceneRef || !alternativeTexture) return;

    sceneRef.traverse((object) => {
        if (object.isMesh && object.material && !object.userData.isWeatherEffect) {
            const materials = Array.isArray(object.material) ? object.material : [object.material];

            materials.forEach((material) => {
                if (material.map) {
                    gsap.to(material, {
                        duration: 0.5,
                        opacity: 0,
                        onComplete: () => {
                            material.map = alternativeTexture;
                            material.needsUpdate = true;
                            gsap.to(material, {
                                duration: 0.5,
                                opacity: 1
                            });
                        }
                    });
                }
            });
        }
    });
}

function restoreOriginalTexture() {
    if (!sceneRef) return;

    originalTextures.forEach((data) => {
        const {material, texture} = data;
        if (material && texture) {
            material.map = texture;
            material.needsUpdate = true;
        }
    });
}

export {initTextureManager, applySnowTexture, restoreOriginalTexture}