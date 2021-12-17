import { __ } from '@wordpress/i18n';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardMedia,
	CardFooter,
	Dashicon
} from '@wordpress/components';
import { __experimentalHeading as Heading } from '@wordpress/components';
import AppStore from '../../data/store';
import { useState } from '@wordpress/element';
import { useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';

const ComingSoonSection = () => {
    const { store, setStore } = useContext(AppStore);
	const [ isComingSoon, setComingSoon ] = useState( store.comingSoon );

    useEffect(() => {
		setStore({
			...store,
			comingSoon: isComingSoon,
            wasComingSoon: true
		});
		//save setting to db
		apiFetch( { path: 'hostgator/v1/settings', method: 'POST', data: {
			comingSoon: isComingSoon
		} } );
	}, [isComingSoon]);
	
	return (
        <section className="hgwp-section">
            { isComingSoon && 
                <Card size="large" className="hgwp-section-card">
                    <CardHeader>
                        <Heading level="2">Coming Soon</Heading>
                    </CardHeader>
                    <CardBody>
                        <p>Your site currently has a coming soon page. Once you have finished setting up your site, be sure to launch so your visitors can reach the site.</p>
                    </CardBody>
                    <CardFooter>
                        <div className="hgwp-cardlist-content" />
                        <Button 
                            variant="primary"
                            icon="yes-alt"
                            onClick={ () => {
                                setComingSoon( () => false );
                            } }
                        >Launch Site</Button>
                    </CardFooter>
                </Card>
            }
            {
                !isComingSoon && store.wasComingSoon  &&
                <Card size="large" className="hgwp-section-card">
                    <CardHeader>
                        <Heading level="2">Site Launched!</Heading>
                    </CardHeader>
                    <CardBody>
                        <p>Your just successfully launched your site! Congratulations!</p>
                    </CardBody>
                    <CardFooter>
                        <div className="hgwp-cardlist-content" />
                        <Button 
                            variant="secondary"
                            icon="no-alt"
                            onClick={ () => {
                                setComingSoon( () => true );
                            } }
                        >Undo Launch</Button>
                    </CardFooter>
                </Card>
            }
        </section>
    );
};

export default ComingSoonSection;