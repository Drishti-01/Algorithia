export const DEFAULT_INPUT_ARRAY = [5, 3, 8, 1, 4];

export const DEFAULT_USER_CODE = `        for(int i=0;i<arr.length-1;i++){
            if(arr[i] > arr[i+1]){
                int temp = arr[i];
                arr[i] = arr[i+1];
                arr[i+1] = temp;
            }
        }
`;

function formatArrayLiteral(values) {
    return values.join(",");
}

export function createProgramTemplate(inputArray = DEFAULT_INPUT_ARRAY) {
    const prefix = `public class Solution {

    static void solve(int[] arr){
`;

    const suffix = `    }

    public static void main(String[] args){
        int[] arr = {${formatArrayLiteral(inputArray)}};
        solve(arr);
    }
}`;

    return {
        prefix,
        suffix,
        editableStartLine: prefix.split("\n").length,
    };
}

export function buildTemplateCode(prefix, userCode, suffix) {
    return `${prefix}${userCode}${suffix}`;
}

export function lineCount(value) {
    return value.split("\n").length;
}