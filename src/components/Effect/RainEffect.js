import * as THREE from 'three';

export default class RainEffect {
    constructor(scene, count = 500) {
        this.scene = scene;
        this.count = count;
        this.dummy = new THREE.Object3D();

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
                speed: Math.random() * 0.1 + 0.03,
            });
        }
    }

    createInstancedMesh() {
        const geometry = new THREE.CylinderGeometry(0.01, 0.01, 0.5, 8);
        const material = new THREE.MeshBasicMaterial({
            color: 0x87CEEB,
            transparent: true,
            opacity: 0.6,
        });

        this.mesh = new THREE.InstancedMesh(geometry, material, this.count);
        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.scene.add(this.mesh);
    }

    update() {
        this.particles.forEach((p, i) => {
            p.y -= p.speed;
            if (p.y < 0) p.y = 20;

            this.dummy.position.set(p.x, p.y, p.z);
            this.dummy.updateMatrix();

            this.mesh.setMatrixAt(i, this.dummy.matrix);
        });

        this.mesh.instanceMatrix.needsUpdate = true;
    }

    dispose() {
        if (this.mesh) {
            this.scene.remove(this.mesh);
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
            this.mesh = null;
        }
    }
}
