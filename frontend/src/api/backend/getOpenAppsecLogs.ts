import * as api from "./base";

/**
 * A single open-appsec log entry as flattened by the backend.
 *
 * The backend reads `*.log*` files from `/var/log/nano_agent`, parses each
 * line as JSON, and wraps it with a handful of useful top-level fields
 * (camelCase, sourced from the open-appsec wire format — NOT from our SQL
 * database). The full original JSON record is preserved under `meta`.
 *
 * Field semantics come from open-appsec itself; refer to its documentation
 * for the canonical descriptions.
 */
export interface OpenAppsecLogEntry {
	/** Source log file basename (e.g. "openappsec-logs", "openappsec-notifications"). */
	source: string;
	/** Full raw log entry from open-appsec. */
	meta: Record<string, unknown>;
	serviceName: string;
	eventPriority: string;
	/** Examples observed: "Critical", "High", "Medium", "Low", "Info". Casing not guaranteed. */
	eventSeverity: string;
	/** Examples observed: "Action Item", "Log". Casing not guaranteed. */
	eventLevel: string;
	/** ISO timestamp from open-appsec. */
	eventTime: string;
	assetName: string;
	securityAction: string;
	waapIncidentType: string;
	httpSourceId: string;
	sourceIP: string;
	proxyIP: string;
	httpHostName: string;
	httpMethod: string;
	httpUriPath: string;
	eventTopic: string;
	matchedLocation: string;
	matchedParameter: string;
	matchedSample: string;
	eventName: string;
}

/**
 * Fetch ALL open-appsec log entries.
 *
 * The backend exposes a single endpoint `GET /api/openappsec-log` that
 * returns every parsed log line from disk as a flat array. No pagination,
 * no filtering, no search query is supported server-side; callers must
 * filter/paginate client-side.
 */
export async function getOpenAppsecLogs(): Promise<OpenAppsecLogEntry[]> {
	return await api.get({
		url: "/openappsec-log",
	});
}
