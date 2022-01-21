import { ReactComponent as Graphic } from '../../../../assets/svg/snappy-holding-site-left.svg';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
    __experimentalHeading as Heading
} from '@wordpress/components';
import AppStore from '../../data/store';
import { useState } from '@wordpress/element';
import { useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';

const ComingSoonSection = () => {
    const { store, setStore } = useContext(AppStore);
	const [ isComingSoon, setComingSoon ] = useState( store.comingSoon );
	const [ wasComingSoon, setWasComingSoon ] = useState( false );
    
    const getComingSoonHeadline = () => {
        return isComingSoon ?
            __('Coming Soon', 'hostgator-wordpress-plugin') :
            __('Site Launched!', 'hostgator-wordpress-plugin')
    };
    const getComingSoonBody = () => {
        return isComingSoon ?
            __('Your site currently displays a coming soon page to visitors. Once you have finished setting up your site, be sure to launch it so your visitors can reach it.', 'hostgator-wordpress-plugin') :
            __('Congratulations! You just successfully launched your site! Visitors will now see the site, you can easily undo this and restore the coming soon page if you are not ready.', 'hostgator-wordpress-plugin')
    };
    const getComingSoonGraphicClass = () => {
        return isComingSoon ?
            'hgwp-section-graphic' :
            'hgwp-section-graphic reverse'
    };
    const getComingSoonButton = () => {
        return isComingSoon ? 
            <Button 
                variant="primary"
                icon="yes-alt"
                onClick={ () => {
                    setComingSoon( () => false );
                    setWasComingSoon( () => true );
                } }
            >{__('Launch Site', 'hostgator-wordpress-plugin')}</Button> :
            <Button 
                variant="secondary"
                icon="no-alt"
                onClick={ () => {
                    setComingSoon( () => true );
                    setWasComingSoon( () => true );
                } }
            >{__('Undo Launch', 'hostgator-wordpress-plugin')}</Button>;
    }

    useEffect(() => {
		setStore({
			...store,
			comingSoon: isComingSoon,
		});
		//save setting to db
		apiFetch( { path: 'hostgator/v1/settings', method: 'POST', data: {
			comingSoon: isComingSoon
		} } );
	}, [isComingSoon]);
	
	return (
        <>
        { ( isComingSoon || ( !isComingSoon && wasComingSoon ) ) && 
            <section className="hgwp-section coming-soon">
                <Graphic className={ getComingSoonGraphicClass() } />
                <Card size="large" className="hgwp-section-card">
                    <CardHeader>
                        <Heading level="2">{ getComingSoonHeadline() }</Heading>
                    </CardHeader>
                    <CardBody>{ getComingSoonBody() }</CardBody>
                    <CardFooter>
                        <div className="hgwp-cardlist-content" />
                        { getComingSoonButton() }
                    </CardFooter>
                </Card>
            </section>
        }
        </>
    );
};

export default ComingSoonSection;