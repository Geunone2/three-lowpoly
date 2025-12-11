import './App.css'
import MainScene, {changeTime, changeWeather} from "./components/MainScene.js";
import SelectEffect from "./components/UI/SelectEffect.jsx";
import SelectTime from "./components/UI/SelectTime.jsx";

function App() {
    return (
        <>
            <MainScene/>
            <SelectEffect onWeatherChange={changeWeather}/>
            <SelectTime onChange={(type) => changeTime(type)}/>
        </>
    )

}

export default App
