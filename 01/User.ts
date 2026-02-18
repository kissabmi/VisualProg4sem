interface User {
	id: number;
	name: string;
	email?: string;
	isActive: boolean; //живой типо?
}

function createUser(id: number, name: string, email?: string): User {
	return {
		id,
		name,
		email,
		isActive: true,
	};
}

const me = createUser(1, "Gleb");
const girlfriend = createUser(2, "Alisa", "alisabaiseva59@gmail.com");
console.log(me);
console.log(girlfriend.isActive);
