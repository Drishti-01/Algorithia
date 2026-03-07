import Phaser from "phaser";
import { gameBridge } from "../gameBridge";
import { STEP_TYPES } from "../../simulation/stepTypes";

export class ArrayDistrictScene extends Phaser.Scene {
    constructor({ key = "array-district", initialArray = [] } = {}) {
        super({ key });
        this.initialArray = [...initialArray];
        this.arrayValues = [...initialArray];
        this.variableValues = {};

        this.slotY = 0;
        this.slotPositions = [];
        this.slotTiles = [];
        this.indexLabels = [];
        this.valueBlocks = [];

        this.bridgeUnsubscribers = [];
    }

    create() {
        this.background = this.add.graphics();
        this.titleText = this.add.text(24, 18, "Data City: Array District", {
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "18px",
            color: "#bfdbfe",
        });

        this.statusText = this.add.text(24, 46, "Line: -", {
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "14px",
            color: "#93c5fd",
        });

        this.subtitleText = this.add.text(24, 68, "Character movement is driven by execution steps.", {
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "12px",
            color: "#7dd3fc",
        });

        this.variablePanel = this.add.rectangle(0, 0, 228, 170, 0x0f172a, 0.85)
            .setStrokeStyle(2, 0x334155, 0.9)
            .setOrigin(0, 0);

        this.variableText = this.add.text(0, 0, "Variables\n(none)", {
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "13px",
            color: "#e2e8f0",
            lineSpacing: 6,
        });

        this.drawBackdrop();
        this.rebuildArrayDistrict(this.arrayValues);
        this.positionOverlay();

        this.character = this.add.circle(this.slotPositions[0] ?? 120, this.slotY - 120, 14, 0xf97316, 1)
            .setStrokeStyle(3, 0xffedd5, 0.95)
            .setDepth(20);

        this.attachBridgeHandlers();

        this.scale.on("resize", this.handleResize, this);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
        this.events.once(Phaser.Scenes.Events.DESTROY, this.cleanup, this);
    }

    cleanup() {
        this.scale.off("resize", this.handleResize, this);
        this.detachBridgeHandlers();
    }

    attachBridgeHandlers() {
        this.bridgeUnsubscribers.push(
            gameBridge.on("reset", ({ array }) => {
                this.resetDistrict(array);
            }),
        );

        this.bridgeUnsubscribers.push(
            gameBridge.on("step", ({ step }) => {
                this.playStep(step);
            }),
        );
    }

    detachBridgeHandlers() {
        while (this.bridgeUnsubscribers.length > 0) {
            const unsubscribe = this.bridgeUnsubscribers.pop();
            unsubscribe();
        }
    }

    handleResize() {
        this.drawBackdrop();
        this.rebuildArrayDistrict(this.arrayValues);
        this.positionOverlay();
    }

    drawBackdrop() {
        const width = this.scale.width;
        const height = this.scale.height;

        this.background.clear();
        this.background.fillStyle(0x020617, 1);
        this.background.fillRect(0, 0, width, height);

        this.background.fillStyle(0x0b1328, 0.65);
        this.background.fillRect(0, Math.floor(height * 0.55), width, Math.floor(height * 0.45));

        this.background.lineStyle(1, 0x1e293b, 0.65);
        for (let i = 0; i < 18; i += 1) {
            const y = Math.floor((height / 18) * i);
            this.background.lineBetween(0, y, width, y);
        }

        this.background.lineStyle(1, 0x0f172a, 0.6);
        for (let i = 0; i < 32; i += 1) {
            const x = Math.floor((width / 32) * i);
            this.background.lineBetween(x, 0, x, height);
        }

        this.background.fillStyle(0x1d4ed8, 0.1);
        this.background.fillEllipse(width * 0.5, height * 0.42, width * 0.84, height * 0.6);
    }

    positionOverlay() {
        const width = this.scale.width;
        const panelWidth = 228;
        const panelX = Math.max(20, width - panelWidth - 24);

        this.variablePanel.setPosition(panelX, 20);
        this.variableText.setPosition(panelX + 12, 32);
    }

