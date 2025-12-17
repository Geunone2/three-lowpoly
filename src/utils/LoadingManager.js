import * as THREE from "three";

export function LoadingManager({onProgress, onLoad, onError}) {

    const manager = new THREE.LoadingManager();

    manager.onStart = (_, loaded, total) => {
        if (total > 0) {
            onProgress?.((loaded / total) * 100);
        }
    };

    manager.onProgress = (_, loaded, total) => {
        if (total > 0) {
            const progress = Math.min((loaded / total) * 100, 99);
            onProgress?.(progress);
        }
    };

    manager.onLoad = () => {
        requestAnimationFrame(() => {
            onProgress?.(100);
            onLoad?.();
        });
    };

    manager.onError = (url) => {
        console.error('[Loading Manager] failed to load:', url);
        onError?.(url);
    };

    return manager;
}