// import './stylesheet.scss';

// to pass to marketplace module
import apiFetch from '@wordpress/api-fetch'; 
import classnames from 'classnames';
import { useEffect, useState } from '@wordpress/element';
import {
	Button,
    ButtonGroup,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
	Icon,
    Spinner,
} from '@wordpress/components';

// component sourced from marketplace module
import { default as NewfoldStaging } from '../../../../vendor/newfold-labs/wp-module-staging/components/staging/';

const StagingPage = () => {
	
    // Components to pass to module
	const moduleComponents = {
		Button,
		ButtonGroup,
		Card,
		CardBody,
		CardFooter,
		CardHeader,
		Icon,
		Spinner
	};
    // methods to pass to module
    const moduleMethods = {
        apiFetch,
        classnames,
        useState,
        useEffect
    };
    // constants to pass to module
    const moduleConstants = {
		'resturl': window.HGWP.resturl,
		'restnonce': 'test',
		'eventendpoint': '/newfold-data/v1/events/',
		'stagingLongDescription': __( 'A staging site is a copy of your site where you can safely test changes before publishing them to your production site. It gives you a way to try new things, test updates, and then deploy them when you\'re ready.', 'wp-plugin-hostgator' ),
		'stagingDescription': __( 'This is an unpublished copy of your website.', 'wp-plugin-hostgator' ),
		'productionDescription': __( 'This is your live website.', 'wp-plugin-hostgator' ),
		'cloneButtonText': __( 'Clone to Staging', 'wp-plugin-hostgator' ),
		'unknownErrorMsg': __('An unknown error occurred', 'wp-plugin-hostgator' ),
	};

	return (
        <NewfoldStaging 
            Components={moduleComponents}
            methods={moduleMethods}
            constants={moduleConstants}
        />
	);
};

export default StagingPage;