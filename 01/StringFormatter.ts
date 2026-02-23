type StringFormatter = (str: string, uppercase?: boolean) => string; //типо как функцион интерфейс в java

export const capitalizeFirst: StringFormatter = (str, uppercase = false) => {
	const result = str[0].toUpperCase() + str.slice(1);
	return uppercase ? result.toUpperCase() : result;
};

export const spaceDelete: StringFormatter = (str, uppercase = false) => {
	const result = str.trim();
	return uppercase ? result.toUpperCase() : result;
};

console.log(capitalizeFirst("hello"));
console.log(spaceDelete("  world  ", true));
