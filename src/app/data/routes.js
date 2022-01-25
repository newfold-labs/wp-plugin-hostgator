import { settings, trendingUp, help, grid, store } from '@wordpress/icons';

import { Route, Routes } from 'react-router-dom';
import { __ } from '@wordpress/i18n';
import Home from '../pages/home';
import Marketplace from '../pages/marketplace';
import Settings from '../pages/settings';
import Performance from '../pages/performance';
import Help from '../pages/help';

export const AppRoutes = () => {
	return (
		<Routes>
			{routes.map((page) => (
				<Route
					end
					key={page.name}
					path={'/marketplace' === page.name ? '/marketplace/*' : page.name}
					element={<page.Component />}
				/>
			))}
			<Route path="/" element={<Home />} />
			<Route
				path="*"
				element={
					<main style={{ padding: '1rem' }}>
						<p>
							{__(
								"There's nothing here!",
								'hostgator-wordpress-plugin'
							)}
						</p>
					</main>
				}
			/>
		</Routes>
	);
};

const topRoutePaths = [
	'/home',
	'/marketplace',
	'/performance',
	'/settings',
	'/help',
];
const utilityRoutePaths = ['/performance', '/settings', '/help'];

export const routes = [
	{
		name: '/home',
		title: __('Home', 'hostgator-wordpress-plugin'),
		Component: Home,
		Icon: grid,
	},
	{
		name: '/marketplace',
		title: __('Marketplace', 'hostgator-wordpress-plugin'),
		Component: Marketplace,
		Icon: store,
	},
	{
		name: '/performance',
		title: __('Performance', 'hostgator-wordpress-plugin'),
		Component: Performance,
		Icon: trendingUp,
	},
	{
		name: '/settings',
		title: __('Settings', 'hostgator-wordpress-plugin'),
		Component: Settings,
		Icon: settings,
	},
	{
		name: '/help',
		title: __('Help', 'hostgator-wordpress-plugin'),
		Component: Help,
		Icon: help,
	},
];

export const topRoutes = _filter(routes, (route) =>
	topRoutePaths.includes(route.name)
);

export const utilityRoutes = _filter(routes, (route) =>
	utilityRoutePaths.includes(route.name)
);

export default AppRoutes;
