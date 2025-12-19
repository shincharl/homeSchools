import { useEffect, useRef, useState } from "react";
import Styles from "../css/FullscreenWrapper.module.css"

interface FullscreenWrapperProps {
    children: React.ReactNode;
}

const FullscreenWrapper = ({children}: FullscreenWrapperProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        const el = containerRef.current;
        if (!el) return;

        if(!document.fullscreenElement) {
            if(el.requestFullscreen) el.requestFullscreen();
            else if ((el as any).webkitRequestFullscreen) (el as any).webkitRequestFullscreen();
            else if ((el as any).msRequestFullscreen) (el as any).msRequestFullscreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
            else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen();
            else if ((document as any).msExitFullscreen) (document as any).msExitFullscreen();
        }
    };

    useEffect(() => {
        const onChange = () => {
            setIsFullscreen(Boolean(document.fullscreenElement));
        };

        document.addEventListener("fullscreenchange", onChange);
        return () => document.removeEventListener("fullscreenchange", onChange);
    }, []);

    return (
        <div ref={containerRef} className={Styles.wrapper}>
            {!isFullscreen && (
                <button onClick={toggleFullscreen} className={Styles.fullscreenBtn}>
                    전체화면
                </button>
            )}
            {children}
        </div>
    );
}

export default FullscreenWrapper;