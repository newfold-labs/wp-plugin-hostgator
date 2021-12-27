import { __ } from '@wordpress/i18n';
import {
	Card,
	CardBody,
	CardHeader,
	CardDivider,
	CardFooter,
    TextControl,
	ToggleControl,
} from '@wordpress/components';
import { __experimentalHeading as Heading } from '@wordpress/components';
import AppStore from '../../data/store';
import { useState } from '@wordpress/element';
import { useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { dispatch } from '@wordpress/data';

const ComingSoon = () => {
	const { store, setStore } = useContext(AppStore);
	const [ isComingSoon, setComingSoon ] = useState( store.comingSoon );
	const [ isCustomComingSoon, setCustomComingSoon ] = useState( store.customComingSoon );
	const [ comingSoonHeadline, setComingSoonHeadline ] = useState( store.comingSoonHeadline );
	const [ comingSoonBody, setComingSoonBody ] = useState( store.comingSoonBody );
	const getComingSoonNoticeText = () => {
        return isComingSoon ? 'Coming soon activated.' : 'Coming soon deactivated.'
    };
    const getComingSoonHelpText = () => {
        return isComingSoon ? 'Coming soon page is active and site is protected.' : 'Coming soon page is not active and site is acessible.'
    };

	useEffect(() => {
		apiFetch( { path: 'hostgator/v1/settings', method: 'POST', data: {
			comingSoon: isComingSoon
		} } ).then( () => {
            setStore({
                ...store,
                comingSoon: isComingSoon,
            });
            dispatch('core/notices').createNotice(
                'info',
                getComingSoonNoticeText(),
                {
                  type: 'snackbar',
                  isDismissible: true,
                }
            );
            
            if ( !isComingSoon ) {
                document.getElementById('wp-admin-bar-hostgator-coming_soon').classList.add('hideme');
            } else {
                document.getElementById('wp-admin-bar-hostgator-coming_soon').classList.remove('hideme');
            }
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
                    help={ getComingSoonHelpText() }
                    onChange={ () => {
                        setComingSoon( ( value ) => ! value );
                        setCustomComingSoon( () => false );
                    } }
                />
            </CardBody>

            				
            {/* { isComingSoon && 
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
                <TextControl
                    placeholder={ __( 'A New WordPress Site', 'hostgator-wordpres-plugin' ) }
                    value={ comingSoonBody }
                    onChange={ (value) => { setComingSoonBody( () => { value } ) } }
                    tagName="h2"
                />
                <TextControl
                    placeholder={ __( 'Coming Soon', 'hostgator-wordpres-plugin' ) }
                    value={ comingSoonHeadline }
                    onChange={ (value) => { setComingSoonHeadline( () => { value } ) } }
                    tagName="h1"
                />
            </CardBody> }  */}
           
        </Card>
    );
};

export default ComingSoon;
