# LinkedList Harbor - Visual Guide

## District Overview

**LinkedList Harbor** is the new district in Data City where students learn linked list algorithms through interactive visualization.

## Visual Elements

### Node Representation
```
    ┌─────────┐
    │   10    │  ← Value displayed in center
    └─────────┘
       [0]       ← Index label below
```

Each node is:
- Circular shape (radius: 38px)
- Cyan fill color with light border
- Value text in center
- Index label below

### Pointer Arrows

**Next Pointers (Singly/Circular):**
```
(10) ──→ (20) ──→ (30) ──→ (40)
```
- Solid cyan arrows
- Connect from node edge to node edge
- Arrowhead at destination

**Prev Pointers (Doubly):**
```
(10) ⇄ (20) ⇄ (30)
```
- Dashed purple arrows
- Slightly offset from next arrows
- Bidirectional visualization

**Circular Connection:**
```
     (10)
    ↗    ↘
  (40)  (20)
    ↖    ↙
     (30)
```
- Last node connects back to first
- Nodes arranged in circle
- Continuous loop visualization

## Character Movement

The orange character (circle with white border) represents the current pointer position:

```
     🟠 ← Character
     ↓
    (10) → (20) → (30)
```

**Movement Pattern:**
- Starts at head (index 0)
- Moves smoothly between nodes (300ms animation)
- Follows pointer traversal in code
- Positioned above current node

## Operation Visualizations

### 1. VISIT Operation
```
    (10) → [20] → (30)
           ↑
         Cyan flash
```
- Node flashes cyan
- Character moves to node
- Brief scale pulse (1.15x)

### 2. READ Operation
```
    (10) → [20] → (30)
           ↑
       Yellow flash
```
- Node flashes yellow
- Indicates value being read
- Character positioned at node

### 3. WRITE Operation
```
    (10) → [25] → (30)
           ↑
       Green flash
       Value updated
```
- Node flashes green
- Value text updates
- Indicates modification

### 4. COMPARE Operation
```
    [10] → [20] → (30)
     ↑      ↑
   Orange flash
```
- Both nodes flash orange
- Shows comparison happening
- Character at first node

## Layout Patterns

### Linear Layout (Singly/Doubly)
```
Horizontal arrangement:

(5) → (3) → (8) → (1) → (4)

Spacing: 140px max between nodes
Centered on screen
Y-position: 50% of height
```

### Circular Layout (Circular Lists)
```
Circular arrangement (3+ nodes):

        (5)
       ↗   ↘
    (20)   (10)
       ↖   ↙
        (15)

Radius: 28% of min(width, height)
Center: Screen center
Starts at top (-90°)
```

## State Display

### Variable Panel (Top Right)
```
┌─────────────────┐
│ Variables       │
│ i: 2            │
│ total: 13       │
│ count: 3        │
└─────────────────┘
```
- Shows current variable values
- Updates in real-time
- Pulses on variable changes

### Status Bar (Top Left)
```
Data City: LinkedList Harbor
Line: 5
Character navigates through linked nodes.
```

### Event Log (Bottom)
```
Recent Steps:
- Visit index 2
- Read values[2] => 8
- Assign total = 13
- Visit index 3
```

## Example Scenarios

### Scenario 1: Traversal
```
Code:
int i = 0;
while(i != -1){
    total = total + values[i];
    i = next[i];
}

Visualization:
Step 1: 🟠 at (5)  → Read 5
Step 2: 🟠 at (3)  → Read 3
Step 3: 🟠 at (8)  → Read 8
Step 4: 🟠 at (1)  → Read 1
Step 5: Done (i = -1)
```

### Scenario 2: Search
```
Code:
int i = 0;
while(i != -1){
    if(values[i] == target){
        found = i;
    }
    i = next[i];
}

Visualization:
Step 1: 🟠 at (10) → Compare (orange flash)
Step 2: 🟠 at (20) → Compare (orange flash)
Step 3: 🟠 at (30) → Compare + Match! (green flash)
```

### Scenario 3: Doubly Linked List
```
Structure:
(10) ⇄ (20) ⇄ (30)
 ↓     ↓     ↓
next: [1, 2, -1]
prev: [-1, 0, 1]

Visualization:
- Solid cyan arrows for next
- Dashed purple arrows for prev
- Character can traverse both directions
```

### Scenario 4: Circular List
```
Structure:
     (5)
    ↗   ↘
  (20)  (10)
    ↖   ↙
     (15)

next: [1, 2, 3, 0]  ← Last points to first

Visualization:
- Nodes in circle
- Arrow from (20) back to (5)
- Character loops around
- Must use counter to stop
```

## Color Palette

| Element | Color | Hex Code |
|---------|-------|----------|
| Node Body | Cyan | #0ea5e9 |
| Node Border | Light Cyan | #e0f2fe |
| Node Value | Dark Blue | #0f172a |
| Next Arrow | Cyan | #22d3ee |
| Prev Arrow | Purple | #818cf8 |
| Character | Orange | #f97316 |
| Character Border | Light Orange | #ffedd5 |
| Visit Flash | Cyan | #38bdf8 |
| Read Flash | Yellow | #facc15 |
| Write Flash | Green | #22c55e |
| Compare Flash | Orange | #f59e0b |

## Animation Timings

| Animation | Duration | Easing |
|-----------|----------|--------|
| Character Move | 300ms | Cubic.easeInOut |
| Node Flash | 150ms | Yoyo |
| Node Scale | 150ms | Yoyo (1.15x) |
| Variable Panel Pulse | 100ms | Yoyo |
| Line Highlight | 400ms | - |
| Step Delay | 500ms | - |

## Responsive Behavior

- Nodes scale based on screen size
- Spacing adjusts for smaller screens
- Minimum spacing: 80px
- Maximum spacing: 140px
- Circular radius: 28% of viewport
- Variable panel: Fixed top-right
- Status bar: Fixed top-left

## Accessibility

- High contrast colors
- Clear visual feedback
- Smooth animations (not jarring)
- Text labels for all nodes
- Index numbers for reference
- Color + shape coding (not color alone)

## Tips for Students

1. **Watch the character** - It shows current pointer position
2. **Follow the arrows** - They show the next pointer connections
3. **Check the variables** - See loop counter and accumulator values
4. **Read the event log** - Understand each operation
5. **Compare with code** - Line highlighting shows current execution
6. **Use the reset button** - Try different approaches

## Common Patterns

### Pattern 1: Basic Traversal
```java
int i = 0;
while(i != -1){
    // Process values[i]
    i = next[i];
}
```

### Pattern 2: Counting
```java
int count = 0;
int i = 0;
while(i != -1){
    count = count + 1;
    i = next[i];
}
```

### Pattern 3: Search
```java
int found = -1;
int i = 0;
while(i != -1){
    if(values[i] == target){
        found = i;
    }
    i = next[i];
}
```

### Pattern 4: Circular (with counter)
```java
int i = 0;
int count = 0;
while(count < values.length){
    // Process values[i]
    i = next[i];
    count = count + 1;
}
```

## Debugging Tips

**Problem:** Character not moving
- Check if `i = next[i]` is in your loop
- Verify loop condition

**Problem:** Infinite loop
- For circular lists, use a counter
- Check termination condition

**Problem:** Wrong sum/count
- Verify you're reading `values[i]` not `i`
- Check accumulator initialization

**Problem:** Not all nodes visited
- Ensure loop continues until `i == -1`
- Check starting index (usually 0)
