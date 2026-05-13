import CodeEditor from "@uiw/react-textarea-code-editor";
import EasyModal, { type InnerModalProps } from "ez-modal-react";
import Modal from "react-bootstrap/Modal";
import type { OpenAppsecLogEntry } from "src/api/backend";
import { Button, DateFormatter, SeverityFormatter } from "src/components";
import { T } from "src/locale";

const showOpenAppsecLogDetailsModal = (entry: OpenAppsecLogEntry) => {
	EasyModal.show(OpenAppsecLogDetailsModal, { entry });
};

interface Props extends InnerModalProps {
	entry: OpenAppsecLogEntry;
}

// Flat list of the wrapper fields we want to surface as a key/value table.
// The full original payload is shown separately as JSON underneath.
const FIELD_KEYS: Array<keyof OpenAppsecLogEntry> = [
	"eventTime",
	"eventSeverity",
	"eventPriority",
	"eventLevel",
	"eventName",
	"eventTopic",
	"serviceName",
	"assetName",
	"securityAction",
	"waapIncidentType",
	"httpSourceId",
	"sourceIP",
	"proxyIP",
	"httpHostName",
	"httpMethod",
	"httpUriPath",
	"matchedLocation",
	"matchedParameter",
	"matchedSample",
	"source",
];

const renderValue = (key: keyof OpenAppsecLogEntry, value: unknown): React.ReactNode => {
	if (value === null || value === undefined || value === "") {
		return <span className="text-secondary">—</span>;
	}
	if (key === "eventTime" && typeof value === "string") {
		return <DateFormatter value={value} />;
	}
	if (key === "eventSeverity" && typeof value === "string") {
		return <SeverityFormatter value={value} />;
	}
	return <span className="text-break">{String(value)}</span>;
};

const OpenAppsecLogDetailsModal = EasyModal.create(({ entry, visible, remove }: Props) => {
	return (
		<Modal show={visible} onHide={remove} size="lg">
			<Modal.Header closeButton>
				<Modal.Title>
					<T id="openappsec-log.details.title" />
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="table-responsive mb-3">
					<table className="table table-sm table-vcenter mb-0">
						<tbody>
							{FIELD_KEYS.map((key) => (
								<tr key={key}>
									<th
										className="text-secondary text-nowrap"
										style={{ width: "12rem" }}
									>
										{key}
									</th>
									<td>{renderValue(key, entry[key])}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<h4>
					<T id="openappsec-log.details.raw" />
				</h4>
				<CodeEditor
					language="json"
					padding={15}
					data-color-mode="dark"
					minHeight={200}
					indentWidth={2}
					style={{
						fontFamily:
							"ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
						borderRadius: "0.3rem",
						minHeight: "200px",
						backgroundColor: "var(--tblr-bg-surface-dark)",
					}}
					readOnly
					value={JSON.stringify(entry.meta ?? {}, null, 2)}
				/>
			</Modal.Body>
			<Modal.Footer>
				<Button data-bs-dismiss="modal" onClick={remove}>
					<T id="action.close" />
				</Button>
			</Modal.Footer>
		</Modal>
	);
});

export { showOpenAppsecLogDetailsModal };
