import Phaser from "phaser";
import { gameBridge } from "../gameBridge";
import { STEP_TYPES } from "../../simulation/stepTypes";

export class StackScene extends Phaser.Scene {
    constructor({ key = "stack-district", initialData = {} } = {}) {
        super({ key });
        this.initialData = initialData;
        this.stackValues = []; // Start empty, will populate during execution
        this.maxSize = initialData.maxSize || 10;
        
        this.stackBlocks = [];
        this.variableValues = {};
        
        this.bridgeUnsubscribers = [];
    }

    create() {
        this.background = this.add.graphics();
        this.titleText = this.add.text(24, 18, "Data City: Stack Tower", {
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "18px",
            color: "#bfdbfe",
        });

        this.statusText = this.add.text(24, 46, "Line: -", {
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "14px",
            color: "#93c5fd",
        });

        this.subtitleText = this.add.text(24, 68, "Stack operations: Push adds to top, Pop removes from top.", {
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
        this.positionOverlay();

        this.character = this.add.circle(100, 100, 14, 0xf97316, 1)
            .setStrokeStyle(3, 0xffedd5, 0.95)
            .setDepth(30);

        this.rebuildStack();

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
            gameBridge.on("reset", ({ stackData }) => {
                this.resetDistrict(stackData);
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
        this.rebuildStack();
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

    destroyStack() {
        this.stackBlocks.forEach((block) => block.container.destroy());
        this.stackBlocks = [];
        
        if (this.emptyText) this.emptyText.destroy();
    }

    rebuildStack() {
        this.destroyStack();
        
        const width = this.scale.width;
        const height = this.scale.height;
        
        const stackX = width / 2;
        const baseY = height * 0.75;
        const blockHeight = 60;
        
        // Draw base platform
        if (this.basePlatform) {
            this.basePlatform.destroy();
        }
        this.basePlatform = this.add.rectangle(stackX, baseY + 10, 120, 20, 0x334155, 0.8)
            .setDepth(1);

        if (this.stackValues.length === 0) {
            // Show empty stack message
            this.emptyText = this.add.text(stackX, baseY - 60, "Stack is Empty", {
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "16px",
                color: "#64748b",
            })
                .setOrigin(0.5)
                .setDepth(5);
            
            this.character.setPosition(stackX, baseY - 60);
            return;
        }

        // Create stack blocks from bottom to top
        for (let i = 0; i < this.stackValues.length; i++) {
            const y = baseY - (i * blockHeight) - blockHeight / 2;
            this.stackBlocks[i] = this.createStackBlock(stackX, y, this.stackValues[i], i);
        }

        // Position character at top of stack
        if (this.character && this.stackBlocks.length > 0) {
            const topBlock = this.stackBlocks[this.stackBlocks.length - 1];
            this.character.setPosition(topBlock.container.x, topBlock.container.y - 60);
        } else {
            this.character.setPosition(stackX, baseY - 60);
        }
    }

    createStackBlock(x, y, value, index) {
        const container = this.add.container(x, y).setDepth(10);

        const body = this.add.rectangle(0, 0, 100, 50, 0x8b5cf6, 0.9)
            .setStrokeStyle(3, 0xddd6fe, 0.92);

        const valueText = this.add.text(0, 0, `${value}`, {
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "20px",
            color: "#0f172a",
        })
            .setOrigin(0.5)
            .setResolution(2);

        container.add([body, valueText]);

        return {
            container,
            body,
            valueText,
            index,
        };
    }

    resetDistrict(stackData) {
        this.tweens.killAll();
        this.variableValues = {};
        this.renderVariables();
        this.statusText.setText("Line: -");

        // Start with empty stack - blocks will appear as code executes
        this.stackValues = [];

        this.rebuildStack();
    }

    flashTopBlock(color = 0xfacc15) {
        if (this.stackBlocks.length === 0) return;
        
        const topBlock = this.stackBlocks[this.stackBlocks.length - 1];
        
        topBlock.body.setStrokeStyle(4, color, 1);
        topBlock.body.setFillStyle(color, 0.88);

        this.tweens.add({
            targets: topBlock.container,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 150,
            yoyo: true,
            onComplete: () => {
                topBlock.body.setFillStyle(0x8b5cf6, 0.9);
                topBlock.body.setStrokeStyle(3, 0xddd6fe, 0.92);
            },
        });
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
        if (!step) return;

        if (typeof step.line === "number") {
            this.statusText.setText(`Line: ${step.line}`);
        }

        switch (step.type) {
            case STEP_TYPES.READ_ARRAY:
                this.flashTopBlock(0xfacc15);
                break;

            case STEP_TYPES.WRITE_ARRAY:
                this.flashTopBlock(0x22c55e);
                break;

            case STEP_TYPES.CREATE_VARIABLE:
            case STEP_TYPES.ASSIGN_VARIABLE:
                this.pulseVariablePanel();
                break;

            default:
                break;
        }

        if (step.state && step.state.variables) {
            this.syncVariablesFromState(step.state.variables);
            
            // Update stack visualization based on top pointer
            const topValue = step.state.variables.top;
            
            if (typeof topValue === "number") {
                const newStackValues = [];
                
                // Collect stack values from stack0 to stack[top]
                if (topValue >= 0) {
                    for (let i = 0; i <= topValue; i++) {
                        const stackVar = `stack${i}`;
                        const value = step.state.variables[stackVar];
                        if (value !== undefined) {
                            newStackValues.push(value);
                        }
                    }
                }
                
                // Always rebuild to show current state
                const needsUpdate = newStackValues.length !== this.stackBlocks.length ||
                    JSON.stringify(newStackValues) !== JSON.stringify(this.stackValues);
                
                if (needsUpdate) {
                    this.stackValues = newStackValues;
                    this.rebuildStack();
                }
            }
        }
    }
}
