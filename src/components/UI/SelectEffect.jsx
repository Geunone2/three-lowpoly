import React, {useState} from "react";

export default function SelectEffect({onWeatherChange}) {
    const [activeWeather, setActiveWeather] = useState('default');
    const [isOpen, setIsOpen] = useState(false);

    const handleWeatherChange = (type) => {
        setActiveWeather(type);
        onWeatherChange(type);
        setIsOpen(false);
    };

    const weatherOptions = [
        {type: 'default', emoji: '🌈', label: '맑음'},
        {type: 'rain', emoji: '☔️', label: '비'},
        {type: 'snow', emoji: '☃️', label: '눈'},
        {type: 'fog', emoji: '☁️', label: '안개'}
    ];

    const activeOption = weatherOptions.find(opt => opt.type === activeWeather);

    return (
        <div className="weather-select-container">
            <button
                className="weather-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="날씨 메뉴 열기"
            >
                <span className="toggle-icon">{activeOption.emoji}</span>
                <span className="toggle-label">날씨</span>
            </button>

            <div className={`weather-options ${isOpen ? 'open' : ''}`}>
                {weatherOptions.map(({type, emoji, label}) => (
                    <button
                        key={type}
                        onClick={() => handleWeatherChange(type)}
                        className={`weather-option ${activeWeather === type ? 'active' : ''}`}
                        title={label}
                    >
                        <span className="option-emoji">{emoji}</span>
                        <span className="option-label">{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}