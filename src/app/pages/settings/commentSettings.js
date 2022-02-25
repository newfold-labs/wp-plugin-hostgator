import { _n } from '@wordpress/i18n';
import {
	Card,
	CardBody,
	CardHeader,
	CardDivider,
	ToggleControl,
	SelectControl,
	__experimentalHeading as Heading,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useUpdateEffect } from 'react-use';
import AppStore from '../../data/store';
import ErrorCard from '../../components/errorCard';
import {
	hostgatorSettingsApiFetch,
	dispatchUpdateSnackbar,
} from '../../util/helpers';

const CommentSettings = () => {
	const { store, setStore } = useContext(AppStore);
	const [disableCommentsOldPosts, setDisableCommentsOldPosts] = useState(
		store.disableCommentsOldPosts
	);
	const [closeCommentsDays, setNumCloseCommentsDays] = useState(
		store.closeCommentsDays
	);
	const [commentsPerPage, setNumCommentsPerPage] = useState(
		store.commentsPerPage
	);
	const [isError, setError] = useState(false);

	const disableCommentsHelpText = () => {
		return disableCommentsOldPosts
			? __(
					'Comments on old posts are disabled.',
					'wp-plugin-hostgator'
			  )
			: __(
					'Comments are allowed on old posts.',
					'wp-plugin-hostgator'
			  );
	};
	const disableCommentsNoticeText = () => {
		return disableCommentsOldPosts
			? __('Old post comments disabled.', 'wp-plugin-hostgator')
			: __('Old post comments enabled.', 'wp-plugin-hostgator');
	};
	const closeCommentsLabelText = () => {
		// `Close comments after ${closeCommentsDays} day(s)`
		return (
			<span>
				{__('Close comments after ', 'wp-plugin-hostgator')}
				<strong>{closeCommentsDays}</strong>
				{_n(
					' day.',
					' days.',
					closeCommentsDays,
					'wp-plugin-hostgator'
				)}
			</span>
		);
	};
	const closeCommentsHelpText = () => {
		//`Comments on posts are disabled after ${closeCommentsDays} days.`
		return (
			<span>
				{__(
					'Comments on posts are disabled after ',
					'wp-plugin-hostgator'
				)}
				<strong>{closeCommentsDays}</strong>
				{_n(
					' day.',
					' days.',
					closeCommentsDays,
					'wp-plugin-hostgator'
				)}
			</span>
		);
	};
	const closeCommentsNoticeText = () => {
		return (
			__(
				'Disabled comments on posts older than ',
				'wp-plugin-hostgator'
			) +
			closeCommentsDays +
			_n(
				' day.',
				' days.',
				closeCommentsDays,
				'wp-plugin-hostgator'
			)
		);
	};
	const commentsPerPageLabelText = () => {
		// `Display ${commentsPerPage} comment(s) per page`
		return (
			<span>
				{__('Display ', 'wp-plugin-hostgator')}
				<strong>{commentsPerPage}</strong>
				{_n(
					' comment per page.',
					' comments per page.',
					commentsPerPage,
					'wp-plugin-hostgator'
				)}
			</span>
		);
	};
	const commentsPerPageHelpText = () => {
		//`Posts will display ${commentsPerPage} comments at a time.`
		return (
			<span>
				{__('Posts will display ', 'wp-plugin-hostgator')}
				<strong>{commentsPerPage}</strong>
				{_n(
					' comment at a time.',
					' comments at a time.',
					commentsPerPage,
					'wp-plugin-hostgator'
				)}
			</span>
		);
	};
	const commentsPerPageNoticeText = () => {
		return __(
			'Comments per page setting saved.',
			'wp-plugin-hostgator'
		);
	};
	useUpdateEffect(() => {
		hostgatorSettingsApiFetch({
			disableCommentsOldPosts: disableCommentsOldPosts ? 'true' : 'false',
		}, setError, (response) => {
			setStore({
				...store,
				disableCommentsOldPosts,
			});
			dispatchUpdateSnackbar(disableCommentsNoticeText());
		});
	}, [disableCommentsOldPosts]);

	useUpdateEffect(() => {
		hostgatorSettingsApiFetch({ closeCommentsDays }, setError, (response) => {
			setStore({
				...store,
				closeCommentsDays,
			});
			dispatchUpdateSnackbar(closeCommentsNoticeText());
		});
	}, [closeCommentsDays]);

	useUpdateEffect(() => {
		hostgatorSettingsApiFetch({ commentsPerPage }, setError, (response) => {
			setStore({
				...store,
				commentsPerPage,
			});
			dispatchUpdateSnackbar(commentsPerPageNoticeText());
		});
	}, [commentsPerPage]);

	if ( isError ) {
		return <ErrorCard error={isError} />
	}
	return (
		<Card className="card-comment-settings">
			<CardHeader>
				<Heading level="3">
					{__('Comments', 'wp-plugin-hostgator')}
				</Heading>
			</CardHeader>
			<CardBody>
				{__(
					'Make blog post comments disabled on older posts and control how many to display.',
					'wp-plugin-hostgator'
				)}
			</CardBody>
			<CardBody
				className="disable-comments-setting"
			>
				<ToggleControl
					checked={disableCommentsOldPosts}
					className="disable-comments-toggle"
					label={__(
						'Disable comments for older posts',
						'wp-plugin-hostgator'
					)}
					help={disableCommentsHelpText()}
					onChange={() => {
						setDisableCommentsOldPosts((value) => !value);
					}}
				/>
			</CardBody>
			<CardDivider />
			<CardBody 
				className={`close-comments-days-setting ${disableCommentsOldPosts ? '' : 'disabled'}`}
			>
				<SelectControl
					disabled={!disableCommentsOldPosts}
					className="close-comments-days-select"
					label={closeCommentsLabelText()}
					value={closeCommentsDays}
					help={closeCommentsHelpText()}
					options={[
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
					]}
					onChange={(value) => setNumCloseCommentsDays(value)}
				/>
			</CardBody>
			<CardDivider />
			<CardBody
				className="comments-per-page-setting"
			>
				<SelectControl
					label={commentsPerPageLabelText()}
					className="comments-per-page-select"
					value={commentsPerPage}
					help={commentsPerPageHelpText()}
					options={[
						{ label: '10', value: '10' },
						{ label: '15', value: '15' },
						{ label: '20', value: '20' },
						{ label: '30', value: '30' },
						{ label: '50', value: '50' },
					]}
					onChange={(value) => setNumCommentsPerPage(value)}
				/>
			</CardBody>
		</Card>
	);
};

export default CommentSettings;
