import { settings, trendingUp, help, grid, store } from '@wordpress/icons';
import { Route, Routes } from 'react-router-dom';
import { __ } from '@wordpress/i18n';
import Home from '../pages/home';
import Marketplace from '../pages/marketplace';
import Performance from '../pages/performance';
import Settings from '../pages/settings';
import Staging from '../pages/staging';
import Help from '../pages/help';

export const AppRoutes = () => {
	return (
		<Routes>
			{routes.map((page) => (
				<Route
					end
					key={page.name}
					path={
						'/marketplace' === page.name
							? '/marketplace/*'
							: page.name
					}
					element={<page.Component />}
				/>
			))}
			<Route path="/" element={<Home />} />
			<Route
				path="*"
				element={
					<main style={{ padding: '1rem' }}>
						<p>
							{__("There's nothing here!", 'wp-plugin-hostgator')}
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
	'/staging',
	'/help',
];
const utilityRoutePaths = ['/performance', '/settings', '/help'];

export const routes = [
	{
		name: '/home',
		title: __('Home', 'wp-plugin-hostgator'),
		Component: Home,
		Icon: grid,
	},
	{
		name: '/marketplace',
		title: __('Marketplace', 'wp-plugin-hostgator'),
		Component: Marketplace,
		Icon: store,
	},
	{
		name: '/performance',
		title: __('Performance', 'wp-plugin-hostgator'),
		Component: Performance,
		Dashicon: 'performance',
	},
	{
		name: '/settings',
		title: __('Settings', 'wp-plugin-hostgator'),
		Component: Settings,
		Icon: settings,
	},
	{
		name: '/staging',
		title: __('Staging', 'wp-plugin-hostgator'),
		Component: Staging,
		Dashicon: 'tools',
	},
	{
		name: '/help',
		title: __('Help', 'wp-plugin-hostgator'),
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
