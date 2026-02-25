export function getFirstElement<T>(arr: T[]): T | undefined {
	return arr.length > 0 ? arr[0] : undefined;
}

const numbers = [12, 23, 35];
const strs = ["a", "ы"];

console.log(getFirstElement(numbers));
console.log(getFirstElement(strs));
