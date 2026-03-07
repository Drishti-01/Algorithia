import Phaser from "phaser";
import { DataCityScene } from "./DataCityScene";
import { LinkedListScene } from "./districts/LinkedListScene";
import { StackScene } from "./districts/StackScene";
import { QueueScene } from "./districts/QueueScene";

const DISTRICT_REGISTRY = {
    array: DataCityScene,
    linkedlist: LinkedListScene,
    stack: StackScene,
    queue: QueueScene,
};
const GAME_WIDTH = 1000;
const GAME_HEIGHT = 500;

export function createDataCityGame(container, { district = "array", initialArray = [], linkedListData = null, stackData = null, queueData = null } = {}) {
    const SceneClass = DISTRICT_REGISTRY[district];

    if (!SceneClass) {
        throw new Error(`Unknown district '${district}'.`);
    }

    let scene;
    if (district === "linkedlist") {
        scene = new SceneClass({
            key: `${district}-district`,
            initialData: linkedListData || { values: [], next: [], listType: "singly" },
        });
    } else if (district === "stack") {
        scene = new SceneClass({
            key: `${district}-district`,
            initialData: stackData || { values: [], maxSize: 10 },
        });
    } else if (district === "queue") {
        scene = new SceneClass({
            key: `${district}-district`,
            initialData: queueData || { values: [], maxSize: 10 },
        });
    } else {
        scene = new SceneClass({
            key: `${district}-district`,
            initialArray,
        });
    }

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
