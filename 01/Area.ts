// в джаве получше кнш будет
export function calculateArea(shape: "circle", radius: number): number;
export function calculateArea(shape: "square", side: number): number;

export function calculateArea(
	shape: "circle" | "square",
	param1: number,
): number {
	if (shape === "circle") {
		return Math.PI * param1 ** 2;
	} else {
		return param1 ** 2;
	}
}
console.log(calculateArea("circle", 1));
console.log(calculateArea("square", 25));
