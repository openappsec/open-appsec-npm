import type { OpenAppsecLogEntry } from "src/api/backend";
import TableWrapper from "../TableWrapper";

// Mirrors the original fork's filter: case-insensitive match on
// eventLevel === "action item". Falls back to a `source` match so we
// still surface entries from a `*notification*.log` file even if the
// eventLevel field is empty.
const isNotification = (entry: OpenAppsecLogEntry): boolean => {
	const level = (entry.eventLevel ?? "").trim().toLowerCase();
	if (level === "action item") return true;
	const source = (entry.source ?? "").toLowerCase();
	return source.includes("notification");
};

export default function Notifications() {
	return <TableWrapper variant="summary" filter={isNotification} />;
}
