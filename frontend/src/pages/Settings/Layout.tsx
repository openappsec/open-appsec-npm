import cn from "classnames";
import { useState } from "react";
import { T } from "src/locale";
import DefaultSite from "./DefaultSite";
import OpenAppsec from "./OpenAppsec";

type TabId = "default-site" | "openappsec";

interface Tab {
	id: TabId;
	labelKey: string;
}

const tabs: Tab[] = [
	{ id: "default-site", labelKey: "settings.default-site" },
	{ id: "openappsec", labelKey: "settings.openappsec.title" },
];

export default function Layout() {
	// Taken from https://preview.tabler.io/settings.html
	// Refer to that when updating this content

	const [activeTab, setActiveTab] = useState<TabId>("default-site");

	return (
		<div className="card mt-4">
			<div className="card-status-top bg-teal" />
			<div className="card-table">
				<div className="card-header">
					<div className="row w-full">
						<h2 className="mt-1 mb-0">
							<T id="settings" />
						</h2>
					</div>
				</div>
				<div className="row g-0">
					<div className="col-12 col-md-3 border-end">
						<div className="card-body mt-0 pt-0">
							<div className="list-group list-group-transparent">
								{tabs.map((tab) => (
									<a
										key={tab.id}
										href="#"
										className={cn(
											"list-group-item",
											"list-group-item-action",
											"d-flex",
											"align-items-center",
											{ active: activeTab === tab.id },
										)}
										onClick={(e) => {
											e.preventDefault();
											setActiveTab(tab.id);
										}}
									>
										<T id={tab.labelKey} />
									</a>
								))}
							</div>
						</div>
					</div>
					<div className="col-12 col-md-9 d-flex flex-column">
						{activeTab === "default-site" && <DefaultSite />}
						{activeTab === "openappsec" && <OpenAppsec />}
					</div>
				</div>
			</div>
		</div>
	);
}
