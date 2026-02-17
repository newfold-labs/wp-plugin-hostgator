import { useEffect } from '@wordpress/element';
import { useLocation } from 'react-router-dom';

/**
 * On route change, scroll to top and focus the main content area for accessibility.
 */
export function useHandlePageLoad() {
	const location = useLocation();

	useEffect( () => {
		window.scrollTo( 0, 0 );
		const routeContents = document.querySelector( '.hgwp-app-body-inner' );
		if ( routeContents ) {
			routeContents.focus( { preventScroll: true } );
		}
	}, [ location.pathname ] );
}
