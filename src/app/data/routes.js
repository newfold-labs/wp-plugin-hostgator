import {
	Icon,
	settings,
	lifesaver,
} from "@wordpress/icons";

import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import { __ } from '@wordpress/i18n';
import Home from '../pages/home';
import Themes from '../pages/themes';
import Plugins from '../pages/plugins';
import Services from '../pages/services';
import Settings from '../pages/settings';
import Help from '../pages/help';

export const AppRoutes = () => {
	return(
		<Routes>
            {routes.map((page) => (
                <Route
                    end
                    key={page.name}
                    path={page.name}
                    element={<page.Component />}
                />
            ))}
			<Route 
                path="/" 
                element={<Home />} />
			<Route
				path="*"
				element={
					<main style={{ padding: "1rem" }}>
					<p>There's nothing here!</p>
					</main>
				}
				/>
		</Routes>
	);
};

const topRoutePaths = [
	"/home",
	"/themes",
	"/plugins",
	"/services",
	"/settings",
    "/help",
];
const utilityRoutePaths = [
	"/settings",
    "/help",
];

export const routes = [
	{
		name: "/home",
		title: __("Home", "hostgator-wordpress-plugin"),
		description: __("Home", "hostgator-wordpress-plugin"),
		Component: Home,
		// Icon: HomeIcon,
	},
	{
		name: "/themes",
		title: __("Themes", "hostgator-wordpress-plugin"),
		description: __("Themes", "hostgator-wordpress-plugin"),
		Component: Themes,
		// Icon: ColorsIcon,
	},
	{
		name: "/plugins",
		title: __("Plugins", "hostgator-wordpress-plugin"),
		description: __("plugins", "hostgator-wordpress-plugin"),
		Component: Plugins,
		// Icon: TypographyIcon,
	},
	{
		name: "/services",
		title: __("Services", "hostgator-wordpress-plugin"),
		description: __("Services", "hostgator-wordpress-plugin"),
		Component: Services,
		// Icon: LayoutSpacingIcon,
	},
	{
		name: "/settings",
		title: __("Settings", "hostgator-wordpress-plugin"),
		description: __("Settings", "hostgator-wordpress-plugin"),
		Component: Settings,
		Icon: settings,
	},
	{
		name: "/help",
		title: __("Help", "hostgator-wordpress-plugin"),
		description: __("Help", "hostgator-wordpress-plugin"),
		Component: Help,
		Icon: lifesaver,
	}
];

export const topRoutes = _filter(routes, (route) =>
	topRoutePaths.includes(route.name)
);

export const utilityRoutes = _filter(routes, (route) =>
	utilityRoutePaths.includes(route.name)
);

export default AppRoutes;
