import { __ } from '@wordpress/i18n';
import {
	Card,
	CardBody,
	CardHeader,
	CardDivider,
	CardFooter,
	ToggleControl,
} from '@wordpress/components';
import { __experimentalHeading as Heading } from '@wordpress/components';
import AppStore from '../../data/store';
import { useState } from '@wordpress/element';
import { useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';

const ComingSoon = () => {
	const { store, setStore } = useContext(AppStore);
	const [ isComingSoon, setComingSoon ] = useState( store.comingSoon );
	
	useEffect(() => {
		apiFetch( { path: 'hostgator/v1/settings', method: 'POST', data: {
			comingSoon: isComingSoon
		} } ).then( () => {
            setStore({
                ...store,
                comingSoon: isComingSoon,
            });
        });
	}, [isComingSoon]);

	return (
        <Card>
            <CardHeader>
                <Heading level="3">Coming Soon</Heading>
            </CardHeader>
            <CardBody>
                Not ready for your site to be live? Enable a "Coming Soon" page while you build your website for the public eye. This will disable all parts of your site and show visitors a "coming soon" landing page.
            </CardBody>
            <CardDivider />
            <CardBody>
                <ToggleControl
                    label="Coming Soon"
                    checked={ isComingSoon }
                    help={
                        isComingSoon
                            ? 'Coming soon is active.'
                            : 'Coming soon is not active.'
                    }
                    onChange={ () => {
                        setComingSoon( ( value ) => ! value );
                        // setCustomComingSoon( () => false );
                    } }
                />
            </CardBody>
            
            {/* 				
            { isComingSoon && 
            <CardBody>
                <ToggleControl
                    label="Custom Coming Soon Content"
                    checked={ isCustomComingSoon }
                    help={
                        isCustomComingSoon
                            ? 'Coming soon has custom content (below).'
                            : 'Default coming soon content.'
                    }
                    onChange={ () => {
                        setCustomComingSoon( ( value ) => ! value );
                    } }
                />
            </CardBody> }

            { isCustomComingSoon && 
            <CardBody>
                <RichText
                    placeholder={ __( 'Coming Soon', 'hostgator-wordpres-plugin' ) }
                    value={ comingSoonHeadline }
                    onChange={ (value) => { setComingSoonHeadline( () => { value } ) } }
                    tagName="h2"
                    allowedFormats={[]}
                />
                <RichText
                    placeholder={ __( 'A New WordPress Site', 'hostgator-wordpres-plugin' ) }
                    value={ comingSoonBody }
                    onChange={ (value) => { setComingSoonBody( () => { value } ) } }
                    tagName="p"
                />
            </CardBody> } 
            */}
        </Card>
    );
};

export default ComingSoon;
