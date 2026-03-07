import Phaser from "phaser";
import { DataCityScene } from "./DataCityScene";

const DISTRICT_REGISTRY = {
    array: DataCityScene,
};
const GAME_WIDTH = 1000;
const GAME_HEIGHT = 500;

export function createDataCityGame(container, { district = "array", initialArray = [] } = {}) {
    const SceneClass = DISTRICT_REGISTRY[district];

    if (!SceneClass) {
        throw new Error(`Unknown district '${district}'.`);
    }

    const scene = new SceneClass({
        key: `${district}-district`,
        initialArray,
    });

    const game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: container,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        backgroundColor: "#08111f",
        render: {
            antialias: true,
        },
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        scene: [scene],
    });

    return {
        game,
        scene,
    };
}
