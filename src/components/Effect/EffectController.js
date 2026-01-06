import RainEffect from "./RainEffect.js";
import SnowEffect from "./SnowEffect.js";
import FogEffect from "./FogEffect.js";
import DefaultEffect from "./DefaultEffect.js";
import {applySnowTexture, restoreOriginalTexture} from "../Texture/textureManager.jsx";
import {gsap} from "gsap";

export const WeatherTypes = {
    DEFAULT: 'default',
    RAIN: 'rain',
    SNOW: 'snow',
    FOG: 'fog',
};

export class WeatherController {
    constructor(scene) {
        this.scene = scene;
        this.currentEffect = null;
        this.currentWeatherType = WeatherTypes.DEFAULT;
        this.textureChangeTimeout = null;
        this.effectRemovalTimeout = null;
    }

    setWeather(type) {

        if (this.textureChangeTimeout) {
            clearTimeout(this.textureChangeTimeout);
            this.textureChangeTimeout = null;
        }

        if (this.currentWeatherType === WeatherTypes.SNOW && type !== WeatherTypes.SNOW) {
            this.textureChangeTimeout = setTimeout(() => {
                restoreOriginalTexture();
                this.textureChangeTimeout = null;
            }, 4000);
        }

        this.fadeOutCurrentEffect();

        this.currentWeatherType = type;

        switch (type) {
            case WeatherTypes.DEFAULT:
                this.currentEffect = new DefaultEffect(this.scene);
                break;
            case WeatherTypes.RAIN:
                this.currentEffect = new RainEffect(this.scene, 1200);
                break;
            case WeatherTypes.SNOW:
                this.currentEffect = new SnowEffect(this.scene, 800);
                this.textureChangeTimeout = setTimeout(() => {
                    applySnowTexture();
                    this.textureChangeTimeout = null;
                }, 6500);
                break;
            case WeatherTypes.FOG:
                this.currentEffect = new FogEffect(this.scene);
                break;
        }
    }

    update(deltaTime) {
        if (this.currentEffect?.update) {
            this.currentEffect.update(deltaTime);
        }
    }

    fadeOutCurrentEffect() {
        if (!this.currentEffect) return;

        const effectToRemove = this.currentEffect;
        this.currentEffect = null;

        if (this.effectRemovalTimeout) {
            clearTimeout(this.effectRemovalTimeout);
            this.effectRemovalTimeout = null;
        }

        if (effectToRemove.mesh && effectToRemove.mesh.material) {

            gsap.to(effectToRemove.mesh.material, {
                duration: 2,
                opacity: 0,
                ease: "power2.out",
                onUpdate: () => {
                    effectToRemove.mesh.material.transparent = true;
                    effectToRemove.mesh.material.needsUpdate = true;
                },
                onComplete: () => {
                    this.scene.remove(effectToRemove.mesh);
                    if (effectToRemove.dispose) {
                        effectToRemove.dispose();
                    }
                    }
            });
        } else {
            if (effectToRemove.mesh) {
                this.scene.remove(effectToRemove.mesh);
            }
            if (effectToRemove.dispose) {
                effectToRemove.dispose();
            }
        }

        if (this.scene.fog) {
            gsap.to(this.scene.fog, {
                duration: 2,
                density: 0,
                ease: "power2.out",
                onComplete: () => {
                    this.scene.fog = null;
                }
            });
        }
    }
}