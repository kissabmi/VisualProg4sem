type Status = "active" | "inactive" | "new";

function getStatusColor(status: Status): string {
	switch (status) {
		case "active":
			return "blue";
		case "inactive":
			return "black";
		case "new":
			return "gold";
	}
}

console.log(getStatusColor("active"));
console.log(getStatusColor("new"));
