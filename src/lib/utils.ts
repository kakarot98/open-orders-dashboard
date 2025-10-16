import { useEffect, useState } from "react";

export function useBreakpoint() {
    const [w, setW] = useState<number>(1024)

    useEffect(() => {
        const getWidth = () => setW(window.innerWidth)
        getWidth()
        window.addEventListener("resize", getWidth)
        return () => window.removeEventListener("resize", getWidth)
    }, [])

    return {
        isSm: w < 640,
        isMd: w >= 640 && w < 1024,
        isLg: w >= 1024
    }
}