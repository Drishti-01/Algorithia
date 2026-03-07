import { STEP_TYPES } from "../simulation/stepTypes";

function arraysEqual(left, right) {
    if (left.length !== right.length) {
        return false;
    }

    for (let i = 0; i < left.length; i += 1) {
        if (left[i] !== right[i]) {
            return false;
        }
    }

    return true;
}

function sortedCopy(values) {
    return [...values].sort((a, b) => a - b);
}

function ok(message) {
    return { success: true, message };
}

function fail(message) {
    return { success: false, message };
}

export const QUESTIONS = [
    {
        id: "array-traversal",
        title: "Array Traversal",
        difficulty: "Easy",
        description: "Visit every element once and accumulate the sum in a variable named total.",
        expectedBehavior: "Every array index should be visited; arr stays unchanged; total equals sum(arr).",
        input: [5, 3, 8, 1, 4],
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int total = 0;
        for(int i=0;i<arr.length;i++){
            total = total + arr[i];
        }
`,
        validate({ finalState, steps, input }) {
            const visited = new Set(
                steps
                    .filter((step) => step.type === STEP_TYPES.READ_ARRAY)
                    .map((step) => step.payload.index),
            );
            const sum = input.reduce((acc, value) => acc + value, 0);

            if (visited.size < input.length) {
                return fail("Traversal incomplete: not all indices were visited.");
            }

            if (!arraysEqual(finalState.arr, input)) {
                return fail("Array should remain unchanged for this challenge.");
            }

            if (finalState.variables.total !== sum) {
                return fail(`Expected total = ${sum}.`);
            }

            return ok("Success: traversal covered all indices and total is correct.");
        },
    },
    {
        id: "find-maximum",
        title: "Find Maximum Element",
        difficulty: "Easy",
        description: "Compute the maximum value and store it in a variable named max.",
        expectedBehavior: "max should equal the largest number in arr.",
        input: [5, 3, 8, 1, 4],
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int max = arr[0];
        for(int i=1;i<arr.length;i++){
            if(arr[i] > max){
                max = arr[i];
            }
        }
`,
        validate({ finalState, input }) {
            const expected = Math.max(...input);
            if (finalState.variables.max !== expected) {
                return fail(`Expected max = ${expected}.`);
            }
            return ok("Success: max variable matches the largest element.");
        },
    },
    {
        id: "bubble-sort",
        title: "Bubble Sort",
        difficulty: "Medium",
        description: "Sort the array in ascending order using swap operations.",
        expectedBehavior: "Final arr must be sorted ascending.",
        input: [5, 3, 8, 1, 4],
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        for(int i=0;i<arr.length-1;i++){
            for(int j=0;j<arr.length-i-1;j++){
                if(arr[j] > arr[j+1]){
                    int temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;
                }
            }
        }
`,
        validate({ finalState, input, steps }) {
            const expected = sortedCopy(input);
            if (!arraysEqual(finalState.arr, expected)) {
                return fail(`Expected sorted array [${expected.join(", ")}].`);
            }

            const swapCount = steps.filter((step) => step.type === STEP_TYPES.SWAP).length;
            if (swapCount === 0) {
                return fail("No swap event detected. This challenge expects swap behavior.");
            }

            return ok("Success: bubble sort produced a sorted array with swap events.");
        },
    },
    {
        id: "binary-search",
        title: "Binary Search",
        difficulty: "Hard",
        description: "Use index math and comparisons to locate target 13 in the sorted array.",
        expectedBehavior: "Store the answer in variable result. For target 13, expected result is index 4.",
        input: [1, 3, 5, 8, 13, 21],
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int target = 13;
        int result = -1;
        int low = 0;
        int high = arr.length - 1;

        for(int iter=0;iter<arr.length;iter++){
            if(low <= high){
                int mid = (low + high) / 2;
                if(arr[mid] == target){
                    result = mid;
                    low = high + 1;
                } else {
                    if(arr[mid] < target){
                        low = mid + 1;
                    } else {
                        high = mid - 1;
                    }
                }
            }
        }
`,
        validate({ finalState, steps, input }) {
            const expected = input.indexOf(13);
            if (finalState.variables.result !== expected) {
                return fail(`Expected result = ${expected} for target 13.`);
            }

            const compareCount = steps.filter((step) => step.type === STEP_TYPES.COMPARE).length;
            if (compareCount === 0) {
                return fail("Expected comparison events for search logic.");
            }

            return ok("Success: binary search logic resolved the correct index.");
        },
    },
    // ========== LINKED LIST QUESTIONS ==========
    {
        id: "linkedlist-traversal",
        title: "Traverse Linked List",
        difficulty: "Easy",
        category: "linkedlist",
        listType: "singly",
        description: "Traverse the singly linked list and compute the sum of all node values using proper node structure.",
        expectedBehavior: "Visit all nodes using next pointers and calculate total sum.",
        input: [5, 3, 8, 1], // Node values
        linkedListData: {
            values: [5, 3, 8, 1],
            next: [1, 2, 3, -1],
            listType: "singly",
        },
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int node0_val = arr[0];
        int node0_next = 1;
        int node1_val = arr[1];
        int node1_next = 2;
        int node2_val = arr[2];
        int node2_next = 3;
        int node3_val = arr[3];
        int node3_next = -1;
        
        int total = 0;
        int current = 0;
        
        for(int step=0; step<arr.length; step++){
            if(current == 0){
                total = total + node0_val;
                current = node0_next;
            }
            if(current == 1){
                total = total + node1_val;
                current = node1_next;
            }
            if(current == 2){
                total = total + node2_val;
                current = node2_next;
            }
            if(current == 3){
                total = total + node3_val;
                current = node3_next;
            }
        }
`,
        validate({ finalState }) {
            const sum = 5 + 3 + 8 + 1;
            
            if (finalState.variables.total !== sum) {
                return fail(`Expected total = ${sum}, got ${finalState.variables.total || 0}.`);
            }

            return ok("Success: traversed all nodes and computed correct sum.");
        },
    },
    {
        id: "linkedlist-find-max",
        title: "Find Maximum in Linked List",
        difficulty: "Easy",
        category: "linkedlist",
        listType: "singly",
        description: "Find the maximum value in the linked list using node structure and next pointers.",
        expectedBehavior: "Traverse using next pointers and find the largest node value.",
        input: [5, 12, 3, 18, 7],
        linkedListData: {
            values: [5, 12, 3, 18, 7],
            next: [1, 2, 3, 4, -1],
            listType: "singly",
        },
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int node0_val = arr[0];
        int node0_next = 1;
        int node1_val = arr[1];
        int node1_next = 2;
        int node2_val = arr[2];
        int node2_next = 3;
        int node3_val = arr[3];
        int node3_next = 4;
        int node4_val = arr[4];
        int node4_next = -1;
        
        int max = node0_val;
        int current = node0_next;
        
        for(int step=1; step<arr.length; step++){
            if(current == 1){
                if(node1_val > max){
                    max = node1_val;
                }
                current = node1_next;
            }
            if(current == 2){
                if(node2_val > max){
                    max = node2_val;
                }
                current = node2_next;
            }
            if(current == 3){
                if(node3_val > max){
                    max = node3_val;
                }
                current = node3_next;
            }
            if(current == 4){
                if(node4_val > max){
                    max = node4_val;
                }
                current = node4_next;
            }
        }
`,
        validate({ finalState, input }) {
            const expected = Math.max(...input);
            if (finalState.variables.max !== expected) {
                return fail(`Expected max = ${expected}, got ${finalState.variables.max || 0}.`);
            }
            return ok("Success: found the maximum value in the linked list.");
        },
    },
    {
        id: "linkedlist-count-nodes",
        title: "Count Linked List Nodes",
        difficulty: "Easy",
        category: "linkedlist",
        listType: "singly",
        description: "Count the total number of nodes by traversing using next pointers.",
        expectedBehavior: "Use for loop with next pointers to count all nodes.",
        input: [10, 20, 30, 40, 50],
        linkedListData: {
            values: [10, 20, 30, 40, 50],
            next: [1, 2, 3, 4, -1],
            listType: "singly",
        },
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int node0_next = 1;
        int node1_next = 2;
        int node2_next = 3;
        int node3_next = 4;
        int node4_next = -1;
        
        int count = 0;
        int current = 0;
        
        for(int step=0; step<arr.length; step++){
            count = count + 1;
            if(current == 0){
                current = node0_next;
            }
            if(current == 1){
                current = node1_next;
            }
            if(current == 2){
                current = node2_next;
            }
            if(current == 3){
                current = node3_next;
            }
            if(current == 4){
                current = node4_next;
            }
        }
`,
        validate({ finalState, input }) {
            if (finalState.variables.count !== input.length) {
                return fail(`Expected count = ${input.length}, got ${finalState.variables.count || 0}.`);
            }
            return ok("Success: counted all nodes correctly.");
        },
    },
    {
        id: "linkedlist-search",
        title: "Search in Linked List",
        difficulty: "Medium",
        category: "linkedlist",
        listType: "singly",
        description: "Search for value 30 using node structure. Store the position in 'found'.",
        expectedBehavior: "Traverse using next pointers and find target value's position.",
        input: [10, 20, 30, 40],
        linkedListData: {
            values: [10, 20, 30, 40],
            next: [1, 2, 3, -1],
            listType: "singly",
        },
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int node0_val = arr[0];
        int node0_next = 1;
        int node1_val = arr[1];
        int node1_next = 2;
        int node2_val = arr[2];
        int node2_next = 3;
        int node3_val = arr[3];
        int node3_next = -1;
        
        int target = 30;
        int found = -1;
        int current = 0;
        int position = 0;
        
        for(int step=0; step<arr.length; step++){
            if(current == 0){
                if(node0_val == target){
                    found = position;
                }
                current = node0_next;
            }
            if(current == 1){
                if(node1_val == target){
                    found = position;
                }
                current = node1_next;
            }
            if(current == 2){
                if(node2_val == target){
                    found = position;
                }
                current = node2_next;
            }
            if(current == 3){
                if(node3_val == target){
                    found = position;
                }
                current = node3_next;
            }
            position = position + 1;
        }
`,
        validate({ finalState }) {
            if (finalState.variables.found !== 2) {
                return fail(`Expected found = 2 (index of value 30), got ${finalState.variables.found}.`);
            }
            return ok("Success: found the target value at correct position.");
        },
    },
    {
        id: "doubly-linkedlist-traversal",
        title: "Doubly Linked List Traversal",
        difficulty: "Medium",
        category: "linkedlist",
        listType: "doubly",
        description: "Traverse a doubly linked list forward using next pointers and compute sum.",
        expectedBehavior: "Use node structure with next pointers to traverse and calculate total.",
        input: [10, 20, 30],
        linkedListData: {
            values: [10, 20, 30],
            next: [1, 2, -1],
            prev: [-1, 0, 1],
            listType: "doubly",
        },
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int node0_val = arr[0];
        int node0_next = 1;
        int node1_val = arr[1];
        int node1_next = 2;
        int node2_val = arr[2];
        int node2_next = -1;
        
        int total = 0;
        int current = 0;
        
        for(int step=0; step<arr.length; step++){
            if(current == 0){
                total = total + node0_val;
                current = node0_next;
            }
            if(current == 1){
                total = total + node1_val;
                current = node1_next;
            }
            if(current == 2){
                total = total + node2_val;
                current = node2_next;
            }
        }
`,
        validate({ finalState, input }) {
            const sum = input.reduce((acc, value) => acc + value, 0);
            if (finalState.variables.total !== sum) {
                return fail(`Expected total = ${sum}.`);
            }
            return ok("Success: traversed doubly linked list correctly.");
        },
    },
    {
        id: "circular-linkedlist-traversal",
        title: "Circular Linked List Traversal",
        difficulty: "Hard",
        category: "linkedlist",
        listType: "circular",
        description: "Traverse a circular linked list exactly once using next pointers and compute sum.",
        expectedBehavior: "Use counter to stop after visiting all nodes once in circular structure.",
        input: [5, 10, 15, 20],
        linkedListData: {
            values: [5, 10, 15, 20],
            next: [1, 2, 3, 0],
            listType: "circular",
        },
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int node0_val = arr[0];
        int node0_next = 1;
        int node1_val = arr[1];
        int node1_next = 2;
        int node2_val = arr[2];
        int node2_next = 3;
        int node3_val = arr[3];
        int node3_next = 0;
        
        int total = 0;
        int current = 0;
        int visited = 0;
        
        for(int step=0; step<arr.length; step++){
            if(current == 0){
                total = total + node0_val;
                current = node0_next;
            }
            if(current == 1){
                total = total + node1_val;
                current = node1_next;
            }
            if(current == 2){
                total = total + node2_val;
                current = node2_next;
            }
            if(current == 3){
                total = total + node3_val;
                current = node3_next;
            }
            visited = visited + 1;
        }
`,
        validate({ finalState, input }) {
            const sum = input.reduce((acc, value) => acc + value, 0);
            if (finalState.variables.total !== sum) {
                return fail(`Expected total = ${sum}.`);
            }
            return ok("Success: traversed circular list exactly once.");
        },
    },
    // ========== STACK QUESTIONS ==========
    {
        id: "stack-push-pop",
        title: "Stack Push and Pop Operations",
        difficulty: "Easy",
        category: "stack",
        description: "Implement stack with push and pop operations. Push elements then pop and sum them.",
        expectedBehavior: "Use top pointer to track stack operations.",
        input: [10, 20, 30],
        stackData: {
            values: [10, 20, 30],
            maxSize: 10,
        },
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int stack0 = 0;
        int stack1 = 0;
        int stack2 = 0;
        int top = -1;
        
        for(int i=0; i<arr.length; i++){
            top = top + 1;
            if(top == 0){
                stack0 = arr[i];
            }
            if(top == 1){
                stack1 = arr[i];
            }
            if(top == 2){
                stack2 = arr[i];
            }
        }
        
        int sum = 0;
        for(int i=0; i<arr.length; i++){
            if(top == 2){
                sum = sum + stack2;
            }
            if(top == 1){
                sum = sum + stack1;
            }
            if(top == 0){
                sum = sum + stack0;
            }
            top = top - 1;
        }
`,
        validate({ finalState, input }) {
            const expected = input.reduce((acc, val) => acc + val, 0);
            if (finalState.variables.sum !== expected) {
                return fail(`Expected sum = ${expected}, got ${finalState.variables.sum || 0}.`);
            }
            if (finalState.variables.top !== -1) {
                return fail(`Stack should be empty (top = -1), got top = ${finalState.variables.top}.`);
            }
            return ok("Success: pushed all elements and popped to compute sum.");
        },
    },
    {
        id: "stack-peek",
        title: "Stack Peek Operation",
        difficulty: "Easy",
        category: "stack",
        description: "Peek at the top element without removing it from stack.",
        expectedBehavior: "Access top element using top pointer without modifying stack.",
        input: [5, 15, 25, 35],
        stackData: {
            values: [5, 15, 25, 35],
            maxSize: 10,
        },
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int stack0 = 0;
        int stack1 = 0;
        int stack2 = 0;
        int stack3 = 0;
        int top = -1;
        
        for(int i=0; i<arr.length; i++){
            top = top + 1;
            if(top == 0){
                stack0 = arr[i];
            }
            if(top == 1){
                stack1 = arr[i];
            }
            if(top == 2){
                stack2 = arr[i];
            }
            if(top == 3){
                stack3 = arr[i];
            }
        }
        
        int topElement = 0;
        if(top == 3){
            topElement = stack3;
        }
`,
        validate({ finalState }) {
            if (finalState.variables.topElement !== 35) {
                return fail(`Expected topElement = 35, got ${finalState.variables.topElement || 0}.`);
            }
            if (finalState.variables.top !== 3) {
                return fail(`Stack top should remain at 3, got ${finalState.variables.top}.`);
            }
            return ok("Success: peeked at top element without modifying stack.");
        },
    },
    {
        id: "stack-reverse",
        title: "Reverse Array using Stack",
        difficulty: "Medium",
        category: "stack",
        description: "Use stack to reverse the order of elements.",
        expectedBehavior: "Push all elements, then pop to get reversed order.",
        input: [1, 2, 3, 4],
        stackData: {
            values: [1, 2, 3, 4],
            maxSize: 10,
        },
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int stack0 = 0;
        int stack1 = 0;
        int stack2 = 0;
        int stack3 = 0;
        int top = -1;
        
        for(int i=0; i<arr.length; i++){
            top = top + 1;
            if(top == 0){
                stack0 = arr[i];
            }
            if(top == 1){
                stack1 = arr[i];
            }
            if(top == 2){
                stack2 = arr[i];
            }
            if(top == 3){
                stack3 = arr[i];
            }
        }
        
        int first = 0;
        int second = 0;
        if(top == 3){
            first = stack3;
            top = top - 1;
        }
        if(top == 2){
            second = stack2;
            top = top - 1;
        }
`,
        validate({ finalState }) {
            if (finalState.variables.first !== 4) {
                return fail(`Expected first popped = 4, got ${finalState.variables.first || 0}.`);
            }
            if (finalState.variables.second !== 3) {
                return fail(`Expected second popped = 3, got ${finalState.variables.second || 0}.`);
            }
            return ok("Success: stack reversed the order correctly.");
        },
    },
    {
        id: "stack-is-empty",
        title: "Stack isEmpty Check",
        difficulty: "Medium",
        category: "stack",
        description: "Check if stack is empty before and after operations.",
        expectedBehavior: "Use top == -1 to check if stack is empty.",
        input: [100, 200],
        stackData: {
            values: [100, 200],
            maxSize: 10,
        },
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int stack0 = 0;
        int stack1 = 0;
        int top = -1;
        
        int emptyBefore = 0;
        if(top == -1){
            emptyBefore = 1;
        }
        
        for(int i=0; i<arr.length; i++){
            top = top + 1;
            if(top == 0){
                stack0 = arr[i];
            }
            if(top == 1){
                stack1 = arr[i];
            }
        }
        
        for(int i=0; i<arr.length; i++){
            top = top - 1;
        }
        
        int emptyAfter = 0;
        if(top == -1){
            emptyAfter = 1;
        }
`,
        validate({ finalState }) {
            if (finalState.variables.emptyBefore !== 1) {
                return fail("Stack should be empty initially.");
            }
            if (finalState.variables.emptyAfter !== 1) {
                return fail("Stack should be empty after popping all elements.");
            }
            return ok("Success: isEmpty check works correctly.");
        },
    },
    // ========== QUEUE QUESTIONS ==========
    {
        id: "queue-enqueue-dequeue",
        title: "Queue Enqueue and Dequeue",
        difficulty: "Easy",
        category: "queue",
        description: "Implement queue with enqueue and dequeue operations in FIFO order.",
        expectedBehavior: "Use front and rear pointers to manage queue.",
        input: [5, 10, 15, 20],
        queueData: {
            values: [5, 10, 15, 20],
            maxSize: 10,
        },
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int queue0 = 0;
        int queue1 = 0;
        int queue2 = 0;
        int queue3 = 0;
        int front = 0;
        int rear = -1;
        
        for(int i=0; i<arr.length; i++){
            rear = rear + 1;
            if(rear == 0){
                queue0 = arr[i];
            }
            if(rear == 1){
                queue1 = arr[i];
            }
            if(rear == 2){
                queue2 = arr[i];
            }
            if(rear == 3){
                queue3 = arr[i];
            }
        }
        
        int sum = 0;
        for(int i=0; i<arr.length; i++){
            if(front == 0){
                sum = sum + queue0;
            }
            if(front == 1){
                sum = sum + queue1;
            }
            if(front == 2){
                sum = sum + queue2;
            }
            if(front == 3){
                sum = sum + queue3;
            }
            front = front + 1;
        }
`,
        validate({ finalState, input }) {
            const sum = input.reduce((acc, val) => acc + val, 0);
            if (finalState.variables.sum !== sum) {
                return fail(`Expected sum = ${sum}, got ${finalState.variables.sum || 0}.`);
            }
            if (finalState.variables.front !== 4) {
                return fail(`Expected front = 4 after dequeuing all.`);
            }
            return ok("Success: processed queue in FIFO order.");
        },
    },
    {
        id: "queue-peek-front",
        title: "Queue Peek Front",
        difficulty: "Easy",
        category: "queue",
        description: "Peek at the front element without removing it from queue.",
        expectedBehavior: "Access front element without modifying queue.",
        input: [100, 200, 300],
        queueData: {
            values: [100, 200, 300],
            maxSize: 10,
        },
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int queue0 = 0;
        int queue1 = 0;
        int queue2 = 0;
        int front = 0;
        int rear = -1;
        
        for(int i=0; i<arr.length; i++){
            rear = rear + 1;
            if(rear == 0){
                queue0 = arr[i];
            }
            if(rear == 1){
                queue1 = arr[i];
            }
            if(rear == 2){
                queue2 = arr[i];
            }
        }
        
        int frontElement = 0;
        if(front == 0){
            frontElement = queue0;
        }
`,
        validate({ finalState }) {
            if (finalState.variables.frontElement !== 100) {
                return fail(`Expected frontElement = 100, got ${finalState.variables.frontElement || 0}.`);
            }
            if (finalState.variables.front !== 0) {
                return fail(`Front should remain at 0, got ${finalState.variables.front}.`);
            }
            return ok("Success: peeked at front element without modifying queue.");
        },
    },
    {
        id: "queue-front-rear",
        title: "Queue Front and Rear Access",
        difficulty: "Medium",
        category: "queue",
        description: "Access both front and rear elements of the queue.",
        expectedBehavior: "Get first and last elements using front and rear pointers.",
        input: [11, 22, 33, 44],
        queueData: {
            values: [11, 22, 33, 44],
            maxSize: 10,
        },
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int queue0 = 0;
        int queue1 = 0;
        int queue2 = 0;
        int queue3 = 0;
        int front = 0;
        int rear = -1;
        
        for(int i=0; i<arr.length; i++){
            rear = rear + 1;
            if(rear == 0){
                queue0 = arr[i];
            }
            if(rear == 1){
                queue1 = arr[i];
            }
            if(rear == 2){
                queue2 = arr[i];
            }
            if(rear == 3){
                queue3 = arr[i];
            }
        }
        
        int frontVal = 0;
        int rearVal = 0;
        if(front == 0){
            frontVal = queue0;
        }
        if(rear == 3){
            rearVal = queue3;
        }
        int size = rear - front + 1;
`,
        validate({ finalState }) {
            if (finalState.variables.frontVal !== 11) {
                return fail(`Expected frontVal = 11, got ${finalState.variables.frontVal || 0}.`);
            }
            if (finalState.variables.rearVal !== 44) {
                return fail(`Expected rearVal = 44, got ${finalState.variables.rearVal || 0}.`);
            }
            if (finalState.variables.size !== 4) {
                return fail(`Expected size = 4, got ${finalState.variables.size || 0}.`);
            }
            return ok("Success: accessed queue front and rear correctly.");
        },
    },
    {
        id: "queue-is-empty",
        title: "Queue isEmpty Check",
        difficulty: "Medium",
        category: "queue",
        description: "Check if queue is empty using front and rear pointers.",
        expectedBehavior: "Queue is empty when front > rear.",
        input: [50, 60],
        queueData: {
            values: [50, 60],
            maxSize: 10,
        },
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int queue0 = 0;
        int queue1 = 0;
        int front = 0;
        int rear = -1;
        
        int emptyBefore = 0;
        if(front > rear){
            emptyBefore = 1;
        }
        
        for(int i=0; i<arr.length; i++){
            rear = rear + 1;
            if(rear == 0){
                queue0 = arr[i];
            }
            if(rear == 1){
                queue1 = arr[i];
            }
        }
        
        for(int i=0; i<arr.length; i++){
            front = front + 1;
        }
        
        int emptyAfter = 0;
        if(front > rear){
            emptyAfter = 1;
        }
`,
        validate({ finalState }) {
            if (finalState.variables.emptyBefore !== 1) {
                return fail("Queue should be empty initially.");
            }
            if (finalState.variables.emptyAfter !== 1) {
                return fail("Queue should be empty after dequeuing all elements.");
            }
            return ok("Success: isEmpty check works correctly.");
        },
    },
];

export const QUESTIONS_BY_ID = Object.fromEntries(QUESTIONS.map((question) => [question.id, question]));