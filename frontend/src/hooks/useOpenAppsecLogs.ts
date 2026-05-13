import { useQuery } from "@tanstack/react-query";
import { getOpenAppsecLogs, type OpenAppsecLogEntry } from "src/api/backend";

const fetchOpenAppsecLogs = () => {
	return getOpenAppsecLogs();
};

const useOpenAppsecLogs = (options = {}) => {
	return useQuery<OpenAppsecLogEntry[], Error>({
		queryKey: ["openappsec-logs"],
		queryFn: fetchOpenAppsecLogs,
		staleTime: 10 * 1000,
		...options,
	});
};

export { fetchOpenAppsecLogs, useOpenAppsecLogs };
