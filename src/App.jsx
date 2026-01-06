import './App.css'
import MainScene, {backToMainCamera, changeTime, changeWeather} from "./components/MainScene.js";
import SelectEffect from "./components/UI/SelectEffect.jsx";
import SelectTime from "./components/UI/SelectTime.jsx";
import {useCallback, useEffect, useState} from "react";
import LoadingScreen from "./components/UI/LoadingScreen.jsx";
import CameraDescription from "./components/UI/CameraDescription.jsx";
import BackButton from "./components/UI/BackButton.jsx";

function App() {

    const [progress, setProgress] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [currentCamera, setCurrentCamera] = useState("default");

    const handleCameraChange = useCallback((cameraType) => {
        setCurrentCamera(cameraType);
    }, []);

    const handleBackToMain = () => {
        backToMainCamera();
        setCurrentCamera("default");
    }

    useEffect(() => {
        MainScene({
            onProgress: setProgress,
            onLoaded: () => setProgress(100),
            onCameraChange: handleCameraChange
        })
    }, [handleCameraChange]);

    return (
        <>
            {!isReady && (
                <LoadingScreen
                    progress={progress}
                    onComplete={() => setIsReady(true)}/>
            )}

            <div className={`ui-controls ${isReady ? 'visible' : ''}`}>
                <SelectEffect onWeatherChange={changeWeather}/>
                <SelectTime onChange={(type) => changeTime(type)}/>
            </div>

            {isReady && (
                <>
                    <CameraDescription cameraType={currentCamera}/>
                    <BackButton show={currentCamera !== "default"} onClick={handleBackToMain}/>
                </>
            )}
        </>
    )

}

export default App
