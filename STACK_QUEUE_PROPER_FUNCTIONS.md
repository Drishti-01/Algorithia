# Stack & Queue - Proper Functions Implementation

## 🎯 Updated with Real Stack/Queue Operations!

Ab Stack aur Queue questions mein **proper data structure functions** hain with realistic implementation!

## 📚 Stack Questions (4 Total)

### 1. Stack Push and Pop Operations (Easy)
**Concept:** Basic stack with push and pop

**Code Structure:**
```java
// Stack array
int stack0 = 0;
int stack1 = 0;
int stack2 = 0;
int top = -1;  // Stack pointer

// PUSH operation
for(int i=0; i<arr.length; i++){
    top = top + 1;  // Increment top
    if(top == 0){
        stack0 = arr[i];  // Push to stack[0]
    }
    if(top == 1){
        stack1 = arr[i];  // Push to stack[1]
    }
    // ...
}

// POP operation
for(int i=0; i<arr.length; i++){
    if(top == 2){
        sum = sum + stack2;  // Pop from top
    }
    top = top - 1;  // Decrement top
}
```

**Validates:**
- Sum of all elements
- Stack is empty after popping (top == -1)

### 2. Stack Peek Operation (Easy)
**Concept:** Look at top without removing

**Code Structure:**
```java
// After pushing all elements
int topElement = 0;
if(top == 3){
    topElement = stack3;  // Peek at top
}
// top remains unchanged!
```

**Validates:**
- Top element value
- Stack top pointer unchanged

### 3. Reverse Array using Stack (Medium)
**Concept:** LIFO property reverses order

**Code Structure:**
```java
// Push: 1, 2, 3, 4
// Pop gives: 4, 3, 2, 1 (reversed!)

int first = 0;
int second = 0;
if(top == 3){
    first = stack3;  // Pop 4
    top = top - 1;
}
if(top == 2){
    second = stack2;  // Pop 3
    top = top - 1;
}
```

**Validates:**
- First popped = last pushed
- Second popped = second-last pushed

### 4. Stack isEmpty Check (Medium)
**Concept:** Check if stack is empty

**Code Structure:**
```java
int top = -1;

int emptyBefore = 0;
if(top == -1){
    emptyBefore = 1;  // Stack is empty
}

// ... push and pop operations ...

int emptyAfter = 0;
if(top == -1){
    emptyAfter = 1;  // Stack is empty again
}
```

**Validates:**
- Empty before operations
- Empty after popping all

## 🎫 Queue Questions (4 Total)

### 1. Queue Enqueue and Dequeue (Easy)
**Concept:** Basic queue with FIFO

**Code Structure:**
```java
// Queue array
int queue0 = 0;
int queue1 = 0;
int queue2 = 0;
int queue3 = 0;
int front = 0;   // Front pointer
int rear = -1;   // Rear pointer

// ENQUEUE operation
for(int i=0; i<arr.length; i++){
    rear = rear + 1;  // Move rear
    if(rear == 0){
        queue0 = arr[i];  // Add at rear
    }
    // ...
}

// DEQUEUE operation
for(int i=0; i<arr.length; i++){
    if(front == 0){
        sum = sum + queue0;  // Remove from front
    }
    front = front + 1;  // Move front
}
```

**Validates:**
- Sum in FIFO order
- Front pointer position

### 2. Queue Peek Front (Easy)
**Concept:** Look at front without removing

**Code Structure:**
```java
// After enqueuing all elements
int frontElement = 0;
if(front == 0){
    frontElement = queue0;  // Peek at front
}
// front remains unchanged!
```

**Validates:**
- Front element value
- Front pointer unchanged

### 3. Queue Front and Rear Access (Medium)
**Concept:** Access both ends

**Code Structure:**
```java
int frontVal = 0;
int rearVal = 0;

if(front == 0){
    frontVal = queue0;  // Get front
}
if(rear == 3){
    rearVal = queue3;  // Get rear
}

int size = rear - front + 1;  // Calculate size
```

**Validates:**
- Front value
- Rear value
- Queue size

### 4. Queue isEmpty Check (Medium)
**Concept:** Check if queue is empty

**Code Structure:**
```java
int front = 0;
int rear = -1;

int emptyBefore = 0;
if(front > rear){
    emptyBefore = 1;  // Queue is empty
}

// ... enqueue and dequeue operations ...

int emptyAfter = 0;
if(front > rear){
    emptyAfter = 1;  // Queue is empty again
}
```

