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
];

export const QUESTIONS_BY_ID = Object.fromEntries(QUESTIONS.map((question) => [question.id, question]));