import * as api from "./base";
import type { OpenAppsecLocalPolicy } from "./getOpenAppsecSettings";

export interface OpenAppsecSettingsUpdate {
	localPolicy: OpenAppsecLocalPolicy;
}

export async function updateOpenAppsecSettings(payload: OpenAppsecSettingsUpdate): Promise<boolean> {
	return await api.put({
		url: "/openappsec-settings",
		data: payload,
	});
}
