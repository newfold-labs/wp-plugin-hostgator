import App from './app';
import domReady from '@wordpress/dom-ready';
// import domReadyInit from './app/init';
import { render } from '@wordpress/element';

console.log("Welcome to HostGator Plugin!");

/**
 * DOM ID of root element to initialize app
 *
 * @see ../inc/menu.php
 */
const WP_ADM_PAGE_ROOT_ELEMENT = 'hwa-app';
 
 
/**
 * When DOM is ready, load app on root element, replacing #bwa-centered-loader markup.
 */
domReady( () => {
    //  { domReadyInit(); }
    const DOM_ELEMENT = document.getElementById(WP_ADM_PAGE_ROOT_ELEMENT);
	if (null !== DOM_ELEMENT && 'undefined' !== typeof render) {
		render(<App />, DOM_ELEMENT);
	}
} );
 