    destroyArrayDistrict() {
        this.slotTiles.forEach((tile) => tile.destroy());
        this.indexLabels.forEach((label) => label.destroy());
        this.valueBlocks.forEach((block) => block.container.destroy());

        this.slotTiles = [];
        this.indexLabels = [];
        this.valueBlocks = [];
        this.slotPositions = [];
    }

    rebuildArrayDistrict(arrayValues) {
        this.destroyArrayDistrict();

        this.arrayValues = [...arrayValues];
        const width = this.scale.width;
        const height = this.scale.height;

        const count = Math.max(this.arrayValues.length, 1);
        const maxSpacing = 118;
        const availableWidth = Math.max(280, width - 220);
        const spacing = count === 1
            ? 0
            : Math.min(maxSpacing, availableWidth / (count - 1));

        const rowWidth = spacing * (count - 1);
        const startX = Math.floor((width - rowWidth) / 2);
        this.slotY = Math.floor(height * 0.67);

        for (let index = 0; index < this.arrayValues.length; index += 1) {
            const x = Math.floor(startX + index * spacing);
            this.slotPositions[index] = x;

            const slot = this.add.rectangle(x, this.slotY, 90, 90, 0x0f172a, 0.55)
                .setStrokeStyle(2, 0x334155, 0.95)
                .setDepth(2);
            this.slotTiles.push(slot);

            const indexLabel = this.add.text(x, this.slotY + 56, `idx:${index}`, {
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "12px",
                color: "#94a3b8",
            })
                .setOrigin(0.5, 0)
                .setDepth(2);
            this.indexLabels.push(indexLabel);

            this.valueBlocks[index] = this.createValueBlock(x, this.slotY, this.arrayValues[index]);
        }

        if (this.character) {
            this.character.setPosition(this.slotPositions[0] ?? 120, this.slotY - 120);
        }
    }

    createValueBlock(x, y, value) {
        const container = this.add.container(x, y).setDepth(6);

        const body = this.add.rectangle(0, 0, 76, 76, 0x0ea5e9, 0.9)
            .setStrokeStyle(2, 0xe0f2fe, 0.92);

        const valueText = this.add.text(0, 0, `${value}`, {
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "24px",
            color: "#0f172a",
        })
            .setOrigin(0.5)
            .setResolution(2);

        container.add([body, valueText]);

        return {
            container,
            body,
            valueText,
        };
    }

    resetDistrict(array) {
        this.tweens.killAll();
        this.variableValues = {};
        this.renderVariables();

        this.statusText.setText("Line: -");

        const nextArray = Array.isArray(array) ? array : this.initialArray;
        this.rebuildArrayDistrict(nextArray);
    }

    moveCharacterTo(index) {
        if (!this.character) {
            return;
        }

        const clampedIndex = Phaser.Math.Clamp(index, 0, Math.max(0, this.slotPositions.length - 1));
        const x = this.slotPositions[clampedIndex] ?? this.character.x;

        this.tweens.add({
            targets: this.character,
            x,
            duration: 220,
            ease: "Cubic.easeInOut",
        });
    }

    flashSlot(index, color = 0x38bdf8) {
        const slot = this.slotTiles[index];
        const block = this.valueBlocks[index];
        if (!slot || !block) {
            return;
        }

        slot.setStrokeStyle(3, color, 1);
        block.body.setFillStyle(color, 0.88);

        this.tweens.add({
            targets: block.container,
            scaleX: 1.08,
            scaleY: 1.08,
            duration: 120,
            yoyo: true,
            onComplete: () => {
                block.body.setFillStyle(0x0ea5e9, 0.9);
                slot.setStrokeStyle(2, 0x334155, 0.95);
            },
        });
    }

