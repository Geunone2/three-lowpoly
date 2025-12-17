import React, {useState} from 'react';
import {LightTypes} from "../Light/LightController.jsx";
import {MdModeNight, MdSunny} from "react-icons/md";

export default function SelectTime({onChange}) {
    const [isNight, setIsNight] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = (timeType) => {
        const nextIsNight = timeType === 'night';
        setIsNight(nextIsNight);
        onChange(nextIsNight ? LightTypes.NIGHT : LightTypes.SUN);
        setIsOpen(false); // 선택 후 닫기
    }

    const timeOptions = [
        { type: 'day', icon: "☀️", label: '낮' },
        { type: 'night', icon: "🌙", label: '밤' }
    ];

    const activeOption = timeOptions.find(opt =>
        (opt.type === 'night' && isNight) || (opt.type === 'day' && !isNight)
    );

    return (
        <div className="time-select-container">
            <button
                className="time-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="시간대 메뉴 열기"
            >
                <span className="toggle-icon">{activeOption.icon}</span>
                <span className="toggle-label">시간</span>
            </button>

            <div className={`time-options ${isOpen ? 'open' : ''}`}>
                {timeOptions.map(({ type, icon, label }) => (
                    <button
                        key={type}
                        onClick={() => handleToggle(type)}
                        className={`time-option ${
                            (type === 'night' && isNight) || (type === 'day' && !isNight)
                                ? 'active'
                                : ''
                        } ${type}`}
                        title={label}
                    >
                        <span className="option-icon">{icon}</span>
                        <span className="option-label">{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}