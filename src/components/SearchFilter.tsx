import type { FilterType } from "../task";

interface SearchFilterProps {
	search: string;
	onSearchChange: (value: string) => void;
	filter: FilterType;
	onFilterChange: (filter: FilterType) => void;
}

export function SearchFilter({
	search,
	onSearchChange,
	filter,
	onFilterChange,
}: SearchFilterProps) {
	const filters: { key: FilterType; label: string }[] = [
		{ key: "all", label: "все" },
		{ key: "done", label: "выполненные" },
		{ key: "notDone", label: "невыполненные" },
	];

	return (
		<div className="search-filters">
			<div>
				<input
					type="text"
					placeholder="поиск по названию или описанию..."
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
				/>
			</div>
			<div className="filter-buttons">
				{filters.map((f) => (
					<button
						key={f.key}
						style={{ fontWeight: filter === f.key ? "bold" : "normal" }}
						onClick={() => onFilterChange(f.key)}
					>
						{f.label}
					</button>
				))}
			</div>
		</div>
	);
}
