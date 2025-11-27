import './App.css'
import MainScene, {changeWeather} from "./components/MainScene.js";
import SelectEffect from "./components/UI/SelectEffect.jsx";

function App() {

    return (
        <>
            <MainScene/>
            <SelectEffect onWeatherChange={changeWeather}/>
        </>
    )
}

export default App
