import * as THREE from 'three';

export default class SnowEffect {
    constructor(scene, count = 800) {
        this.scene = scene;
        this.count = count;
        this.dummy = new THREE.Object3D();
        this.clock = new THREE.Clock();

        this.particles = [];
        this.createParticles();
        this.createInstancedMesh();
    }

    createParticles() {
        for (let i = 0; i < this.count; i++) {
            this.particles.push({
                x: (Math.random() - 0.5) * 20,
                y: Math.random() * 20 + 10,
                z: (Math.random() - 0.5) * 20,
                speed: Math.random() * 0.03 + 0.01,
                drift: Math.random() * 0.02 + 0.005,
            });
        }
    }

    createInstancedMesh() {
        const geometry = new THREE.SphereGeometry(0.05, 6, 6); // 또는 CylinderGeometry(0.03, 0.03, 0.2)
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
        });

        this.mesh = new THREE.InstancedMesh(geometry, material, this.count);
        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.scene.add(this.mesh);
    }

    update() {
        const elapsedTime = this.clock.getElapsedTime();

        this.particles.forEach((p, i) => {
            p.y -= p.speed;
            p.x += Math.sin(elapsedTime + i) * p.drift;

            if (p.y < -1) {
                p.y = 20;
                p.x = (Math.random() - 0.5) * 20;
            }

            this.dummy.position.set(p.x, p.y, p.z);
            this.dummy.rotation.x = elapsedTime * 2;
            this.dummy.rotation.y = elapsedTime * 3;
            this.dummy.updateMatrix();

            this.mesh.setMatrixAt(i, this.dummy.matrix);
        });

        this.mesh.instanceMatrix.needsUpdate = true;
    }

    dispose() {
        if (this.mesh) {
            this.scene.remove(this.mesh);       // 씬에서 제거
            this.mesh.geometry.dispose();       // GPU Geometry 해제
            this.mesh.material.dispose();       // Material 해제
            this.mesh = null;
        }
    }

}
