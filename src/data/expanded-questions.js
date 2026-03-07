import { STEP_TYPES } from "../simulation/stepTypes";

function arraysEqual(left, right) {
    if (left.length !== right.length) return false;
    for (let i = 0; i < left.length; i += 1) {
        if (left[i] !== right[i]) return false;
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

/**
 * EXPANDED QUESTION BANK - 40+ Questions
 * 
 * Organization:
 * - Level 1 (Beginner): Easy questions, basic concepts
 * - Level 2 (Intermediate): Medium questions, more complex logic
 * - Level 3 (Advanced): Hard questions, advanced algorithms
 * 
 * Groups:
 * - Array Basics (Level 1)
 * - Array Algorithms (Level 2-3)
 * - LinkedList Basics (Level 1)
 * - LinkedList Advanced (Level 2-3)
 * - Stack Basics (Level 1)
 * - Stack Applications (Level 2-3)
 * - Queue Basics (Level 1)
 * - Queue Applications (Level 2-3)
 */

export const EXPANDED_QUESTIONS = [
    // ==================== ARRAY BASICS (Level 1) ====================
    {
        id: "array-traversal",
        title: "Array Traversal",
        difficulty: "Easy",
        category: "array",
        level: 1,
        group: "Array Basics",
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
        category: "array",
        level: 1,
        group: "Array Basics",
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
        id: "find-minimum",
        title: "Find Minimum Element",
        difficulty: "Easy",
        category: "array",
        level: 1,
        group: "Array Basics",
        description: "Find the smallest value in the array and store it in variable min.",
        expectedBehavior: "min should equal the smallest number in arr.",
        input: [12, 5, 18, 3, 9],
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int min = arr[0];
        for(int i=1;i<arr.length;i++){
            if(arr[i] < min){
                min = arr[i];
            }
        }
`,
        validate({ finalState, input }) {
            const expected = Math.min(...input);
            if (finalState.variables.min !== expected) {
                return fail(`Expected min = ${expected}.`);
            }
            return ok("Success: found the minimum element.");
        },
    },
    {
        id: "count-even",
        title: "Count Even Numbers",
        difficulty: "Easy",
        category: "array",
        level: 1,
        group: "Array Basics",
        description: "Count how many even numbers are in the array. Store result in count.",
        expectedBehavior: "count should equal the number of even elements.",
        input: [2, 5, 8, 11, 14, 17],
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int count = 0;
        for(int i=0;i<arr.length;i++){
            int remainder = arr[i] - ((arr[i] / 2) * 2);
            if(remainder == 0){
                count = count + 1;
            }
        }
`,
        validate({ finalState, input }) {
            const expected = input.filter(x => x % 2 === 0).length;
            if (finalState.variables.count !== expected) {
                return fail(`Expected count = ${expected}.`);
            }
            return ok("Success: counted all even numbers.");
        },
    },
    {
        id: "array-average",
        title: "Calculate Array Average",
        difficulty: "Easy",
        category: "array",
        level: 1,
        group: "Array Basics",
        description: "Calculate the average of all elements. Store sum and count, then compute average.",
        expectedBehavior: "average should equal sum divided by count.",
        input: [10, 20, 30, 40, 50],
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int sum = 0;
        int count = 0;
        for(int i=0;i<arr.length;i++){
            sum = sum + arr[i];
            count = count + 1;
        }
        int average = sum / count;
`,
        validate({ finalState, input }) {
            const expected = Math.floor(input.reduce((a,b) => a+b, 0) / input.length);
            if (finalState.variables.average !== expected) {
                return fail(`Expected average = ${expected}.`);
            }
            return ok("Success: calculated correct average.");
        },
    },

    // ==================== ARRAY ALGORITHMS (Level 2-3) ====================
    {
        id: "bubble-sort",
        title: "Bubble Sort",
        difficulty: "Medium",
        category: "array",
        level: 2,
        group: "Array Algorithms",
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
        id: "selection-sort",
        title: "Selection Sort",
        difficulty: "Medium",
        category: "array",
        level: 2,
        group: "Array Algorithms",
        description: "Sort array by repeatedly finding minimum and placing it at the beginning.",
        expectedBehavior: "Array should be sorted in ascending order.",
        input: [64, 25, 12, 22, 11],
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        for(int i=0;i<arr.length-1;i++){
            int minIdx = i;
            for(int j=i+1;j<arr.length;j++){
                if(arr[j] < arr[minIdx]){
                    minIdx = j;
                }
            }
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
`,
        validate({ finalState, input }) {
            const expected = sortedCopy(input);
            if (!arraysEqual(finalState.arr, expected)) {
                return fail(`Expected sorted array [${expected.join(", ")}].`);
            }
            return ok("Success: selection sort completed.");
        },
    },
    {
        id: "linear-search",
        title: "Linear Search",
        difficulty: "Easy",
        category: "array",
        level: 1,
        group: "Array Basics",
        description: "Search for target value 22 in the array. Store index in found.",
        expectedBehavior: "found should contain the index of target, or -1 if not found.",
        input: [10, 15, 22, 30, 45],
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int target = 22;
        int found = -1;
        for(int i=0;i<arr.length;i++){
            if(arr[i] == target){
                found = i;
            }
        }
`,
        validate({ finalState }) {
            if (finalState.variables.found !== 2) {
                return fail(`Expected found = 2 (index of 22).`);
            }
            return ok("Success: found target value.");
        },
    },
    {
        id: "binary-search",
        title: "Binary Search",
        difficulty: "Hard",
        category: "array",
        level: 3,
        group: "Array Algorithms",
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
    {
        id: "reverse-array",
        title: "Reverse Array In-Place",
        difficulty: "Medium",
        category: "array",
        level: 2,
        group: "Array Algorithms",
        description: "Reverse the array by swapping elements from both ends.",
        expectedBehavior: "Array should be reversed in-place.",
        input: [1, 2, 3, 4, 5],
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int left = 0;
        int right = arr.length - 1;
        for(int i=0;i<arr.length/2;i++){
            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left = left + 1;
            right = right - 1;
        }
`,
        validate({ finalState, input }) {
            const expected = [...input].reverse();
            if (!arraysEqual(finalState.arr, expected)) {
                return fail(`Expected reversed array [${expected.join(", ")}].`);
            }
            return ok("Success: array reversed correctly.");
        },
    },
    {
        id: "find-second-largest",
        title: "Find Second Largest",
        difficulty: "Medium",
        category: "array",
        level: 2,
        group: "Array Algorithms",
        description: "Find the second largest element in the array.",
        expectedBehavior: "secondMax should contain the second largest value.",
        input: [12, 35, 1, 10, 34, 1],
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int max = arr[0];
        int secondMax = -1;
        for(int i=1;i<arr.length;i++){
            if(arr[i] > max){
                secondMax = max;
                max = arr[i];
            } else {
                if(arr[i] > secondMax){
                    if(arr[i] < max){
                        secondMax = arr[i];
                    }
                }
            }
        }
`,
        validate({ finalState }) {
            if (finalState.variables.secondMax !== 34) {
                return fail(`Expected secondMax = 34.`);
            }
            return ok("Success: found second largest element.");
        },
    },
    {
        id: "array-rotation",
        title: "Rotate Array Left",
        difficulty: "Hard",
        category: "array",
        level: 3,
        group: "Array Algorithms",
        description: "Rotate array left by 2 positions. First element becomes third.",
        expectedBehavior: "Array should be rotated left by 2 positions.",
        input: [1, 2, 3, 4, 5],
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int temp0 = arr[0];
        int temp1 = arr[1];
        for(int i=0;i<arr.length-2;i++){
            arr[i] = arr[i+2];
        }
        arr[arr.length-2] = temp0;
        arr[arr.length-1] = temp1;
`,
        validate({ finalState }) {
            const expected = [3, 4, 5, 1, 2];
            if (!arraysEqual(finalState.arr, expected)) {
                return fail(`Expected [${expected.join(", ")}].`);
            }
            return ok("Success: array rotated correctly.");
        },
    },
    {
        id: "remove-duplicates",
        title: "Count Unique Elements",
        difficulty: "Medium",
        category: "array",
        level: 2,
        group: "Array Algorithms",
        description: "Count unique elements in sorted array.",
        expectedBehavior: "unique should contain count of distinct elements.",
        input: [1, 1, 2, 2, 3, 4, 4, 5],
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int unique = 1;
        for(int i=1;i<arr.length;i++){
            if(arr[i] > arr[i-1]){
                unique = unique + 1;
            }
        }
`,
        validate({ finalState }) {
            if (finalState.variables.unique !== 5) {
                return fail(`Expected unique = 5.`);
            }
            return ok("Success: counted unique elements.");
        },
    },

    // ==================== LINKEDLIST BASICS (Level 1) ====================
    {
        id: "linkedlist-traversal",
        title: "Traverse Linked List",
        difficulty: "Easy",
        category: "linkedlist",
        level: 1,
        group: "LinkedList Basics",
        listType: "singly",
        description: "Traverse the singly linked list and compute the sum of all node values.",
        expectedBehavior: "Visit all nodes using next pointers and calculate total sum.",
        input: [5, 3, 8, 1],
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
                return fail(`Expected total = ${sum}.`);
            }
            return ok("Success: traversed all nodes and computed correct sum.");
        },
    },
    {
        id: "linkedlist-find-max",
        title: "Find Maximum in Linked List",
        difficulty: "Easy",
        category: "linkedlist",
        level: 1,
        group: "LinkedList Basics",
        listType: "singly",
        description: "Find the maximum value in the linked list.",
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
                if(node1_val > max){ max = node1_val; }
                current = node1_next;
            }
            if(current == 2){
                if(node2_val > max){ max = node2_val; }
                current = node2_next;
            }
            if(current == 3){
                if(node3_val > max){ max = node3_val; }
                current = node3_next;
            }
            if(current == 4){
                if(node4_val > max){ max = node4_val; }
                current = node4_next;
            }
        }
`,
        validate({ finalState, input }) {
            const expected = Math.max(...input);
            if (finalState.variables.max !== expected) {
                return fail(`Expected max = ${expected}.`);
            }
            return ok("Success: found the maximum value.");
        },
    },
    {
        id: "linkedlist-count-nodes",
        title: "Count Linked List Nodes",
        difficulty: "Easy",
        category: "linkedlist",
        level: 1,
        group: "LinkedList Basics",
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
            if(current == 0){ current = node0_next; }
            if(current == 1){ current = node1_next; }
            if(current == 2){ current = node2_next; }
            if(current == 3){ current = node3_next; }
            if(current == 4){ current = node4_next; }
        }
`,
        validate({ finalState, input }) {
            if (finalState.variables.count !== input.length) {
                return fail(`Expected count = ${input.length}.`);
            }
            return ok("Success: counted all nodes correctly.");
        },
    },
    // ==================== LINKEDLIST ADVANCED (Level 2-3) ====================
    {
        id: "linkedlist-search",
        title: "Search in Linked List",
        difficulty: "Medium",
        category: "linkedlist",
        level: 2,
        group: "LinkedList Advanced",
        listType: "singly",
        description: "Search for value 30. Store the position in 'found'.",
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
                if(node0_val == target){ found = position; }
                current = node0_next;
            }
            if(current == 1){
                if(node1_val == target){ found = position; }
                current = node1_next;
            }
            if(current == 2){
                if(node2_val == target){ found = position; }
                current = node2_next;
            }
            if(current == 3){
                if(node3_val == target){ found = position; }
                current = node3_next;
            }
            position = position + 1;
        }
`,
        validate({ finalState }) {
            if (finalState.variables.found !== 2) {
                return fail(`Expected found = 2 (index of value 30).`);
            }
            return ok("Success: found the target value at correct position.");
        },
    },
    {
        id: "doubly-linkedlist-traversal",
        title: "Doubly Linked List Traversal",
        difficulty: "Medium",
        category: "linkedlist",
        level: 2,
        group: "LinkedList Advanced",
        listType: "doubly",
        description: "Traverse a doubly linked list forward and compute sum.",
        expectedBehavior: "Use node structure with next pointers to traverse.",
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
        level: 3,
        group: "LinkedList Advanced",
        listType: "circular",
        description: "Traverse a circular linked list exactly once and compute sum.",
        expectedBehavior: "Use counter to stop after visiting all nodes once.",
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
        validate({ finalState, input }) {
            const sum = input.reduce((acc, value) => acc + value, 0);
            if (finalState.variables.total !== sum) {
                return fail(`Expected total = ${sum}.`);
            }
            return ok("Success: traversed circular list exactly once.");
        },
    },

    // ==================== STACK BASICS (Level 1) ====================
    {
        id: "stack-push-pop",
        title: "Stack Push and Pop Operations",
        difficulty: "Easy",
        category: "stack",
        level: 1,
        group: "Stack Basics",
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
            if(top == 0){ stack0 = arr[i]; }
            if(top == 1){ stack1 = arr[i]; }
            if(top == 2){ stack2 = arr[i]; }
        }
        
        int sum = 0;
        for(int i=0; i<arr.length; i++){
            if(top == 2){ sum = sum + stack2; }
            if(top == 1){ sum = sum + stack1; }
            if(top == 0){ sum = sum + stack0; }
            top = top - 1;
        }
`,
        validate({ finalState, input }) {
            const expected = input.reduce((acc, val) => acc + val, 0);
            if (finalState.variables.sum !== expected) {
                return fail(`Expected sum = ${expected}.`);
            }
            if (finalState.variables.top !== -1) {
                return fail(`Stack should be empty (top = -1).`);
            }
            return ok("Success: pushed all elements and popped to compute sum.");
        },
    },
    {
        id: "stack-peek",
        title: "Stack Peek Operation",
        difficulty: "Easy",
        category: "stack",
        level: 1,
        group: "Stack Basics",
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
            if(top == 0){ stack0 = arr[i]; }
            if(top == 1){ stack1 = arr[i]; }
            if(top == 2){ stack2 = arr[i]; }
            if(top == 3){ stack3 = arr[i]; }
        }
        
        int topElement = 0;
        if(top == 3){ topElement = stack3; }
`,
        validate({ finalState }) {
            if (finalState.variables.topElement !== 35) {
                return fail(`Expected topElement = 35.`);
            }
            if (finalState.variables.top !== 3) {
                return fail(`Stack top should remain at 3.`);
            }
            return ok("Success: peeked at top element without modifying stack.");
        },
    },
    {
        id: "stack-is-empty",
        title: "Stack isEmpty Check",
        difficulty: "Easy",
        category: "stack",
        level: 1,
        group: "Stack Basics",
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
        if(top == -1){ emptyBefore = 1; }
        
        for(int i=0; i<arr.length; i++){
            top = top + 1;
            if(top == 0){ stack0 = arr[i]; }
            if(top == 1){ stack1 = arr[i]; }
        }
        
        for(int i=0; i<arr.length; i++){
            top = top - 1;
        }
        
        int emptyAfter = 0;
        if(top == -1){ emptyAfter = 1; }
`,
        validate({ finalState }) {
            if (finalState.variables.emptyBefore !== 1) {
                return fail(`Expected emptyBefore = 1.`);
            }
            if (finalState.variables.emptyAfter !== 1) {
                return fail(`Expected emptyAfter = 1.`);
            }
            return ok("Success: correctly checked empty status.");
        },
    },
    // ==================== STACK APPLICATIONS (Level 2-3) ====================
    {
        id: "stack-reverse",
        title: "Reverse Array using Stack",
        difficulty: "Medium",
        category: "stack",
        level: 2,
        group: "Stack Applications",
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
            if(top == 0){ stack0 = arr[i]; }
            if(top == 1){ stack1 = arr[i]; }
            if(top == 2){ stack2 = arr[i]; }
            if(top == 3){ stack3 = arr[i]; }
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
                return fail(`Expected first popped = 4.`);
            }
            if (finalState.variables.second !== 3) {
                return fail(`Expected second popped = 3.`);
            }
            return ok("Success: stack reversed the order correctly.");
        },
    },
    {
        id: "stack-min-element",
        title: "Track Minimum in Stack",
        difficulty: "Hard",
        category: "stack",
        level: 3,
        group: "Stack Applications",
        description: "Push elements and track the minimum value seen so far.",
        expectedBehavior: "Maintain minVal variable while pushing elements.",
        input: [5, 2, 8, 1, 9],
        stackData: {
            values: [5, 2, 8, 1, 9],
            maxSize: 10,
        },
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int stack0 = 0;
        int stack1 = 0;
        int stack2 = 0;
        int stack3 = 0;
        int stack4 = 0;
        int top = -1;
        int minVal = arr[0];
        
        for(int i=0; i<arr.length; i++){
            top = top + 1;
            if(top == 0){ stack0 = arr[i]; }
            if(top == 1){ stack1 = arr[i]; }
            if(top == 2){ stack2 = arr[i]; }
            if(top == 3){ stack3 = arr[i]; }
            if(top == 4){ stack4 = arr[i]; }
            
            if(arr[i] < minVal){
                minVal = arr[i];
            }
        }
`,
        validate({ finalState }) {
            if (finalState.variables.minVal !== 1) {
                return fail(`Expected minVal = 1.`);
            }
            return ok("Success: tracked minimum value correctly.");
        },
    },
    // ==================== QUEUE BASICS (Level 1) ====================
    {
        id: "queue-enqueue-dequeue",
        title: "Queue Enqueue and Dequeue",
        difficulty: "Easy",
        category: "queue",
        level: 1,
        group: "Queue Basics",
        description: "Enqueue elements then dequeue and sum them.",
        expectedBehavior: "Use front and rear pointers for queue operations.",
        input: [10, 20, 30],
        queueData: {
            values: [10, 20, 30],
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
            if(rear == 0){ queue0 = arr[i]; }
            if(rear == 1){ queue1 = arr[i]; }
            if(rear == 2){ queue2 = arr[i]; }
        }
        
        int sum = 0;
        for(int i=0; i<arr.length; i++){
            if(front == 0){ sum = sum + queue0; }
            if(front == 1){ sum = sum + queue1; }
            if(front == 2){ sum = sum + queue2; }
            front = front + 1;
        }
`,
        validate({ finalState, input }) {
            const expected = input.reduce((acc, val) => acc + val, 0);
            if (finalState.variables.sum !== expected) {
                return fail(`Expected sum = ${expected}.`);
            }
            return ok("Success: enqueued and dequeued all elements.");
        },
    },
    {
        id: "queue-peek-front",
        title: "Queue Peek Front",
        difficulty: "Easy",
        category: "queue",
        level: 1,
        group: "Queue Basics",
        description: "Peek at the front element without removing it.",
        expectedBehavior: "Access front element using front pointer.",
        input: [100, 200, 300, 400],
        queueData: {
            values: [100, 200, 300, 400],
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
            if(rear == 0){ queue0 = arr[i]; }
            if(rear == 1){ queue1 = arr[i]; }
            if(rear == 2){ queue2 = arr[i]; }
            if(rear == 3){ queue3 = arr[i]; }
        }
        
        int frontElement = 0;
        if(front == 0){ frontElement = queue0; }
`,
        validate({ finalState }) {
            if (finalState.variables.frontElement !== 100) {
                return fail(`Expected frontElement = 100.`);
            }
            return ok("Success: peeked at front element.");
        },
    },
    {
        id: "queue-is-empty",
        title: "Queue isEmpty Check",
        difficulty: "Easy",
        category: "queue",
        level: 1,
        group: "Queue Basics",
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
        if(front > rear){ emptyBefore = 1; }
        
        for(int i=0; i<arr.length; i++){
            rear = rear + 1;
            if(rear == 0){ queue0 = arr[i]; }
            if(rear == 1){ queue1 = arr[i]; }
        }
        
        for(int i=0; i<arr.length; i++){
            front = front + 1;
        }
        
        int emptyAfter = 0;
        if(front > rear){ emptyAfter = 1; }
`,
        validate({ finalState }) {
            if (finalState.variables.emptyBefore !== 1) {
                return fail(`Expected emptyBefore = 1.`);
            }
            if (finalState.variables.emptyAfter !== 1) {
                return fail(`Expected emptyAfter = 1.`);
            }
            return ok("Success: correctly checked empty status.");
        },
    },
    // ==================== QUEUE APPLICATIONS (Level 2-3) ====================
    {
        id: "queue-front-rear",
        title: "Queue Front and Rear Access",
        difficulty: "Medium",
        category: "queue",
        level: 2,
        group: "Queue Applications",
        description: "Access both front and rear elements of the queue.",
        expectedBehavior: "Get first and last elements using front and rear pointers.",
        input: [10, 20, 30, 40, 50],
        queueData: {
            values: [10, 20, 30, 40, 50],
            maxSize: 10,
        },
        template: `static void solve(int[] arr){\n    // write your code here\n}`,
        starterCode: `        int queue0 = 0;
        int queue1 = 0;
        int queue2 = 0;
        int queue3 = 0;
        int queue4 = 0;
        int front = 0;
        int rear = -1;
        
        for(int i=0; i<arr.length; i++){
            rear = rear + 1;
            if(rear == 0){ queue0 = arr[i]; }
            if(rear == 1){ queue1 = arr[i]; }
            if(rear == 2){ queue2 = arr[i]; }
            if(rear == 3){ queue3 = arr[i]; }
            if(rear == 4){ queue4 = arr[i]; }
        }
        
        int frontVal = 0;
        int rearVal = 0;
        if(front == 0){ frontVal = queue0; }
        if(rear == 4){ rearVal = queue4; }
`,
        validate({ finalState }) {
            if (finalState.variables.frontVal !== 10) {
                return fail(`Expected frontVal = 10.`);
            }
            if (finalState.variables.rearVal !== 50) {
                return fail(`Expected rearVal = 50.`);
            }
            return ok("Success: accessed front and rear correctly.");
        },
    },
    {
        id: "queue-size",
        title: "Calculate Queue Size",
        difficulty: "Medium",
        category: "queue",
        level: 2,
        group: "Queue Applications",
        description: "Calculate the number of elements in the queue.",
        expectedBehavior: "Size = rear - front + 1 when queue is not empty.",
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
            if(rear == 0){ queue0 = arr[i]; }
            if(rear == 1){ queue1 = arr[i]; }
            if(rear == 2){ queue2 = arr[i]; }
            if(rear == 3){ queue3 = arr[i]; }
        }
        
        int size = 0;
        if(rear >= front){
            size = rear - front + 1;
        }
`,
        validate({ finalState }) {
            if (finalState.variables.size !== 4) {
                return fail(`Expected size = 4.`);
            }
            return ok("Success: calculated queue size correctly.");
        },
    },
];

// Export questions by ID for easy lookup
export const EXPANDED_QUESTIONS_BY_ID = {};
EXPANDED_QUESTIONS.forEach(q => {
    EXPANDED_QUESTIONS_BY_ID[q.id] = q;
});

// Export questions grouped by level
export const QUESTIONS_BY_LEVEL = {
    1: EXPANDED_QUESTIONS.filter(q => q.level === 1),
    2: EXPANDED_QUESTIONS.filter(q => q.level === 2),
    3: EXPANDED_QUESTIONS.filter(q => q.level === 3),
};

// Export questions grouped by category
export const QUESTIONS_BY_CATEGORY = {
    array: EXPANDED_QUESTIONS.filter(q => q.category === 'array' || !q.category),
    linkedlist: EXPANDED_QUESTIONS.filter(q => q.category === 'linkedlist'),
    stack: EXPANDED_QUESTIONS.filter(q => q.category === 'stack'),
    queue: EXPANDED_QUESTIONS.filter(q => q.category === 'queue'),
};

// Export questions grouped by group name
export const QUESTIONS_BY_GROUP = {};
EXPANDED_QUESTIONS.forEach(q => {
    const group = q.group || 'Ungrouped';
    if (!QUESTIONS_BY_GROUP[group]) {
        QUESTIONS_BY_GROUP[group] = [];
    }
    QUESTIONS_BY_GROUP[group].push(q);
});
