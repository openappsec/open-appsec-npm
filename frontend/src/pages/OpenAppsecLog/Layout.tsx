import cn from "classnames";
import { NavLink, Outlet } from "react-router-dom";
import { T } from "src/locale";

interface Tab {
	to: string;
	labelKey: string;
	end?: boolean;
}

const tabs: Tab[] = [
	{ to: "/open-appsec-log", labelKey: "openappsec-log.tab.all", end: true },
	{ to: "/open-appsec-log/detailed", labelKey: "openappsec-log.tab.detailed" },
	{ to: "/open-appsec-log/important", labelKey: "openappsec-log.tab.important" },
	{ to: "/open-appsec-log/notifications", labelKey: "openappsec-log.tab.notifications" },
];

export default function Layout() {
	return (
		<div className="card mt-4">
			<div className="card-status-top bg-teal" />
			<div className="card-table">
				<div className="card-header">
					<div className="row w-full">
						<h2 className="mt-1 mb-0">
							<T id="openappsec-log.title" />
						</h2>
					</div>
				</div>
				<div className="px-4 pt-3">
					<ul className="nav nav-tabs">
						{tabs.map((tab) => (
							<li key={tab.to} className="nav-item">
								<NavLink
									to={tab.to}
									end={tab.end}
									className={({ isActive }) =>
										cn("nav-link", { active: isActive })
									}
								>
									<T id={tab.labelKey} />
								</NavLink>
							</li>
						))}
					</ul>
				</div>
				<div className="tab-content">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
