import { __ } from '@wordpress/i18n';
import {
    Button,
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

const CacheSettings = () => {
	const { store, setStore } = useContext(AppStore);
	// const [ isDisableCommentsOldPosts, setDisableCommentsOldPosts ] = useState( store.disableCommentsOldPosts );
	// const [ isCloseCommentsDays, setCloseCommentsDays ] = useState( store.closeCommentsDays );
	// const [ isCommentsPerPage, setCommentsPerPage ] = useState( store.commentsPerPage );

	// useEffect(() => {
	// 	setStore({
	// 		...store,
	// 		disableCommentsOldPosts: isDisableCommentsOldPosts,
	// 	});
	// 	//save setting to db
	// 	apiFetch( { path: 'hostgator/v1/settings', method: 'POST', data: {
	// 		disableCommentsOldPosts: isDisableCommentsOldPosts ? 'true' : 'false'
	// 	} } );
	// }, [isDisableCommentsOldPosts]);

	return (
        <Card>
            <CardHeader>
                <Heading level="3">Performance and Cache</Heading>
            </CardHeader>
            <CardBody>
                Cache options to speed up your site.
            </CardBody>
            <CardBody>
                <strong>Caching</strong>
            </CardBody>
            <CardBody>
                <strong>Cache Level</strong>
            </CardBody>
            <CardFooter>
                <strong>Clear Cache</strong>
                <Button
                    variant="primary"
                    disabled
                >
                    Clear Cache
                </Button>
            </CardFooter>
        </Card>
    );
};

export default CacheSettings;