    animateSwap(leftIndex, rightIndex) {
        const leftBlock = this.valueBlocks[leftIndex];
        const rightBlock = this.valueBlocks[rightIndex];

        if (!leftBlock || !rightBlock) {
            return;
        }

        this.moveCharacterTo(leftIndex);
        this.flashSlot(leftIndex, 0xf97316);
        this.flashSlot(rightIndex, 0xf97316);

        const leftTargetX = this.slotPositions[rightIndex];
        const rightTargetX = this.slotPositions[leftIndex];

        this.tweens.add({
            targets: leftBlock.container,
            x: leftTargetX,
            y: this.slotY - 20,
            duration: 230,
            ease: "Sine.easeInOut",
            onComplete: () => {
                leftBlock.container.setY(this.slotY);
            },
        });

        this.tweens.add({
            targets: rightBlock.container,
            x: rightTargetX,
            y: this.slotY + 20,
            duration: 230,
            ease: "Sine.easeInOut",
            onComplete: () => {
                rightBlock.container.setY(this.slotY);
            },
        });

        this.time.delayedCall(240, () => {
            [this.valueBlocks[leftIndex], this.valueBlocks[rightIndex]] = [
                this.valueBlocks[rightIndex],
                this.valueBlocks[leftIndex],
            ];

            this.valueBlocks[leftIndex].container.setPosition(this.slotPositions[leftIndex], this.slotY);
            this.valueBlocks[rightIndex].container.setPosition(this.slotPositions[rightIndex], this.slotY);
        });
    }

    syncArrayFromState(arr) {
        if (!Array.isArray(arr)) {
            return;
        }

        if (arr.length !== this.arrayValues.length) {
            this.rebuildArrayDistrict(arr);
            return;
        }

        this.arrayValues = [...arr];
        for (let index = 0; index < arr.length; index += 1) {
            if (this.valueBlocks[index]) {
                this.valueBlocks[index].valueText.setText(`${arr[index]}`);
            }
        }
    }

    syncVariablesFromState(variables) {
        if (!variables || typeof variables !== "object") {
            return;
        }

        this.variableValues = { ...variables };
        this.renderVariables();
    }

    renderVariables() {
        const entries = Object.entries(this.variableValues)
            .sort(([left], [right]) => left.localeCompare(right));

        if (entries.length === 0) {
            this.variableText.setText("Variables\n(none)");
            return;
        }

        const body = entries.map(([name, value]) => `${name}: ${value}`).join("\n");
        this.variableText.setText(`Variables\n${body}`);
    }

    pulseVariablePanel() {
        this.tweens.add({
            targets: this.variablePanel,
            alpha: 0.7,
            duration: 100,
            yoyo: true,
        });
    }

    playStep(step) {
        if (!step) {
            return;
        }

        if (typeof step.line === "number") {
            this.statusText.setText(`Line: ${step.line}`);
        }

        switch (step.type) {
            case STEP_TYPES.VISIT:
                if (typeof step.payload.index === "number") {
                    this.moveCharacterTo(step.payload.index);
                    this.flashSlot(step.payload.index, 0x38bdf8);
                }
                break;

            case STEP_TYPES.READ_ARRAY:
                if (typeof step.payload.index === "number") {
                    this.moveCharacterTo(step.payload.index);
                    this.flashSlot(step.payload.index, 0xfacc15);
                }
                break;

            case STEP_TYPES.WRITE_ARRAY:
                if (typeof step.payload.index === "number") {
                    this.moveCharacterTo(step.payload.index);
                    this.flashSlot(step.payload.index, 0x22c55e);
                }
                break;

            case STEP_TYPES.COMPARE:
                if (typeof step.payload.leftIndex === "number") {
                    this.moveCharacterTo(step.payload.leftIndex);
                    this.flashSlot(step.payload.leftIndex, 0xf59e0b);
                }
                if (typeof step.payload.rightIndex === "number") {
                    this.flashSlot(step.payload.rightIndex, 0xf59e0b);
                }
                break;

            case STEP_TYPES.SWAP:
                if (
                    typeof step.payload.leftIndex === "number"
                    && typeof step.payload.rightIndex === "number"
                ) {
                    this.animateSwap(step.payload.leftIndex, step.payload.rightIndex);
                }
                break;

            case STEP_TYPES.CREATE_VARIABLE:
            case STEP_TYPES.ASSIGN_VARIABLE:
                this.pulseVariablePanel();
                break;

            default:
                break;
        }

        if (step.state && step.type !== STEP_TYPES.SWAP) {
            this.syncArrayFromState(step.state.arr);
        }

        if (step.state && step.type === STEP_TYPES.SWAP) {
            this.time.delayedCall(260, () => {
                this.syncArrayFromState(step.state.arr);
            });
        }

        if (step.state) {
            this.syncVariablesFromState(step.state.variables);
        }
    }
}