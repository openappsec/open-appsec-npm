import type { OpenAppsecLogEntry } from "src/api/backend";
import TableWrapper from "../TableWrapper";

// Event names that the original fork's `frontend/js/app/openappsec-log/main.js`
// excluded from its "All Events" tab. They are telemetry noise rather than
// security-relevant entries, so we mirror that behaviour here. The Detailed
// tab continues to show everything for power users.
const TELEMETRY_EVENT_NAMES = new Set([
	"waap telemetry",
	"waap attack type telemetry",
	"ips stats",
]);

function filterAll(entry: OpenAppsecLogEntry): boolean {
	return !TELEMETRY_EVENT_NAMES.has((entry.eventName ?? "").trim().toLowerCase());
}

export default function All() {
	return <TableWrapper variant="summary" filter={filterAll} />;
}
