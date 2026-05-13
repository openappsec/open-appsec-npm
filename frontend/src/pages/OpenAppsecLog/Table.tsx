import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";
import type { OpenAppsecLogEntry } from "src/api/backend";
import { TableLayout } from "src/components/Table/TableLayout";
import { buildColumns, type ColumnVariant } from "./columns";

interface Props {
	data: OpenAppsecLogEntry[];
	isFetching?: boolean;
	variant: ColumnVariant;
	onSelectRow: (entry: OpenAppsecLogEntry) => void;
}

export default function Table({ data, isFetching, variant, onSelectRow }: Props) {
	const columns = useMemo(
		() => buildColumns({ variant, onSelectRow }),
		[variant, onSelectRow],
	);

	const tableInstance = useReactTable<OpenAppsecLogEntry>({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
		rowCount: data.length,
		meta: { isFetching },
		enableSortingRemoval: false,
	});

	return <TableLayout tableInstance={tableInstance} />;
}
