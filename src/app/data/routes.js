import { 
	HomeIcon,
	ShoppingBagIcon,
	WrenchScrewdriverIcon,
	BoltIcon, 
	AdjustmentsHorizontalIcon,
	BuildingStorefrontIcon,
	QuestionMarkCircleIcon } 
from '@heroicons/react/24/outline';
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
];
const utilityRoutePaths = ['/help'];

export const routes = [
	{
		name: '/home',
		title: __('Home', 'wp-plugin-hostgator'),
		Component: Home,
		Icon: HomeIcon,
	},
	{
		name: '/marketplace',
		title: __('Marketplace', 'wp-plugin-hostgator'),
		Component: Marketplace,
		Icon: ShoppingBagIcon,
		subRoutes: [
			{
				name: '/marketplace/featured',
				title: __( 'Featured', 'wp-plugin-bluehost' ),
			},
			{
				name: '/marketplace/services',
				title: __( 'Services', 'wp-plugin-bluehost' ),
			},
			{
				name: '/marketplace/ecommerce',
				title: __( 'eCommerce', 'wp-plugin-bluehost' ),
			},
			{
				name: '/marketplace/seo',
				title: __( 'SEO', 'wp-plugin-bluehost' ),
			},
			{
				name: '/marketplace/security',
				title: __( 'Security', 'wp-plugin-bluehost' ),
			},
			{
				name: '/marketplace/themes',
				title: __( 'Themes', 'wp-plugin-bluehost' ),
			},

		],
	},
	{
		name: '/performance',
		title: __('Performance', 'wp-plugin-hostgator'),
		Component: Performance,
		Icon: BoltIcon,
	},
	{
		name: '/settings',
		title: __('Settings', 'wp-plugin-hostgator'),
		Component: Settings,
		Icon: AdjustmentsHorizontalIcon,
	},
	{
		name: '/help',
		title: __('Help', 'wp-plugin-hostgator'),
		Component: Help,
		Icon: QuestionMarkCircleIcon,
	},
];

export const topRoutes = _filter(routes, (route) =>
	topRoutePaths.includes(route.name)
);

export const utilityRoutes = _filter(routes, (route) =>
	utilityRoutePaths.includes(route.name)
);

export default AppRoutes;
