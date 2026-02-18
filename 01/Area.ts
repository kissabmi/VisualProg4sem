// в джаве получше кнш будет
function calculateArea(shape: "circle", radius: number): number;
function calculateArea(shape: "square", side: number): number;

function calculateArea(shape: "circle" | "square", param1: number): number {
	if (shape === "circle") {
		return Math.PI * param1 ** 2;
	} else {
		return param1 ** 2;
	}
}
console.log(calculateArea("circle", 1));
console.log(calculateArea("square", 25));
