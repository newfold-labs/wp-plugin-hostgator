import {
	HomeIcon,
	ShoppingBagIcon,
	AdjustmentsHorizontalIcon,
	QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import { NewfoldRuntime } from '@newfold/wp-module-runtime';
import { Route, Routes } from 'react-router-dom';
import { __ } from '@wordpress/i18n';
import Home from '../pages/home';
import Marketplace from '../pages/marketplace';
import Settings from '../pages/settings';
import Help from '../pages/help';
import Admin from '../pages/admin';
import { getMarketplaceSubnavRoutes } from '@modules/wp-module-marketplace/components/marketplaceSubnav';

const addPartialMatch = ( prefix, path ) =>
	prefix === path ? `${ prefix }/*` : path;

function helpAction( e, preventDefault = false ) {
	if (
		NewfoldRuntime.hasCapability( 'canAccessHelpCenter' ) &&
		window.NewfoldFeatures?.features?.helpCenter
	) {
		if ( preventDefault ) {
			e.preventDefault();
		}
		window.newfoldEmbeddedHelp.toggleNFDLaunchedEmbeddedHelp();
	}
}

/**
 * Redirect component for staging route.
 * Redirects users to the nfd-staging page.
 *
 * @return {null} Returns null as this component only handles redirection.
 */
const StagingRedirect = () => {
	// Redirect to the nfd-staging page.
	window.location.href =
		window.NewfoldRuntime.adminUrl + 'admin.php?page=nfd-staging';
	return null;
};

/**
 * Redirect component for performance route.
 * Redirects users to the nfd-performance page.
 *
 * @return {null} Returns null as this component only handles redirection.
 */
const PerformanceRedirect = () => {
	// Redirect to the nfd-performance page.
	window.location.href =
		window.NewfoldRuntime.adminUrl + 'admin.php?page=nfd-performance';
	return null;
};

export const AppRoutes = () => {
	return (
		<Routes>
			{ routes.map(
				( page ) =>
					true === page.condition && (
						<Route
							end
							key={ page.name }
							path={ addPartialMatch( '/marketplace' ) }
							element={ <page.Component /> }
						/>
					)
			) }
			<Route path="/staging" element={ <StagingRedirect /> } />
			<Route path="/performance" element={ <PerformanceRedirect /> } />
			<Route path="/" element={ <Home /> } />
			<Route
				path="*"
				element={
					<main style={ { padding: '1rem' } }>
						<p>
							{ __(
								"There's nothing here!",
								'wp-plugin-hostgator'
							) }
						</p>
					</main>
				}
			/>
		</Routes>
	);
};

export const routes = [
	{
		name: '/home',
		title: __( 'Home', 'wp-plugin-hostgator' ),
		Component: Home,
		Icon: HomeIcon,
		condition: true,
	},
	{
		name: '/settings',
		title: __( 'Manage WordPress', 'wp-plugin-hostgator' ),
		Component: Settings,
		Icon: AdjustmentsHorizontalIcon,
		condition: true,
	},
	{
		name: '/settings/staging',
		title: __( 'Staging', 'wp-plugin-hostgator' ),
		Component: Settings,
		Icon: AdjustmentsHorizontalIcon,
		condition: true,
	},
	{
		name: '/settings/performance',
		title: __( 'Performance', 'wp-plugin-hostgator' ),
		Component: Settings,
		Icon: AdjustmentsHorizontalIcon,
		condition: true,
	},
	{
		name: '/marketplace',
		title: __( 'Marketplace', 'wp-plugin-hostgator' ),
		Component: Marketplace,
		Icon: ShoppingBagIcon,
		subRoutes: await getMarketplaceSubnavRoutes(),
		condition: true,
	},
	{
		name: '/help',
		title: __( 'Help', 'wp-plugin-hostgator' ),
		Component: Help,
		Icon: QuestionMarkCircleIcon,
		condition: true,
		action: helpAction,
	},
	{
		name: '/admin',
		title: __( 'Admin', 'wp-plugin-hostgator' ),
		Component: Admin,
		condition: true,
	},
];

const topRoutePaths = [ '/home', '/settings', '/marketplace', '/help' ];
export const topRoutes = _filter( routes, ( route ) =>
	topRoutePaths.includes( route.name )
);

export default AppRoutes;
