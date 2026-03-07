import Phaser from "phaser";
import { gameBridge } from "../gameBridge";
import { STEP_TYPES } from "../../simulation/stepTypes";

export class QueueScene extends Phaser.Scene {
    constructor({ key = "queue-district", initialData = {} } = {}) {
        super({ key });
        this.initialData = initialData;
        this.queueValues = []; // Start empty, will populate during execution
        this.maxSize = initialData.maxSize || 10;
        
        this.queueBlocks = [];
        this.variableValues = {};
        
        this.bridgeUnsubscribers = [];
    }

    create() {
        this.background = this.add.graphics();
        this.titleText = this.add.text(24, 18, "Data City: Queue Lane", {
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "18px",
            color: "#bfdbfe",
        });

        this.statusText = this.add.text(24, 46, "Line: -", {
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "14px",
            color: "#93c5fd",
        });

        this.subtitleText = this.add.text(24, 68, "Queue operations: Enqueue adds to rear, Dequeue removes from front.", {
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

        this.rebuildQueue();

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
            gameBridge.on("reset", ({ queueData }) => {
                this.resetDistrict(queueData);
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
        this.rebuildQueue();
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

    destroyQueue() {
        this.queueBlocks.forEach((block) => block.container.destroy());
        this.queueBlocks = [];
        
        if (this.frontLabel) this.frontLabel.destroy();
        if (this.rearLabel) this.rearLabel.destroy();
        if (this.emptyText) this.emptyText.destroy();
    }

    rebuildQueue() {
        this.destroyQueue();
        
        const width = this.scale.width;
        const height = this.scale.height;
        
        const queueY = height / 2;
        const blockWidth = 80;
        const spacing = 10;
        
        if (this.queueValues.length === 0) {
            // Show empty queue message
            const centerX = width / 2;
            this.emptyText = this.add.text(centerX, queueY, "Queue is Empty", {
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "16px",
                color: "#64748b",
            })
                .setOrigin(0.5)
                .setDepth(5);
            
            this.character.setPosition(centerX, queueY - 80);
            return;
        }
        
        const totalWidth = this.queueValues.length * (blockWidth + spacing);
        const startX = (width - totalWidth) / 2 + blockWidth / 2;
        
        // Create queue blocks from left (front) to right (rear)
        for (let i = 0; i < this.queueValues.length; i++) {
            const x = startX + i * (blockWidth + spacing);
            this.queueBlocks[i] = this.createQueueBlock(x, queueY, this.queueValues[i], i);
        }

        // Add FRONT and REAR labels
        if (this.queueBlocks.length > 0) {
            const frontBlock = this.queueBlocks[0];
            this.frontLabel = this.add.text(frontBlock.container.x, frontBlock.container.y - 50, "FRONT", {
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "12px",
                color: "#22d3ee",
            })
                .setOrigin(0.5)
                .setDepth(5);

            const rearBlock = this.queueBlocks[this.queueBlocks.length - 1];
            this.rearLabel = this.add.text(rearBlock.container.x, rearBlock.container.y + 50, "REAR", {
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "12px",
                color: "#f97316",
            })
                .setOrigin(0.5)
                .setDepth(5);
        }

        // Position character at front of queue
        if (this.character && this.queueBlocks.length > 0) {
            const frontBlock = this.queueBlocks[0];
            this.character.setPosition(frontBlock.container.x, frontBlock.container.y - 80);
        } else {
            this.character.setPosition(startX, queueY - 80);
        }
    }

    createQueueBlock(x, y, value, index) {
        const container = this.add.container(x, y).setDepth(10);

        const body = this.add.rectangle(0, 0, 70, 70, 0x10b981, 0.9)
            .setStrokeStyle(3, 0xd1fae5, 0.92);

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

    resetDistrict(queueData) {
        this.tweens.killAll();
        this.variableValues = {};
        this.renderVariables();
        this.statusText.setText("Line: -");

        // Start with empty queue - blocks will appear as code executes
        this.queueValues = [];

        this.rebuildQueue();
    }

    flashBlock(index, color = 0xfacc15) {
        if (index < 0 || index >= this.queueBlocks.length) return;
        
        const block = this.queueBlocks[index];
        
        block.body.setStrokeStyle(4, color, 1);
        block.body.setFillStyle(color, 0.88);

        this.tweens.add({
            targets: block.container,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 150,
            yoyo: true,
            onComplete: () => {
                block.body.setFillStyle(0x10b981, 0.9);
                block.body.setStrokeStyle(3, 0xd1fae5, 0.92);
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
                if (typeof step.payload.index === "number") {
                    this.flashBlock(step.payload.index, 0xfacc15);
                }
                break;

            case STEP_TYPES.WRITE_ARRAY:
                if (typeof step.payload.index === "number") {
                    this.flashBlock(step.payload.index, 0x22c55e);
                }
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
            
            // Update queue visualization based on rear pointer
            const rear = step.state.variables.rear;
            
            if (typeof rear === "number") {
                const newQueueValues = [];
                
                // Collect queue values from queue0 to queue[rear]
                if (rear >= 0) {
                    for (let i = 0; i <= rear; i++) {
                        const queueVar = `queue${i}`;
                        const value = step.state.variables[queueVar];
                        if (value !== undefined) {
                            newQueueValues.push(value);
                        }
                    }
                }
                
                // Always rebuild to show current state
                const needsUpdate = newQueueValues.length !== this.queueBlocks.length ||
                    JSON.stringify(newQueueValues) !== JSON.stringify(this.queueValues);
                
                if (needsUpdate) {
                    this.queueValues = newQueueValues;
                    this.rebuildQueue();
                }
            }
        }
    }
}
