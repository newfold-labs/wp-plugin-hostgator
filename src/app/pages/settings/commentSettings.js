import { _n } from '@wordpress/i18n';
import {
	Card,
	CardBody,
	CardHeader,
	CardDivider,
	ToggleControl,
    SelectControl,
    __experimentalHeading as Heading
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useUpdateEffect } from 'react-use';
import AppStore from '../../data/store';
import {
	hostgatorSettingsApiFetch,
	dispatchUpdateSnackbar
} from '../../util/helpers';

const CommentSettings = () => {
	const { store, setStore } = useContext(AppStore);
	const [ disableCommentsOldPosts, setDisableCommentsOldPosts ] = useState( store.disableCommentsOldPosts );
	const [ closeCommentsDays, setNumCloseCommentsDays ] = useState( store.closeCommentsDays );
	const [ commentsPerPage, setNumCommentsPerPage ] = useState( store.commentsPerPage );
    const disableCommentsHelpText = () => {
        return disableCommentsOldPosts ?
            __( 'Comments on old posts are disabled.', 'hostgator-wordpress-plugin' ) :
            __( 'Comments are allowed on old posts.', 'hostgator-wordpress-plugin' )
    };
    const disableCommentsNoticeText = () => {
        return disableCommentsOldPosts ?
            __( 'Old post comments disabled.', 'hostgator-wordpress-plugin' ) :
            __( 'Old post comments enabled.', 'hostgator-wordpress-plugin' )
    };
    const closeCommentsLabelText = () => {
        // `Close comments after ${closeCommentsDays} day(s)`
        return <span>
            { __( 'Close comments after ', 'hostgator-wordpress-plugin' ) } 
            <strong>{ closeCommentsDays }</strong>
            { _n( ' day.', ' days.', closeCommentsDays, 'hostgator-wordpress-plugin' ) }
        </span>
    };
    const closeCommentsHelpText = () => {
        //`Comments on posts are disabled after ${closeCommentsDays} days.`
        return <span>
            { __( 'Comments on posts are disabled after ', 'hostgator-wordpress-plugin' ) }
            <strong>{ closeCommentsDays }</strong>
            { _n( ' day.', ' days.', closeCommentsDays, 'hostgator-wordpress-plugin' ) }
        </span>
    };
    const closeCommentsNoticeText = () => {
        return __( 'Disabled comments on posts older than ', 'hostgator-wordpress-plugin' ) + closeCommentsDays + _n( ' day.', ' days.', closeCommentsDays, 'hostgator-wordpress-plugin' );
    };
    const commentsPerPageLabelText = () => {
        // `Display ${commentsPerPage} comment(s) per page`
        return <span>
            { __( 'Display ', 'hostgator-wordpress-plugin' ) } 
            <strong>{ commentsPerPage }</strong>
            { _n( ' comment per page.', ' comments per page.', commentsPerPage, 'hostgator-wordpress-plugin' ) }  
        </span>
    };
    const commentsPerPageHelpText = () => {
        //`Posts will display ${commentsPerPage} comments at a time.`
        return <span>
            { __( 'Posts will display ', 'hostgator-wordpress-plugin' ) }
            <strong>{ commentsPerPage }</strong>
            { _n( ' comment at a time.', ' comments at a time.', commentsPerPage, 'hostgator-wordpress-plugin' ) }
        </span>
    };
    const commentsPerPageNoticeText = () => {
        return __( 'Comments per page setting saved.', 'hostgator-wordpress-plugin' );
    };
	useUpdateEffect(() => {
		hostgatorSettingsApiFetch( { disableCommentsOldPosts: disableCommentsOldPosts ? 'true' : 'false' } ).then( () => {
            setStore({
                ...store,
                disableCommentsOldPosts,
            });
            dispatchUpdateSnackbar( disableCommentsNoticeText() );
        });
	}, [disableCommentsOldPosts]);

	useUpdateEffect(() => {
		hostgatorSettingsApiFetch( { closeCommentsDays } ).then( () => {
            setStore({
                ...store,
                closeCommentsDays,
            });
            dispatchUpdateSnackbar( closeCommentsNoticeText() );
        });
	}, [closeCommentsDays]);

	useUpdateEffect(() => {
		hostgatorSettingsApiFetch( { commentsPerPage } ).then( () => {
            setStore({
                ...store,
                commentsPerPage,
            });
            dispatchUpdateSnackbar( commentsPerPageNoticeText() );
        });
	}, [commentsPerPage]);

	return (
        <Card>
            <CardHeader>
                <Heading level="3">{ __( 'Comments', 'hostgator-wordpress-plugin' ) }</Heading>
            </CardHeader>
            <CardBody>
                { __( 'Make blog post comments disabled on older posts and control how many to display.', 'hostgator-wordpress-plugin' ) }
            </CardBody>
            <CardBody>
                <ToggleControl
                    checked={ disableCommentsOldPosts }
                    label={ __( 'Disable comments for older posts', 'hostgator-wordpress-plugin' ) }
                    help={ disableCommentsHelpText() }
                    onChange={ () => {
                        setDisableCommentsOldPosts( ( value ) => !value );
                    } }
                />
            </CardBody>
            <CardDivider />
            <CardBody
                className={ disableCommentsOldPosts ? '' : 'disabled' }
            >
                <SelectControl
                    disabled={ !disableCommentsOldPosts }
                    label={ closeCommentsLabelText() }
                    value={ closeCommentsDays }
                    help={ closeCommentsHelpText() }
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
                    label={ commentsPerPageLabelText() }
                    value={ commentsPerPage }
                    help={ commentsPerPageHelpText() }
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
