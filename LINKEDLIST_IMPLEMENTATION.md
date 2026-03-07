# Linked List Implementation Guide

## Overview

The Linked List system has been successfully integrated into Algorithia (Data City) as a new district called **LinkedList Harbor**. This implementation follows the constraint of NOT modifying the core engine files (`parser.js`, `interpreter.js`, `stepGenerator.js`).

## Architecture

### How It Works

Since the interpreter understands arrays and variables, we simulate linked lists using arrays internally:

```javascript
// Linked list representation
values = [10, 20, 30, 40]  // Node values
next = [1, 2, 3, -1]        // Next pointers (-1 means null)
prev = [-1, 0, 1, 2]        // Previous pointers (for doubly linked lists)
```

The interpreter executes normal array operations, while the Phaser visualization renders them as linked list nodes with pointer connections.

## New Components

### 1. LinkedListScene.js
**Location:** `src/game/districts/LinkedListScene.js`

**Features:**
- Renders nodes as circular data cells
- Draws arrows representing pointers
- Supports three list types:
  - **Singly Linked List** - Forward pointers only
  - **Doubly Linked List** - Forward and backward pointers (dashed lines for prev)
  - **Circular Linked List** - Last node points back to head (circular arrangement)
- Animates character movement between nodes
- Visual effects for operations (read, write, visit, compare)

**Visual Layout:**
- Linear lists: Horizontal arrangement
- Circular lists: Circular arrangement when 3+ nodes

### 2. Linked List Questions
**Location:** `src/data/questions.js`

**Six New Challenges:**

1. **Traverse Linked List** (Easy)
   - Traverse singly linked list and compute sum
   - Input: `[5, 3, 8, 1]`

2. **Find Maximum in Linked List** (Easy)
   - Find maximum value in linked list
   - Input: `[5, 12, 3, 18, 7]`

3. **Count Linked List Nodes** (Easy)
   - Count total number of nodes
   - Input: `[10, 20, 30, 40, 50]`

4. **Search in Linked List** (Medium)
   - Search for target value and return index
   - Input: `[10, 20, 30, 40]`

5. **Doubly Linked List Traversal** (Medium)
   - Traverse doubly linked list with prev/next pointers
   - Input: `[10, 20, 30]`

6. **Circular Linked List Traversal** (Hard)
   - Traverse circular list exactly once (cycle detection)
   - Input: `[5, 10, 15, 20]`

### 3. Updated Components

**GamePanel.jsx**
- Added `linkedListData` and `district` props
- Supports both array and linkedlist districts

**DataCityPage.jsx**
- Detects linked list questions via `category` field
- Passes `linkedListData` to game bridge
- Updates district header dynamically

**QuestionCard.jsx**
- Shows category badge for linked list questions
- Displays node values instead of array input

**QuestionsPage.jsx**
- Added filter bar with three options:
  - All Challenges
  - 📊 Array District
  - 🔗 LinkedList Harbor

**createDataCityGame.js**
- Registered LinkedListScene in district registry
- Handles linkedlist district initialization

## Code Templates

Linked list questions use modified templates:

```java
static void solve(int[] values, int[] next){
    // Singly linked list
    int i = 0;
    while(i != -1){
        // Process values[i]
        i = next[i];  // Move to next node
    }
}
```

```java
static void solve(int[] values, int[] next, int[] prev){
    // Doubly linked list
    int i = 0;
    while(i != -1){
        // Process values[i]
        i = next[i];  // Move forward
    }
}
```

## Visual Design

### Color Coding
- **Node Body:** Cyan (`#0ea5e9`)
- **Node Border:** Light cyan (`#e0f2fe`)
- **Next Arrows:** Cyan (`#22d3ee`)
- **Prev Arrows:** Purple (`#818cf8`) - dashed
- **Character:** Orange (`#f97316`)

### Operations
- **VISIT:** Cyan flash
- **READ:** Yellow flash
- **WRITE:** Green flash + value update
- **COMPARE:** Orange flash on both nodes

### Animations
- Character movement: 300ms cubic ease
- Node flash: 150ms scale pulse
- Smooth transitions between states

## User Experience

1. User selects a linked list challenge from Question Hub
2. Filter bar allows switching between Array and LinkedList districts
3. Monaco editor shows linked list template with `values[]` and `next[]` arrays
4. User writes traversal/manipulation code
5. On "Run", interpreter executes array operations
6. LinkedListScene visualizes as nodes and pointers
7. Character animates through the list
8. Validation checks correctness

## Testing

All linked list questions include:
- Starter code (working solution)
- Custom validation logic
- Expected behavior description
- Step-by-step verification

## Future Enhancements

Potential additions:
- Insert node operations
- Delete node operations
- Reverse linked list
- Merge two lists
- Detect cycle
- Find middle node
- More complex doubly/circular list operations

## Technical Notes

- No modifications to core engine files
- Reuses existing interpreter step types
- Array operations map to linked list visualizations
- Maintains consistency with Array District UX
- Fully integrated with existing routing and state management

## Files Modified/Created

**Created:**
- `src/game/districts/LinkedListScene.js`
- `LINKEDLIST_IMPLEMENTATION.md`

**Modified:**
- `src/data/questions.js` - Added 6 linked list questions
- `src/game/createDataCityGame.js` - Registered LinkedListScene
- `src/components/GamePanel.jsx` - Added district support
- `src/pages/DataCityPage.jsx` - Added linked list handling
- `src/components/QuestionCard.jsx` - Added category badge
- `src/pages/QuestionsPage.jsx` - Added filter bar
- `src/index.css` - Added filter and category styles

**Not Modified (as per constraint):**
- `src/engine/parser.js`
- `src/engine/interpreter.js`
- `src/engine/stepGenerator.js`
