import Phaser from "phaser";
import { gameBridge } from "../gameBridge";
import { STEP_TYPES } from "../../simulation/stepTypes";

export class LinkedListScene extends Phaser.Scene {
    constructor({ key = "linkedlist-district", initialData = {} } = {}) {
        super({ key });
        this.initialData = initialData;
        this.listType = initialData.listType || "singly"; // singly, doubly, circular
        this.values = [...(initialData.values || [])];
        this.next = [...(initialData.next || [])];
        this.prev = initialData.listType === "doubly" ? [...(initialData.prev || [])] : null;
        
        this.nodes = [];
        this.arrows = [];
        this.nodePositions = [];
        this.variableValues = {};
        
        this.bridgeUnsubscribers = [];
    }

    create() {
        this.background = this.add.graphics();
        this.titleText = this.add.text(24, 18, "Data City: LinkedList Harbor", {
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "18px",
            color: "#bfdbfe",
        });

        this.statusText = this.add.text(24, 46, "Line: -", {
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "14px",
            color: "#93c5fd",
        });

        this.subtitleText = this.add.text(24, 68, "Character navigates through linked nodes.", {
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
        this.rebuildLinkedList();
        this.positionOverlay();

        this.character = this.add.circle(100, 100, 14, 0xf97316, 1)
            .setStrokeStyle(3, 0xffedd5, 0.95)
            .setDepth(30);

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
            gameBridge.on("reset", ({ linkedListData }) => {
                this.resetDistrict(linkedListData);
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
        this.rebuildLinkedList();
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

    destroyLinkedList() {
        this.nodes.forEach((node) => node.container.destroy());
        this.arrows.forEach((arrow) => arrow.destroy());
        
        this.nodes = [];
        this.arrows = [];
        this.nodePositions = [];
    }

    calculateNodePositions() {
        const width = this.scale.width;
        const height = this.scale.height;
        const count = this.values.length;

        if (count === 0) return [];

        if (this.listType === "circular" && count >= 3) {
            // Arrange in circle
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) * 0.28;
            
            const positions = [];
            for (let i = 0; i < count; i++) {
                const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
                positions.push({
                    x: centerX + Math.cos(angle) * radius,
                    y: centerY + Math.sin(angle) * radius,
                });
            }
            return positions;
        }

        // Linear arrangement
        const maxSpacing = 140;
        const availableWidth = Math.max(280, width - 280);
        const spacing = count === 1 ? 0 : Math.min(maxSpacing, availableWidth / (count - 1));
        const rowWidth = spacing * (count - 1);
        const startX = Math.floor((width - rowWidth) / 2);
        const y = Math.floor(height * 0.5);

        const positions = [];
        for (let i = 0; i < count; i++) {
            positions.push({
                x: startX + i * spacing,
                y: y,
            });
        }
        return positions;
    }

    rebuildLinkedList() {
        this.destroyLinkedList();
        
        if (this.values.length === 0) return;

        this.nodePositions = this.calculateNodePositions();

        // Create nodes
        for (let i = 0; i < this.values.length; i++) {
            const pos = this.nodePositions[i];
            this.nodes[i] = this.createNode(pos.x, pos.y, this.values[i], i);
        }

        // Create arrows
        this.createArrows();

        // Position character at first node
        if (this.character && this.nodePositions.length > 0) {
            this.character.setPosition(this.nodePositions[0].x, this.nodePositions[0].y - 80);
        }
    }

    createNode(x, y, value, index) {
        const container = this.add.container(x, y).setDepth(10);

        const body = this.add.circle(0, 0, 38, 0x0ea5e9, 0.9)
            .setStrokeStyle(3, 0xe0f2fe, 0.92);

        const valueText = this.add.text(0, 0, `${value}`, {
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "20px",
            color: "#0f172a",
        })
            .setOrigin(0.5)
            .setResolution(2);

        const indexLabel = this.add.text(0, 52, `[${index}]`, {
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "11px",
            color: "#94a3b8",
        })
            .setOrigin(0.5);

        container.add([body, valueText, indexLabel]);

        return {
            container,
            body,
            valueText,
            indexLabel,
            index,
        };
    }

    createArrows() {
        this.arrows.forEach((arrow) => arrow.destroy());
        this.arrows = [];

        for (let i = 0; i < this.values.length; i++) {
            const nextIndex = this.next[i];
            
            if (nextIndex !== -1 && nextIndex < this.values.length) {
                const from = this.nodePositions[i];
                const to = this.nodePositions[nextIndex];
                
                const arrow = this.createArrow(from.x, from.y, to.x, to.y, 0x22d3ee);
                this.arrows.push(arrow);
            }

            // Doubly linked list - prev pointers
            if (this.listType === "doubly" && this.prev && this.prev[i] !== -1) {
                const prevIndex = this.prev[i];
                if (prevIndex < this.values.length) {
                    const from = this.nodePositions[i];
                    const to = this.nodePositions[prevIndex];
                    
                    const arrow = this.createArrow(from.x, from.y - 10, to.x, to.y - 10, 0x818cf8, true);
                    this.arrows.push(arrow);
                }
            }
        }
    }

    createArrow(x1, y1, x2, y2, color = 0x22d3ee, isDashed = false) {
        const graphics = this.add.graphics();
        graphics.setDepth(5);

        const angle = Math.atan2(y2 - y1, x2 - x1);
        const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        
        const startOffset = 42;
        const endOffset = 42;
        
        const startX = x1 + Math.cos(angle) * startOffset;
        const startY = y1 + Math.sin(angle) * startOffset;
        const endX = x2 - Math.cos(angle) * endOffset;
        const endY = y2 - Math.sin(angle) * endOffset;

        graphics.lineStyle(3, color, 0.8);
        
        if (isDashed) {
            const dashLength = 8;
            const gapLength = 6;
            const totalLength = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
            const dashCount = Math.floor(totalLength / (dashLength + gapLength));
            
            for (let i = 0; i < dashCount; i++) {
                const t1 = (i * (dashLength + gapLength)) / totalLength;
                const t2 = ((i * (dashLength + gapLength)) + dashLength) / totalLength;
                
                const dx1 = startX + (endX - startX) * t1;
                const dy1 = startY + (endY - startY) * t1;
                const dx2 = startX + (endX - startX) * t2;
                const dy2 = startY + (endY - startY) * t2;
                
                graphics.lineBetween(dx1, dy1, dx2, dy2);
            }
        } else {
            graphics.lineBetween(startX, startY, endX, endY);
        }

        // Arrowhead
        const arrowSize = 12;
        const arrowAngle = Math.PI / 6;
        
        graphics.fillStyle(color, 0.8);
        graphics.beginPath();
        graphics.moveTo(endX, endY);
        graphics.lineTo(
            endX - arrowSize * Math.cos(angle - arrowAngle),
            endY - arrowSize * Math.sin(angle - arrowAngle)
        );
        graphics.lineTo(
            endX - arrowSize * Math.cos(angle + arrowAngle),
            endY - arrowSize * Math.sin(angle + arrowAngle)
        );
        graphics.closePath();
        graphics.fillPath();

        return graphics;
    }

    resetDistrict(linkedListData) {
        this.tweens.killAll();
        this.variableValues = {};
        this.renderVariables();
        this.statusText.setText("Line: -");

        if (linkedListData) {
            this.values = [...linkedListData.values];
            this.next = [...linkedListData.next];
            this.listType = linkedListData.listType || "singly";
            if (this.listType === "doubly" && linkedListData.prev) {
                this.prev = [...linkedListData.prev];
            }
        }

        this.rebuildLinkedList();
    }

    moveCharacterTo(index) {
        if (!this.character || index < 0 || index >= this.nodePositions.length) {
            return;
        }

        const pos = this.nodePositions[index];
        
        this.tweens.add({
            targets: this.character,
            x: pos.x,
            y: pos.y - 80,
            duration: 300,
            ease: "Cubic.easeInOut",
        });
    }

    flashNode(index, color = 0x38bdf8) {
        const node = this.nodes[index];
        if (!node) return;

        node.body.setStrokeStyle(4, color, 1);
        node.body.setFillStyle(color, 0.88);

        this.tweens.add({
            targets: node.container,
            scaleX: 1.15,
            scaleY: 1.15,
            duration: 150,
            yoyo: true,
            onComplete: () => {
                node.body.setFillStyle(0x0ea5e9, 0.9);
                node.body.setStrokeStyle(3, 0xe0f2fe, 0.92);
            },
        });
    }

    updateNodeValue(index, newValue) {
        const node = this.nodes[index];
        if (!node) return;

        this.values[index] = newValue;
        node.valueText.setText(`${newValue}`);
        this.flashNode(index, 0x4ade80);
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
            case STEP_TYPES.VISIT:
                if (typeof step.payload.index === "number") {
                    this.moveCharacterTo(step.payload.index);
                    this.flashNode(step.payload.index, 0x38bdf8);
                }
                break;

            case STEP_TYPES.READ_ARRAY:
                if (typeof step.payload.index === "number") {
                    this.moveCharacterTo(step.payload.index);
                    this.flashNode(step.payload.index, 0xfacc15);
                }
                break;

            case STEP_TYPES.WRITE_ARRAY:
                if (typeof step.payload.index === "number" && typeof step.payload.value === "number") {
                    this.moveCharacterTo(step.payload.index);
                    this.updateNodeValue(step.payload.index, step.payload.value);
                }
                break;

            case STEP_TYPES.COMPARE:
                if (typeof step.payload.leftIndex === "number") {
                    this.moveCharacterTo(step.payload.leftIndex);
                    this.flashNode(step.payload.leftIndex, 0xf59e0b);
                }
                if (typeof step.payload.rightIndex === "number") {
                    this.flashNode(step.payload.rightIndex, 0xf59e0b);
                }
                break;

            case STEP_TYPES.CREATE_VARIABLE:
            case STEP_TYPES.ASSIGN_VARIABLE:
                this.pulseVariablePanel();
                break;

            default:
                break;
        }

        if (step.state) {
            this.syncVariablesFromState(step.state.variables);
        }
    }
}
