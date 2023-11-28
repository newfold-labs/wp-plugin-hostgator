import { 
	HomeIcon,
	ShoppingBagIcon,
	WrenchScrewdriverIcon,
	BoltIcon, 
	AdjustmentsHorizontalIcon,
	BuildingStorefrontIcon,
	QuestionMarkCircleIcon } 
from '@heroicons/react/24/outline';
import { NewfoldRuntime } from "@newfold-labs/wp-module-runtime";
import { Route, Routes } from 'react-router-dom';
import { __ } from '@wordpress/i18n';
import Home from '../pages/home';
import Marketplace from '../pages/marketplace';
import Performance from '../pages/performance';
import Settings from '../pages/settings';
import Staging from '../pages/staging';
import Help from '../pages/help';
import Store from '../pages/ecommerce/page';

const addPartialMatch = (prefix, path) => prefix === path ? `${prefix}/*` : path; 

export const AppRoutes = () => {
	return (
		<Routes>
			{routes.map((page) => (
				<Route
					end
					key={page.name}
					path={
						addPartialMatch("/marketplace", addPartialMatch("/store", page.name))
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
	'/store',
	'/marketplace',
	'/performance',
	'/settings',
	'/staging',
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
		name: '/store',
		title: __('Store', 'wp-plugin-hostgator'),
		Component: Store,
		Icon: BuildingStorefrontIcon,
		subRoutes: [
			{
				name: '/store/products',
				title: __( 'Products', 'wp-plugin-hostgator' ),
			},
			NewfoldRuntime.hasCapability( 'hasYithExtended' )
			? {
				name: "/store/sales_discounts",
				title: __("Sales & Discounts", "wp-plugin-hostgator"),
			}
			: null,
			NewfoldRuntime.isWoo
			? {
				name: '/store/payments',
				title: __( 'Payments', 'wp-plugin-bluehost' ),
			}
			: null,
			{
				name: '/store/details',
				title: __( 'Store Details', 'wp-plugin-hostgator' ),
			}
		].filter(Boolean),
	},
	{
		name: '/marketplace',
		title: __('Marketplace', 'wp-plugin-hostgator'),
		Component: Marketplace,
		Icon: ShoppingBagIcon,
		subRoutes: [
			{
				name: '/marketplace/featured',
				title: __( 'Featured', 'wp-plugin-hostgator' ),
			},
			{
				name: '/marketplace/services',
				title: __( 'Services', 'wp-plugin-hostgator' ),
			},
			{
				name: '/marketplace/ecommerce',
				title: __( 'eCommerce', 'wp-plugin-hostgator' ),
			},
			{
				name: '/marketplace/seo',
				title: __( 'SEO', 'wp-plugin-hostgator' ),
			},
			{
				name: '/marketplace/security',
				title: __( 'Security', 'wp-plugin-hostgator' ),
			},
			{
				name: '/marketplace/themes',
				title: __( 'Themes', 'wp-plugin-hostgator' ),
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
		name: '/staging',
		title: __('Staging', 'wp-plugin-hostgator'),
		Component: Staging,
		Icon: WrenchScrewdriverIcon,
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
