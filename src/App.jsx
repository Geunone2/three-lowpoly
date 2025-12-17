import './App.css'
import MainScene, {changeTime, changeWeather} from "./components/MainScene.js";
import SelectEffect from "./components/UI/SelectEffect.jsx";
import SelectTime from "./components/UI/SelectTime.jsx";
import {useState} from "react";
import LoadingScreen from "./components/UI/LoadingScreen.jsx";

function App() {

    const [progress, setProgress] = useState(0);
    const [isReady, setIsReady] = useState(false);

    return (
        <>
            {!isReady && (
                <LoadingScreen
                    progress={progress}
                    onComplete={() => setIsReady(true)}/>
            )}

            <MainScene onProgress={setProgress} onLoaded={() => setProgress(100)}/>

            <div className={`ui-controls ${isReady ? 'visible' : ''}`}>
                <SelectEffect onWeatherChange={changeWeather}/>
                <SelectTime onChange={(type) => changeTime(type)}/>
            </div>
        </>
    )

}

export default App
