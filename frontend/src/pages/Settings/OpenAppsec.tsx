import CodeEditor from "@uiw/react-textarea-code-editor";
import { Field, Form, Formik } from "formik";
import { type ReactNode, useState } from "react";
import { Alert } from "react-bootstrap";
import { Button, Loading } from "src/components";
import { useOpenAppsecSettings, useSetOpenAppsecSettings } from "src/hooks";
import { T } from "src/locale";
import { showObjectSuccess } from "src/notifications";

interface FormValues {
	localPolicy: string;
}

export default function OpenAppsec() {
	const { data, isLoading, error } = useOpenAppsecSettings();
	const { mutate: setOpenAppsec } = useSetOpenAppsecSettings();
	const [errorMsg, setErrorMsg] = useState<ReactNode | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const onSubmit = async (values: FormValues, { setSubmitting }: any) => {
		if (isSubmitting) return;
		setIsSubmitting(true);
		setErrorMsg(null);

		setOpenAppsec(
			{ localPolicy: values.localPolicy },
			{
				onError: (err: Error) => setErrorMsg(<T id={err.message} />),
				onSuccess: () => {
					showObjectSuccess("settings.openappsec.title", "saved");
				},
				onSettled: () => {
					setIsSubmitting(false);
					setSubmitting(false);
				},
			},
		);
	};

	if (!isLoading && error) {
		return (
			<div className="card-body">
				<div className="mb-3">
					<Alert variant="danger" show>
						{error.message}
					</Alert>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="card-body">
				<div className="mb-3">
					<Loading noLogo />
				</div>
			</div>
		);
	}

	return (
		<Formik
			initialValues={{ localPolicy: data ?? "" } as FormValues}
			onSubmit={onSubmit}
		>
			{() => (
				<Form>
					<div className="card-body">
						<Alert
							variant="danger"
							show={!!errorMsg}
							onClose={() => setErrorMsg(null)}
							dismissible
						>
							{errorMsg}
						</Alert>
						<div className="mb-3">
							<label className="form-label" htmlFor="openappsec-local-policy">
								<T id="settings.openappsec.local-policy" />
							</label>
							<p className="text-secondary small mb-2">
								<T id="settings.openappsec.local-policy.description" />
							</p>
							<Field name="localPolicy">
								{({ field }: any) => (
									<CodeEditor
										id="openappsec-local-policy"
										language="yaml"
										padding={15}
										data-color-mode="dark"
										minHeight={300}
										indentWidth={2}
										style={{
											fontFamily:
												"ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
											borderRadius: "0.3rem",
											minHeight: "300px",
											backgroundColor: "var(--tblr-bg-surface-dark)",
										}}
										{...field}
									/>
								)}
							</Field>
						</div>
					</div>
					<div className="card-footer bg-transparent mt-auto">
						<div className="btn-list justify-content-end">
							<Button
								type="submit"
								actionType="primary"
								className="ms-auto bg-teal"
								isLoading={isSubmitting}
								disabled={isSubmitting}
							>
								<T id="settings.openappsec.save" />
							</Button>
						</div>
					</div>
				</Form>
			)}
		</Formik>
	);
}
