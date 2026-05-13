import cn from "classnames";

const colorForSeverity = (severity: string | undefined | null): string => {
	switch ((severity ?? "").trim().toLowerCase()) {
		case "critical":
			return "red";
		case "high":
			return "orange";
		case "medium":
			return "yellow";
		case "low":
			return "azure";
		case "info":
			return "cyan";
		default:
			return "secondary";
	}
};

interface Props {
	value: string | undefined | null;
}

/**
 * Renders an open-appsec event severity as a coloured Tabler badge. Case
 * insensitive; "Critical"/"critical" both work.
 */
export function SeverityFormatter({ value }: Props) {
	const color = colorForSeverity(value);
	const label = value && value.trim().length > 0 ? value : "—";
	return <span className={cn("badge", `bg-${color}-lt`)}>{label}</span>;
}