**Validates:**
- Empty before operations
- Empty after dequeuing all

## 🎨 Visual Execution

### Stack Push Example:
```
Step 1: top = -1 (empty)
        └─────┘

Step 2: top = 0, push 10
        ┌─────┐
        │ 10  │
        └─────┘

Step 3: top = 1, push 20
        ┌─────┐
        │ 20  │ ← top
        ├─────┤
        │ 10  │
        └─────┘

Step 4: top = 2, push 30
        ┌─────┐
        │ 30  │ ← top
        ├─────┤
        │ 20  │
        ├─────┤
        │ 10  │
        └─────┘
```

### Stack Pop Example:
```
Step 1: top = 2, pop 30
        ┌─────┐
        │ 30  │ ← popped
        ├─────┤
        │ 20  │ ← new top
        ├─────┤
        │ 10  │
        └─────┘

Step 2: top = 1, pop 20
        ┌─────┐
        │ 20  │ ← popped
        ├─────┤
        │ 10  │ ← new top
        └─────┘

Step 3: top = 0, pop 10
        ┌─────┐
        │ 10  │ ← popped
        └─────┘

Step 4: top = -1 (empty)
        └─────┘
```

### Queue Enqueue Example:
```
Step 1: front=0, rear=-1 (empty)
        └─────┘

Step 2: rear=0, enqueue 5
        ┌───┐
        │ 5 │
        └───┘
        ↑
      front/rear

Step 3: rear=1, enqueue 10
        ┌───┐  ┌───┐
        │ 5 │  │10 │
        └───┘  └───┘
        ↑       ↑
      front   rear

Step 4: rear=2, enqueue 15
        ┌───┐  ┌───┐  ┌───┐
        │ 5 │  │10 │  │15 │
        └───┘  └───┘  └───┘
        ↑              ↑
      front          rear
```

### Queue Dequeue Example:
```
Step 1: front=0, dequeue 5
        ┌───┐  ┌───┐  ┌───┐
        │ 5 │  │10 │  │15 │
        └───┘  └───┘  └───┘
        ↑ dequeued
        
Step 2: front=1, dequeue 10
        ┌───┐  ┌───┐  ┌───┐
        │ 5 │  │10 │  │15 │
        └───┘  └───┘  └───┘
                ↑ dequeued
                
Step 3: front=2, dequeue 15
        ┌───┐  ┌───┐  ┌───┐
        │ 5 │  │10 │  │15 │
        └───┘  └───┘  └───┘
                        ↑ dequeued

Step 4: front=3, rear=2 (empty, front > rear)
```

## 🎓 Key Concepts Taught

### Stack Operations:
✅ **push()** - Add element to top (top++)
✅ **pop()** - Remove element from top (top--)
✅ **peek()** - View top without removing
✅ **isEmpty()** - Check if top == -1
✅ **LIFO** - Last In First Out

### Queue Operations:
✅ **enqueue()** - Add element to rear (rear++)
✅ **dequeue()** - Remove element from front (front++)
✅ **peek()** - View front without removing
✅ **isEmpty()** - Check if front > rear
✅ **FIFO** - First In First Out

## 📊 Summary

| Question | Operations | Pointers | Concept |
|----------|-----------|----------|---------|
| Stack Push/Pop | push, pop | top | LIFO |
| Stack Peek | peek | top | Non-destructive read |
| Stack Reverse | push, pop | top | Order reversal |
| Stack isEmpty | isEmpty | top | Empty check |
| Queue Enqueue/Dequeue | enqueue, dequeue | front, rear | FIFO |
| Queue Peek | peek | front | Non-destructive read |
| Queue Front/Rear | access | front, rear | Both ends |
| Queue isEmpty | isEmpty | front, rear | Empty check |

**Total: 8 questions with proper data structure operations!** 🎉

## ✅ Status

**COMPLETE!** All stack and queue questions now have:
- ✅ Proper function implementations
- ✅ Pointer management (top, front, rear)
- ✅ Push/Pop operations
- ✅ Enqueue/Dequeue operations
- ✅ Peek operations
- ✅ isEmpty checks
- ✅ Realistic code patterns
- ✅ Educational value

**Ab students proper stack aur queue operations seekhenge!** 📚🎫✨
