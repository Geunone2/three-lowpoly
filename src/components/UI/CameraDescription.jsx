import React, {useState} from 'react';
import './CameraDescription.css';
import {IoChevronUp, IoChevronDown} from 'react-icons/io5';

const cameraDescriptions = {
    default: {
        title: "🏝️ Low Poly Island",
        description: "Three.js로 구현한 로우폴리 스타일의 인터랙티브 3D 섬입니다. 바다, 사막, 초원 세 가지 지역을 클릭하여 탐험해보세요.",
        details: [
            "날씨와 시간대를 변경하여 다양한 분위기를 경험할 수 있습니다.",
            "각 지역을 클릭하면 해당 영역으로 카메라가 이동합니다."
        ],
        credits: "Reference 3D Assets: https://kenney.nl/assets/hexagon-kit"
    },
    sea: {
        title: "🌊 바다 (Sea Region)",
        description: "푸른 바다와 해안가 지역입니다. 등대, 배, 해변 오브젝트들이 배치되어 있습니다.",
        details: [
            "등대와 항구 구조물",
            "바다 위를 떠다니는 배들",
            "해안가 자연 환경"
        ]
    },
    desert: {
        title: "🏜️ 사막 (Desert Region)",
        description: "건조한 사막 지역입니다. 선인장, 바위, 사막 건물들이 특징입니다.",
        details: [
            "사막 특유의 건조한 지형",
            "선인장과 암석 구조물",
            "사막 마을과 건축물"
        ]
    },
    prairie: {
        title: "🌾 초원 (Prairie Region)",
        description: "푸른 초원과 숲 지역입니다. 나무, 풀, 자연 오브젝트들이 가득합니다.",
        details: [
            "울창한 나무와 숲",
            "초원의 풀과 꽃",
            "자연 친화적인 건축물"
        ]
    }
};

export default function CameraDescription({cameraType = 'default'}) {
    const [isOpen, setIsOpen] = useState(true);
    const info = cameraDescriptions[cameraType] || cameraDescriptions.default;

    return (
        <div className={`camera-description ${cameraType} ${isOpen ? 'open' : 'closed'}`}>
            {/* 설명 내용 */}
            <div className="description-content">
                <h2 className="description-title">{info.title}</h2>
                <p className="description-text">{info.description}</p>

                <ul className="description-details">
                    {info.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                    ))}
                </ul>

                {info.credits && (
                    <a href="https://kenney.nl/assets/hexagon-kit" target="_blank"
                       className="description-credits">{info.credits}</a>
                )}
            </div>

            {/* 토글 버튼 */}
            <button
                className="toggle-button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "설명 닫기" : "설명 열기"}
            >
                {isOpen ? <IoChevronUp/> : <IoChevronDown/>}
            </button>
        </div>
    );
}