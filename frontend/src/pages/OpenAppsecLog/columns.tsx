import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import type { OpenAppsecLogEntry } from "src/api/backend";
import { DateFormatter, SeverityFormatter } from "src/components";
import { intl, T } from "src/locale";

export type ColumnVariant = "summary" | "detailed";

interface BuildColumnsOptions {
	variant: ColumnVariant;
	onSelectRow: (index: number) => void;
}

const columnHelper = createColumnHelper<OpenAppsecLogEntry>();

const renderText = (value: unknown): React.ReactNode => {
	if (value === null || value === undefined || value === "") {
		return <span className="text-secondary">—</span>;
	}
	return String(value);
};

const detailsButton = (rowIndex: number, onSelectRow: (i: number) => void) => (
	<button
		type="button"
		className="btn btn-action btn-sm px-1"
		onClick={(e) => {
			e.preventDefault();
			onSelectRow(rowIndex);
		}}
	>
		<T id="openappsec-log.col.details" />
	</button>
);

export function buildColumns({
	variant,
	onSelectRow,
}: BuildColumnsOptions): ColumnDef<OpenAppsecLogEntry, any>[] {
	const summary: ColumnDef<OpenAppsecLogEntry, any>[] = [
		columnHelper.accessor((row) => row.eventTime, {
			id: "eventTime",
			header: intl.formatMessage({ id: "openappsec-log.col.time" }),
			cell: (info) => {
				const value = info.getValue() as string | undefined;
				return value ? <DateFormatter value={value} /> : renderText(value);
			},
			meta: { className: "text-nowrap" },
		}),
		columnHelper.accessor((row) => row.eventSeverity, {
			id: "eventSeverity",
			header: intl.formatMessage({ id: "openappsec-log.col.severity" }),
			cell: (info) => <SeverityFormatter value={info.getValue() as string} />,
			meta: { className: "text-nowrap" },
		}),
		columnHelper.accessor((row) => row.serviceName, {
			id: "serviceName",
			header: intl.formatMessage({ id: "openappsec-log.col.service" }),
			cell: (info) => renderText(info.getValue()),
		}),
		columnHelper.accessor((row) => row.sourceIP, {
			id: "sourceIP",
			header: intl.formatMessage({ id: "openappsec-log.col.source-ip" }),
			cell: (info) => renderText(info.getValue()),
			meta: { className: "text-nowrap" },
		}),
		columnHelper.accessor((row) => row.httpHostName, {
			id: "httpHostName",
			header: intl.formatMessage({ id: "openappsec-log.col.host" }),
			cell: (info) => renderText(info.getValue()),
		}),
		columnHelper.accessor((row) => row.httpMethod, {
			id: "httpMethod",
			header: intl.formatMessage({ id: "openappsec-log.col.method" }),
			cell: (info) => renderText(info.getValue()),
			meta: { className: "text-nowrap" },
		}),
		columnHelper.accessor((row) => row.httpUriPath, {
			id: "httpUriPath",
			header: intl.formatMessage({ id: "openappsec-log.col.uri" }),
			cell: (info) => renderText(info.getValue()),
		}),
		columnHelper.accessor((row) => row.securityAction, {
			id: "securityAction",
			header: intl.formatMessage({ id: "openappsec-log.col.action" }),
			cell: (info) => renderText(info.getValue()),
			meta: { className: "text-nowrap" },
		}),
	];

	const detailedExtras: ColumnDef<OpenAppsecLogEntry, any>[] = [
		columnHelper.accessor((row) => row.eventName, {
			id: "eventName",
			header: intl.formatMessage({ id: "openappsec-log.col.event-name" }),
			cell: (info) => renderText(info.getValue()),
		}),
		columnHelper.accessor((row) => row.waapIncidentType, {
			id: "waapIncidentType",
			header: intl.formatMessage({ id: "openappsec-log.col.incident-type" }),
			cell: (info) => renderText(info.getValue()),
		}),
		columnHelper.accessor((row) => row.matchedLocation, {
			id: "matchedLocation",
			header: intl.formatMessage({ id: "openappsec-log.col.matched-location" }),
			cell: (info) => renderText(info.getValue()),
		}),
		columnHelper.accessor((row) => row.matchedParameter, {
			id: "matchedParameter",
			header: intl.formatMessage({ id: "openappsec-log.col.matched-parameter" }),
			cell: (info) => renderText(info.getValue()),
		}),
		columnHelper.accessor((row) => row.matchedSample, {
			id: "matchedSample",
			header: intl.formatMessage({ id: "openappsec-log.col.matched-sample" }),
			cell: (info) => renderText(info.getValue()),
		}),
	];

	const detailsAction: ColumnDef<OpenAppsecLogEntry, any> = columnHelper.display({
		id: "details",
		header: () => null,
		cell: (info) => detailsButton(info.row.index, onSelectRow),
		meta: { className: "text-end w-1" },
	});

	return variant === "detailed"
		? [...summary, ...detailedExtras, detailsAction]
		: [...summary, detailsAction];
}
