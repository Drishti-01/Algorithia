import { useEffect, useRef } from "react";
import { createDataCityGame } from "../game/createDataCityGame";

export function GamePanel({ initialArray, linkedListData, stackData, queueData, district = "array" }) {
    const containerRef = useRef(null);
    const gameRef = useRef(null);
    const sceneRef = useRef(null);
    const initialArrayRef = useRef(initialArray);
    const linkedListDataRef = useRef(linkedListData);
    const stackDataRef = useRef(stackData);
    const queueDataRef = useRef(queueData);

    useEffect(() => {
        if (!containerRef.current) {
            return undefined;
        }

        const { game, scene } = createDataCityGame(containerRef.current, {
            district,
            initialArray: initialArrayRef.current,
            linkedListData: linkedListDataRef.current,
            stackData: stackDataRef.current,
            queueData: queueDataRef.current,
        });
        gameRef.current = game;
        sceneRef.current = scene;

        return () => {
            gameRef.current?.destroy(true);
            gameRef.current = null;
            sceneRef.current = null;
        };
    }, [district]);

    return <div ref={containerRef} className="game-canvas-host" />;
}
