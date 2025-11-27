import RainEffect from "./RainEffect.js";
import SnowEffect from "./SnowEffect.js";
import FogEffect from "./FogEffect.js";
import DefaultEffect from "./DefaultEffect.js";

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
    }

    setWeather(type) {
        this.clearWeather();

        switch (type) {
            case WeatherTypes.DEFAULT:
                this.currentEffect = new DefaultEffect(this.scene);
                break;
            case WeatherTypes.RAIN:
                this.currentEffect = new RainEffect(this.scene, 1200);
                break;
            case WeatherTypes.SNOW:
                this.currentEffect = new SnowEffect(this.scene, 800);
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

    clearWeather() {
        if (this.currentEffect) {
            if (this.currentEffect.mesh) {
                this.scene.remove(this.currentEffect.mesh);
            }
            if (this.currentEffect.dispose) {
                this.currentEffect.dispose();
            }
            this.currentEffect = null;
        }

        // Fog 효과도 명확히 제거
        this.scene.fog = null;
    }
}