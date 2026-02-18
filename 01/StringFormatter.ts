type StringFormatter = (str: string, uppercase?: boolean) => string;

const capitalizeFirst: StringFormatter = (str, uppercase = false) => {
	const result = str[0].toUpperCase() + str.slice(1);
	return uppercase ? result.toUpperCase() : result;
};

const spaceDelete: StringFormatter = (str, uppercase = false) => {
	const result = str.trim();
	return uppercase ? result.toUpperCase() : result;
};

console.log(capitalizeFirst("hello"));
console.log(spaceDelete("  world  ", true));
