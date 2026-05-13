import type { OpenAppsecLogEntry } from "src/api/backend";
import TableWrapper from "../TableWrapper";

// Mirrors the original fork's filter: case-insensitive match on
// "critical" or "high" eventSeverity.
const IMPORTANT_SEVERITIES = new Set(["critical", "high"]);

const isImportant = (entry: OpenAppsecLogEntry): boolean => {
	return IMPORTANT_SEVERITIES.has((entry.eventSeverity ?? "").trim().toLowerCase());
};

export default function Important() {
	return <TableWrapper variant="summary" filter={isImportant} />;
}
