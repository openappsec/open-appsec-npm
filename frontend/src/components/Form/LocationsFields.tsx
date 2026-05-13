import { IconSettings } from "@tabler/icons-react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import cn from "classnames";
import { useFormikContext } from "formik";
import { useState } from "react";
import type { ProxyLocation } from "src/api/backend";
import { intl, T } from "src/locale";
import styles from "./LocationsFields.module.css";

type LocationFieldValue = string | number | boolean;

interface Props {
	initialValues: ProxyLocation[];
	name?: string;
}
export function LocationsFields({ initialValues, name = "locations" }: Props) {
	const [values, setValues] = useState<ProxyLocation[]>(initialValues || []);
	const { setFieldValue } = useFormikContext();
	const [advVisible, setAdvVisible] = useState<number[]>([]);

	const blankItem: ProxyLocation = {
		path: "",
		advancedConfig: "",
		forwardScheme: "http",
		forwardHost: "",
		forwardPort: 80,
		useOpenappsec: false,
		openappsecMode: "detect-learn",
		minimumConfidence: "high",
	};

	const toggleAdvVisible = (idx: number) => {
		setAdvVisible(advVisible.includes(idx) ? advVisible.filter((i) => i !== idx) : [...advVisible, idx]);
	};

	const handleAdd = () => {
		setValues([...values, blankItem]);
	};

	const handleRemove = (idx: number) => {
		const newValues = values.filter((_: ProxyLocation, i: number) => i !== idx);
		setValues(newValues);
		setFormField(newValues);
	};

	const handleChange = (idx: number, field: string, fieldValue: LocationFieldValue) => {
		const newValues = values.map((v: ProxyLocation, i: number) => (i === idx ? { ...v, [field]: fieldValue } : v));
		setValues(newValues);
		setFormField(newValues);
	};

	const setFormField = (newValues: ProxyLocation[]) => {
		const filtered = newValues.filter((v: ProxyLocation) => v?.path?.trim() !== "");
		setFieldValue(name, filtered);
	};

	if (values.length === 0) {
		return (
			<div className="text-center">
				<button type="button" className="btn my-3" onClick={handleAdd}>
					<T id="action.add-location" />
				</button>
			</div>
		);
	}

	return (
		<>
			{values.map((item: ProxyLocation, idx: number) => (
				<div key={idx} className={cn("card", "card-active", "mb-3", styles.locationCard)}>
					<div className="card-body">
						<div className="row">
							<div className="col-md-10">
								<div className="input-group mb-3">
									<span className="input-group-text">Location</span>
									<input
										type="text"
										className="form-control"
										placeholder="/path"
										autoComplete="off"
										value={item.path}
										onChange={(e) => handleChange(idx, "path", e.target.value)}
									/>
								</div>
							</div>
							<div className="col-md-2 text-end">
								<button
									type="button"
									className="btn p-0"
									title="Advanced"
									onClick={() => toggleAdvVisible(idx)}
								>
									<IconSettings size={20} />
								</button>
							</div>
						</div>
						<div className="row">
							<div className="col-md-3">
								<div className="mb-3">
									<label className="form-label" htmlFor="forwardScheme">
										<T id="host.forward-scheme" />
									</label>
									<select
										id="forwardScheme"
										className="form-control"
										value={item.forwardScheme}
										onChange={(e) => handleChange(idx, "forwardScheme", e.target.value)}
									>
										<option value="http">http</option>
										<option value="https">https</option>
									</select>
								</div>
							</div>
							<div className="col-md-6">
								<div className="mb-3">
									<label className="form-label" htmlFor="forwardHost">
										<T id="proxy-host.forward-host" />
									</label>
									<input
										id="forwardHost"
										type="text"
										className="form-control"
										required
										placeholder="eg: 10.0.0.1/path/"
										value={item.forwardHost}
										onChange={(e) => handleChange(idx, "forwardHost", e.target.value)}
									/>
								</div>
							</div>
							<div className="col-md-3">
								<div className="mb-3">
									<label className="form-label" htmlFor="forwardPort">
										<T id="host.forward-port" />
									</label>
									<input
										id="forwardPort"
										type="number"
										min={1}
										max={65535}
										className="form-control"
										required
										placeholder="eg: 8081"
										value={item.forwardPort}
										onChange={(e) => handleChange(idx, "forwardPort", e.target.value)}
									/>
								</div>
							</div>
						</div>
						{advVisible.includes(idx) && (
							<div className="">
								<CodeEditor
									language="nginx"
									placeholder={intl.formatMessage({ id: "nginx-config.placeholder" })}
									padding={15}
									data-color-mode="dark"
									minHeight={170}
									indentWidth={2}
									value={item.advancedConfig}
									onChange={(e) => handleChange(idx, "advancedConfig", e.target.value)}
									style={{
										fontFamily:
											"ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
										borderRadius: "0.3rem",
										minHeight: "170px",
									}}
								/>
								<div className="mt-3">
									<label
										className="row mb-2"
										htmlFor={`location-${idx}-use-openappsec`}
									>
										<span className="col">
											<T id="proxy-hosts.form.openappsec.enable" />
										</span>
										<span className="col-auto">
											<label className="form-check form-check-single form-switch">
												<input
													id={`location-${idx}-use-openappsec`}
													className={cn("form-check-input", {
														"bg-lime": !!item.useOpenappsec,
													})}
													type="checkbox"
													checked={!!item.useOpenappsec}
													onChange={(e) =>
														handleChange(idx, "useOpenappsec", e.target.checked)
													}
												/>
											</label>
										</span>
									</label>
									<div className="row">
										<div className="col-md-6">
											<div className="mb-3">
												<label
													className="form-label"
													htmlFor={`location-${idx}-openappsec-mode`}
												>
													<T id="proxy-hosts.form.openappsec.mode" />
												</label>
												<select
													id={`location-${idx}-openappsec-mode`}
													className="form-control"
													disabled={!item.useOpenappsec}
													value={item.openappsecMode || "detect-learn"}
													onChange={(e) =>
														handleChange(idx, "openappsecMode", e.target.value)
													}
												>
													<option value="inactive">
														{intl.formatMessage({
															id: "proxy-hosts.form.openappsec.mode.inactive",
														})}
													</option>
													<option value="detect-learn">
														{intl.formatMessage({
															id: "proxy-hosts.form.openappsec.mode.detect-learn",
														})}
													</option>
													<option value="prevent-learn">
														{intl.formatMessage({
															id: "proxy-hosts.form.openappsec.mode.prevent-learn",
														})}
													</option>
												</select>
											</div>
										</div>
										<div className="col-md-6">
											<div className="mb-3">
												<label
													className="form-label"
													htmlFor={`location-${idx}-minimum-confidence`}
												>
													<T id="proxy-hosts.form.openappsec.confidence" />
												</label>
												<select
													id={`location-${idx}-minimum-confidence`}
													className="form-control"
													disabled={!item.useOpenappsec}
													value={item.minimumConfidence || "high"}
													onChange={(e) =>
														handleChange(idx, "minimumConfidence", e.target.value)
													}
												>
													<option value="low">
														{intl.formatMessage({
															id: "proxy-hosts.form.openappsec.confidence.low",
														})}
													</option>
													<option value="medium">
														{intl.formatMessage({
															id: "proxy-hosts.form.openappsec.confidence.medium",
														})}
													</option>
													<option value="high">
														{intl.formatMessage({
															id: "proxy-hosts.form.openappsec.confidence.high",
														})}
													</option>
													<option value="critical">
														{intl.formatMessage({
															id: "proxy-hosts.form.openappsec.confidence.critical",
														})}
													</option>
												</select>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
						<div className="mt-1">
							<a
								href="#"
								onClick={(e) => {
									e.preventDefault();
									handleRemove(idx);
								}}
							>
								<T id="action.delete" />
							</a>
						</div>
					</div>
				</div>
			))}
			<div>
				<button type="button" className="btn btn-sm" onClick={handleAdd}>
					<T id="action.add-location" />
				</button>
			</div>
		</>
	);
}
