import {
	HomeIcon,
	ShoppingBagIcon,
	WrenchScrewdriverIcon,
	BoltIcon,
	AdjustmentsHorizontalIcon,
	BuildingStorefrontIcon,
	QuestionMarkCircleIcon,
	DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { NewfoldRuntime } from '@newfold/wp-module-runtime';
import { Route, Routes } from 'react-router-dom';
import { __ } from '@wordpress/i18n';
import Home from '../pages/home';
import PagesAndPosts from '../pages/pages-and-posts';
import Store from '../pages/ecommerce/page';
import Marketplace from '../pages/marketplace';
import Performance from '../pages/performance';
import Settings from '../pages/settings';
import Staging from '../pages/staging';
import Help from '../pages/help';
import Admin from '../pages/admin';
import { getMarketplaceSubnavRoutes } from '../../../vendor/newfold-labs/wp-module-marketplace/components/marketplaceSubnav';

const addPartialMatch = (prefix, path) =>
	prefix === path ? `${prefix}/*` : path;

const HelpCenterAI = (e) => {
	e.preventDefault();
	window.newfoldEmbeddedHelp.toggleNFDLaunchedEmbeddedHelp();
};

export const AppRoutes = () => {
	return (
		<Routes>
			{routes.map((page) => (
				<Route
					end
					key={page.name}
					path={addPartialMatch(
						'/marketplace',
						addPartialMatch('/store', page.name)
					)}
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
								'wp-plugin-hostgator'
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
	'/pages-and-posts',
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
		condition: true,
	},
	{
		name: '/pages-and-posts',
		title: __('Pages & Posts', 'wp-plugin-hostgator'),
		Component: PagesAndPosts,
		Icon: DocumentDuplicateIcon,
		condition: true,
	},
	{
		name: '/store',
		title: __('Store', 'wp-plugin-hostgator'),
		Component: Store,
		Icon: BuildingStorefrontIcon,
		condition: true,
		subRoutes: [
			{
				name: '/store/products',
				title: __('Products & Services', 'wp-plugin-hostgator'),
			},
			NewfoldRuntime.hasCapability('hasYithExtended')
				? {
					name: '/store/sales_discounts',
					title: __(
						'Sales & Promotions',
						'wp-plugin-hostgator'
					),
				}
				: null,
			NewfoldRuntime.hasCapability( 'hasYithExtended' ) &&
			NewfoldRuntime.hasCapability( 'hasEcomdash' )
				? {
						name: '/store/sales_channel',
						title: __( 'Sales Channel', 'wp-plugin-hostgator' ),
					}
				: null,
			NewfoldRuntime.isWoo
				? {
					name: '/store/payments',
					title: __('Payments', 'wp-plugin-hostgator'),
				}
				: null,
			{
				name: '/store/details',
				title: __('Store Details', 'wp-plugin-hostgator'),
			},
		].filter(Boolean),
	},
	{
		name: '/marketplace',
		title: __('Marketplace', 'wp-plugin-hostgator'),
		Component: Marketplace,
		Icon: ShoppingBagIcon,
		subRoutes: await getMarketplaceSubnavRoutes(),
		condition: true,
	},
	{
		name: '/performance',
		title: __('Performance', 'wp-plugin-hostgator'),
		Component: Performance,
		Icon: BoltIcon,
		condition: await window.NewfoldFeatures.isEnabled( 'performance' ),
	},
	{
		name: '/settings',
		title: __('Settings', 'wp-plugin-hostgator'),
		Component: Settings,
		Icon: AdjustmentsHorizontalIcon,
		condition: true,
	},
	{
		name: '/staging',
		title: __('Staging', 'wp-plugin-hostgator'),
		Component: Staging,
		Icon: WrenchScrewdriverIcon,
		condition: await window.NewfoldFeatures.isEnabled( 'staging' ),
	},
	{
		name: '/help',
		title: __('Help', 'wp-plugin-hostgator'),
		Component: Help,
		Icon: QuestionMarkCircleIcon,
		condition: true,
		action: NewfoldRuntime.hasCapability('canAccessHelpCenter')
			? HelpCenterAI
			: false,
	},
	{
		name: '/admin',
		title: __( 'Admin', 'wp-plugin-hostgator' ),
		Component: Admin,
		condition: true,
	},
];

export const topRoutes = _filter(routes, (route) =>
	topRoutePaths.includes(route.name)
);

export const utilityRoutes = _filter(routes, (route) =>
	utilityRoutePaths.includes(route.name)
);

export default AppRoutes;
