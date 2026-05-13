import cn from "classnames";
import { Field, useFormikContext } from "formik";
import { intl, T } from "src/locale";

interface Props {
	/**
	 * Field name prefix. Empty string for proxy-host level fields
	 * (e.g. "useOpenappsec"). For per-location overrides use a prefix
	 * ending in a dot (e.g. "locations[0].").
	 */
	namePrefix?: string;
	color?: string;
}

export function OpenAppsecFields({ namePrefix = "", color = "bg-lime" }: Props) {
	const { values } = useFormikContext<any>();

	// Resolve current value of useOpenappsec under the given prefix
	const getValueAtPath = (path: string): any => {
		if (!path) return undefined;
		// Supports simple paths like "useOpenappsec" or "locations[0].useOpenappsec"
		return path
			.replace(/\[(\d+)\]/g, ".$1")
			.split(".")
			.reduce((acc: any, key: string) => (acc == null ? acc : acc[key]), values);
	};

	const useOpenappsecName = `${namePrefix}useOpenappsec`;
	const openappsecModeName = `${namePrefix}openappsecMode`;
	const minimumConfidenceName = `${namePrefix}minimumConfidence`;

	const useOpenappsec = !!getValueAtPath(useOpenappsecName);

	const toggleClasses = "form-check-input";
	const toggleEnabled = cn(toggleClasses, color);

	return (
		<div>
			<div className="mb-3">
				<label className="row" htmlFor={useOpenappsecName}>
					<span className="col">
						<T id="proxy-hosts.form.openappsec.enable" />
					</span>
					<span className="col-auto">
						<Field name={useOpenappsecName} type="checkbox">
							{({ field }: any) => (
								<label className="form-check form-check-single form-switch">
									<input
										{...field}
										id={useOpenappsecName}
										className={field.checked ? toggleEnabled : toggleClasses}
										type="checkbox"
									/>
								</label>
							)}
						</Field>
					</span>
				</label>
			</div>
			<div className="row">
				<div className="col-md-6">
					<Field name={openappsecModeName}>
						{({ field }: any) => (
							<div className="mb-3">
								<label className="form-label" htmlFor={openappsecModeName}>
									<T id="proxy-hosts.form.openappsec.mode" />
								</label>
								<select
									id={openappsecModeName}
									className="form-control"
									disabled={!useOpenappsec}
									{...field}
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
						)}
					</Field>
				</div>
				<div className="col-md-6">
					<Field name={minimumConfidenceName}>
						{({ field }: any) => (
							<div className="mb-3">
								<label className="form-label" htmlFor={minimumConfidenceName}>
									<T id="proxy-hosts.form.openappsec.confidence" />
								</label>
								<select
									id={minimumConfidenceName}
									className="form-control"
									disabled={!useOpenappsec}
									{...field}
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
						)}
					</Field>
				</div>
			</div>
		</div>
	);
}
