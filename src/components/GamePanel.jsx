import { useEffect, useRef } from "react";
import { createDataCityGame } from "../game/createDataCityGame";

export function GamePanel({ initialArray }) {
    const containerRef = useRef(null);
    const gameRef = useRef(null);
    const sceneRef = useRef(null);
    const initialArrayRef = useRef(initialArray);

    useEffect(() => {
        if (!containerRef.current) {
            return undefined;
        }

        const { game, scene } = createDataCityGame(containerRef.current, {
            district: "array",
            initialArray: initialArrayRef.current,
        });
        gameRef.current = game;
        sceneRef.current = scene;

        return () => {
            gameRef.current?.destroy(true);
            gameRef.current = null;
            sceneRef.current = null;
        };
    }, []);

    return <div ref={containerRef} className="game-canvas-host" />;
}
