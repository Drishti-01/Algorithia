import { useEffect, useRef } from "react";
import { createDataCityGame } from "../game/createDataCityGame";

export function DataCityGamePanel({ initialArray }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) {
            return undefined;
        }

        const { game } = createDataCityGame(containerRef.current, {
            district: "array",
            initialArray,
        });

        return () => {
            game.destroy(true);
        };
    }, [initialArray]);

    return <div ref={containerRef} className="game-canvas-host" />;
}