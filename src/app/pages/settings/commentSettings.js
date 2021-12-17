import { __ } from '@wordpress/i18n';
import {
	Card,
	CardBody,
	CardHeader,
	CardDivider,
	CardFooter,
	ToggleControl,
    SelectControl
} from '@wordpress/components';
import { __experimentalHeading as Heading } from '@wordpress/components';
import AppStore from '../../data/store';
import { useState } from '@wordpress/element';
import { useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';

const CommentSettings = () => {
	const { store, setStore } = useContext(AppStore);
	const [ isDisableCommentsOldPosts, setDisableCommentsOldPosts ] = useState( store.disableCommentsOldPosts );
	const [ numCloseCommentsDays, setNumCloseCommentsDays ] = useState( store.closeCommentsDays );
	const [ numCommentsPerPage, setNumCommentsPerPage ] = useState( store.commentsPerPage );

	useEffect(() => {
		setStore({
			...store,
			disableCommentsOldPosts: isDisableCommentsOldPosts,
		});
		//save setting to db
		apiFetch( { path: 'hostgator/v1/settings', method: 'POST', data: {
			disableCommentsOldPosts: isDisableCommentsOldPosts ? 'true' : 'false'
		} } );
	}, [isDisableCommentsOldPosts]);

	useEffect(() => {
		setStore({
			...store,
			closeCommentsDays: numCloseCommentsDays,
		});
		//save setting to db
		apiFetch( { path: 'hostgator/v1/settings', method: 'POST', data: {
			closeCommentsDays: numCloseCommentsDays
		} } );
	}, [numCloseCommentsDays]);

	useEffect(() => {
		setStore({
			...store,
			commentsPerPage: numCommentsPerPage,
		});
		//save setting to db
		apiFetch( { path: 'hostgator/v1/settings', method: 'POST', data: {
			commentsPerPage: numCommentsPerPage
		} } );
	}, [numCommentsPerPage]);

	return (
        <Card>
            <CardHeader>
                <Heading level="3">Comments</Heading>
            </CardHeader>
            <CardBody>
                Make blog post comments disabled on older posts and control how many to display.
            </CardBody>
            <CardBody>
                <ToggleControl
                    checked={ isDisableCommentsOldPosts }
                    label="Disable comments for older posts"
                    help={
                        isDisableCommentsOldPosts ?
                            "Comments on old posts are disabled." :
                            "Comments are allowed on old posts."
                    }
                    onChange={ () => {
                        setDisableCommentsOldPosts( ( value ) => !value );
                    } }
                />
            </CardBody>
            <CardDivider />
            <CardBody
                className={ isDisableCommentsOldPosts ? '' : 'disabled' }
            >
                <SelectControl
                    disabled={ !isDisableCommentsOldPosts }
                    label={`Close comments after ${numCloseCommentsDays} days`}
                    value={ numCloseCommentsDays }
                    help={`Comments on posts are disabled after ${numCloseCommentsDays} days.`}
                    options={ [
                        { label: '1', value: '1' },
                        { label: '3', value: '3' },
                        { label: '5', value: '5' },
                        { label: '7', value: '7' },
                        { label: '10', value: '10' },
                        { label: '14', value: '14' },
                        { label: '20', value: '20' },
                        { label: '28', value: '28' },
                        { label: '30', value: '30' },
                        { label: '50', value: '50' },
                        { label: '100', value: '100' },
                    ] }
                    onChange={ ( value ) => setNumCloseCommentsDays( value ) }
                />
            </CardBody>
            <CardDivider />
            <CardBody>
                <SelectControl
                    label={`Display ${numCommentsPerPage} comments per page`}
                    value={ numCommentsPerPage }
                    help={`Posts will display ${numCommentsPerPage} comments at a time.`}
                    options={ [
                        { label: '10', value: '10' },
                        { label: '15', value: '15' },
                        { label: '20', value: '20' },
                        { label: '30', value: '30' },
                        { label: '50', value: '50' },
                    ] }
                    onChange={ ( value ) => setNumCommentsPerPage( value ) }
                />
            </CardBody>
        </Card>
    );
};

export default CommentSettings;
