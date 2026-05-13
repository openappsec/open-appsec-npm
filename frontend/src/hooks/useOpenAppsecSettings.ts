import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getOpenAppsecSettings,
	type OpenAppsecLocalPolicy,
	type OpenAppsecSettingsUpdate,
	updateOpenAppsecSettings,
} from "src/api/backend";

const QUERY_KEY = ["openappsec-settings"];

const useOpenAppsecSettings = (options = {}) => {
	return useQuery<OpenAppsecLocalPolicy, Error>({
		queryKey: QUERY_KEY,
		queryFn: () => getOpenAppsecSettings(),
		staleTime: 60 * 1000, // 1 minute
		...options,
	});
};

const useSetOpenAppsecSettings = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (values: OpenAppsecSettingsUpdate) => updateOpenAppsecSettings(values),
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
		},
	});
};

export { useOpenAppsecSettings, useSetOpenAppsecSettings };
