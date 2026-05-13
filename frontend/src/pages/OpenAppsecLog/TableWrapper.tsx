import { useCallback, useMemo } from "react";
import Alert from "react-bootstrap/Alert";
import type { OpenAppsecLogEntry } from "src/api/backend";
import { LoadingPage } from "src/components";
import { useOpenAppsecLogs } from "src/hooks";
import { showOpenAppsecLogDetailsModal } from "src/modals";
import type { ColumnVariant } from "./columns";
import Table from "./Table";

interface Props {
	variant: ColumnVariant;
	/** Optional client-side filter applied to the raw log array. */
	filter?: (entry: OpenAppsecLogEntry) => boolean;
}

export default function TableWrapper({ variant, filter }: Props) {
	const { isFetching, isLoading, isError, error, data } = useOpenAppsecLogs();

	const rows = useMemo(() => {
		if (!data) return [];
		const filtered = filter ? data.filter(filter) : data;
		// Sort by eventTime descending; entries with an unparseable timestamp
		// fall to the bottom.
		return [...filtered].sort((a, b) => {
			const ta = Date.parse(a.eventTime);
			const tb = Date.parse(b.eventTime);
			const va = Number.isFinite(ta) ? ta : Number.NEGATIVE_INFINITY;
			const vb = Number.isFinite(tb) ? tb : Number.NEGATIVE_INFINITY;
			return vb - va;
		});
	}, [data, filter]);

	const handleSelectRow = useCallback((entry: OpenAppsecLogEntry) => {
		showOpenAppsecLogDetailsModal(entry);
	}, []);

	if (isLoading) {
		return <LoadingPage />;
	}

	if (isError) {
		return <Alert variant="danger">{error?.message || "Unknown error"}</Alert>;
	}

	return (
		<Table
			data={rows}
			isFetching={isFetching}
			variant={variant}
			onSelectRow={handleSelectRow}
		/>
	);
}
