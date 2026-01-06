import React from 'react';
import './BackButton.css';
import { IoArrowBack } from 'react-icons/io5';

export default function BackButton({ onClick, show = false }) {
    if (!show) return null;

    return (
        <button 
            className="back-button"
            onClick={onClick}
            aria-label="메인 카메라로 돌아가기"
        >
            <IoArrowBack className="back-icon" />
            <span>돌아가기</span>
        </button>
    );
}
