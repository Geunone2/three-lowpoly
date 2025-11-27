import React from "react";

export default function SelectEffect({onWeatherChange}) {
    return (
        <div className="weather-select">
            <button onClick={() => onWeatherChange('default')}>☀️</button>
            <button onClick={() => onWeatherChange('rain')}>🌧️</button>
            <button onClick={() => onWeatherChange('snow')}>❄️</button>
            <button onClick={() => onWeatherChange('fog')}>🌫️</button>
        </div>
    );
}
