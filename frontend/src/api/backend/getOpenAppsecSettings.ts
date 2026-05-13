import * as api from "./base";

/**
 * Raw open-appsec local policy YAML content.
 *
 * The backend reads `/ext/appsec/local_policy.yaml` and returns its
 * contents as a JSON-encoded string. Callers are responsible for
 * parsing the YAML if they need structured access.
 */
export type OpenAppsecLocalPolicy = string;

export async function getOpenAppsecSettings(): Promise<OpenAppsecLocalPolicy> {
	return await api.get({
		url: "/openappsec-settings",
	});
}
