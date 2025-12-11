import React, {useState} from 'react';
import {LightTypes} from "../Light/LightController.jsx";
import {MdModeNight, MdSunny} from "react-icons/md";

export default function SelectTime({onChange}) {
    const [isNight, setIsNight] = useState(false);

    const handleToggle = () => {
        const next = !isNight;

        setIsNight(next);
        onChange(next ? LightTypes.NIGHT : LightTypes.SUN);
    }

    return (
        <div className="time-select">
            <button onClick={handleToggle}>
                {isNight ? (<MdModeNight/>) : (<MdSunny/>)}
            </button>
        </div>
    );
}
