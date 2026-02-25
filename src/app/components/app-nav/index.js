import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { filter } from 'lodash';
import {
	Button,
	AppBarNavigation,
	useNavigationContext,
} from '@newfold/ui-component-library';
import { default as NewfoldNotifications } from '@modules/wp-module-notifications/assets/js/components/notifications/';
import { useLocation } from 'react-router-dom';
import classnames from 'classnames';
import {
	addUtmParams,
	getEditorUrl,
	getEditorLabel,
} from 'App/util/helpers';
import { topRoutes } from 'App/data/routes';
import {
	RectangleGroupIcon,
	ArrowUpRightIcon,
} from '@heroicons/react/24/outline';
import Logo from '../logo';

export const AppNavHeader = () => {
	return <Logo />;
};

export const AppNavMenu = () => {
	const location = useLocation();
	const { setActivePath } = useNavigationContext();
	const [ editorUrl, setEditorUrl ] = useState( '#' );
	const [ editorLabel, setEditorLabel ] = useState(
		__( 'Editor', 'wp-plugin-hostgator' )
	);

	useEffect( () => {
		getEditorUrl( 'edit' )
			.then( setEditorUrl )
			.catch( () => {} );
		getEditorLabel()
			.then( setEditorLabel )
			.catch( () => {} );
	}, [] );

	const menu = () => {
		return (
			<AppBarNavigation.AppBar.Nav>
				{ [ ...topRoutes ]?.map( ( page ) => {
					if ( true !== page.condition ) {
						return null;
					}
					const { mode, setOpen } =
						AppBarNavigation.AppBar.useContext();
					return (
						<AppBarNavigation.AppBar.Item
							key={ page.name }
							label={ page.title }
							href={ `#${ page.name }` }
							className={ classnames(
								'group-[.nfd-appbar-item--active]:nfd-text-[var(--color-primary)] nfd-whitespace-nowrap',
								{
									'nfd-px-4 group-[.nfd-appbar-item--active]:nfd-bg-[#DBF1FC80] group-[.nfd-appbar-item--active]:nfd-font-bold':
										'inline' === mode,
									'nfd-px-0 nfd-font-bold nfd-bg-transparent group-[.nfd-appbar-item]:!nfd-bg-transparent hover:!nfd-bg-black':
										'collapsed' === mode,
								}
							) }
							onClick={ ( e ) => {
								setOpen( false );
								if (
									page.action &&
									typeof page.action === 'function'
								) {
									page.action( e );
								}
							} }
						/>
					);
				} ) }
			</AppBarNavigation.AppBar.Nav>
		);
	};

	const actions = () => {
		return (
			<>
				<Button
					as="a"
					className="nfd-flex nfd-gap-2 nfd-mr-4 nfd-text-nowrap"
					href={ editorUrl }
				>
					{ editorLabel }
					<RectangleGroupIcon />
				</Button>
				<Button
					as="a"
					className="nfd-flex nfd-gap-2 nfd-mr-4 nfd-text-nowrap"
					href={ addUtmParams(
						'https://www.hostgator.com/my-account/hosting/details/sites'
					) }
					variant="secondary"
				>
					{ __( 'Hosting Panel', 'wp-plugin-hostgator' ) }
					<ArrowUpRightIcon />
				</Button>
			</>
		);
	};

	const SubMenusManager = () => {
		const subMenus = document.querySelectorAll(
			'.hgwp-app-navitem-submenu'
		);
		subMenus.forEach( ( subMenu ) => {
			subMenu.classList.add( 'nfd-hidden' );
		} );
		const activeMenu = document.querySelector(
			'.hgwp-app-sidenav .active'
		);
		if (
			activeMenu?.nextSibling?.classList?.contains(
				'hgwp-app-navitem-submenu'
			)
		) {
			activeMenu.nextSibling.classList.remove( 'nfd-hidden' );
		}
	};

	useEffect( () => {
		if ( location?.pathname ) {
			let pathnameLocation = location.pathname;
			switch ( location.pathname ) {
				case '/':
					pathnameLocation = '/home';
					break;
				case '/settings/performance':
				case '/settings/staging':
				case '/settings/settings':
					pathnameLocation = '/settings';
					break;
			}
			if ( pathnameLocation.startsWith( '/marketplace' ) ) {
				pathnameLocation = '/marketplace';
			}
			setActivePath( `#${ pathnameLocation }` );
		}
		SubMenusManager();
		document.onclick = SubMenusManager;
	}, [ location, setActivePath ] );

	return (
		<>
			{ menu() }
			<div className="nfd-grow" />
			{ actions() }
		</>
	);
};

export const AppBarNav = () => {
	const location = useLocation();
	const hashedPath = '#' + location.pathname;

	return (
		<>
			<AppBarNavigation.AppBar
				position="absolute"
				className="nfd-pr-2"
				collapseAt={ 880 }
			>
				<AppNavHeader variant="icon" />
				<AppNavMenu />
			</AppBarNavigation.AppBar>
			<NewfoldNotifications
				constants={ {
					context: 'hostgator-app-nav',
					page: hashedPath,
				} }
				methods={ {
					apiFetch,
					addQueryArgs,
					filter,
					useState,
					useEffect,
				} }
			/>
		</>
	);
};

export const AppNav = () => {
	return <AppBarNav />;
};
