import {useState, useEffect} from 'react';
import {gsap} from 'gsap';
import './LoadingScreen.css';

export default function LoadingScreen({progress, onComplete}) {
    const [isButtonActive, setIsButtonActive] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        // Progress가 100%에 도달하면 버튼 활성화
        if (progress >= 100) {
            setIsButtonActive(true);
        }
    }, [progress]);

    const handleEnterScene = () => {
        if (!isButtonActive || isFadingOut) return;

        setIsFadingOut(true);

        // GSAP을 사용한 Fade-out 애니메이션
        const timeline = gsap.timeline({
            onComplete: () => {
                onComplete(); // 부모 컴포넌트에 완료 알림
            }
        });

        timeline
            .to('.loading-screen', {
                opacity: 0,
                duration: 1.5,
                ease: 'power2.inOut'
            });
    };

    return (
        <div className="loading-screen">
            <div className="loading-content">
                {/* 프로젝트 소개 */}
                <div className="project-intro">
                    <h1>Lowpoly World</h1>
                    <p>로우폴리 스타일의 3D 세계를 탐험해보세요</p>
                    <p className="subtitle">날씨를 바꾸고, 시간대를 조절하며 다양한 풍경을 감상할 수 있습니다</p>
                </div>

                {/* Progress Bar */}
                <div className="progress-container">
                    <div className="progress-bar-wrapper">
                        <div
                            className="progress-bar-fill"
                            style={{width: `${progress}%`}}
                        />
                    </div>
                    <div className="progress-text">
                        {progress < 100 ? `로딩 중... ${Math.floor(progress)}%` : '로딩 완료!'}
                    </div>
                </div>

                {/* 버튼 */}
                <button
                    className={`enter-button ${isButtonActive ? 'active' : 'disabled'}`}
                    onClick={handleEnterScene}
                    disabled={!isButtonActive || isFadingOut}
                >
                    {isFadingOut ? '입장 중...' : '세계로 들어가기'}
                </button>
            </div>
        </div>
    );
}