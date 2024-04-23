import AppStore from '../../data/store';
import {
	hostgatorSettingsApiFetch,
	comingSoonAdminbarToggle,
} from '../../util/helpers';
import { useState } from '@wordpress/element';
import { useUpdateEffect } from 'react-use';
import { Alert, Container, ToggleField } from '@newfold/ui-component-library';
import { useNotification } from '../../components/notifications/feed';

const ComingSoon = () => {
	const { store, setStore } = useContext( AppStore );
	const [ comingSoon, setComingSoon ] = useState( store.comingSoon );
	const [ isError, setError ] = useState( false );

	const notify = useNotification();

	const getComingSoonNoticeTitle = () => {
		return comingSoon
			? __( 'Coming soon activated', 'wp-plugin-hostgator' )
			: __( 'Coming soon deactivated', 'wp-plugin-hostgator' );
	};

	const getComingSoonNoticeText = () => {
		return comingSoon
			? __(
					'Coming soon page is active. Site requires login.',
					'wp-plugin-hostgator'
			  )
			: __(
					'Coming soon page is not active. Site is live to visitors.',
					'wp-plugin-hostgator'
			  );
	};

	const getComingSoonSectionTitle = () => {
		const getStatus = () => {
			return comingSoon ? (
				<span className="nfd-text-[#e10001] coming-soon-status">
					{ __( 'Not Live', 'wp-plugin-hostgator' ) }
				</span>
			) : (
				<span className="nfd-text-[#008112] coming-soon-status">
					{ __( 'Live', 'wp-plugin-hostgator' ) }
				</span>
			);
		};

		return (
			<span>
				{ __( 'Site Status', 'wp-plugin-hostgator' ) }: { getStatus() }
			</span>
		);
	};

	const toggleComingSoon = () => {
		hostgatorSettingsApiFetch(
			{ comingSoon: ! comingSoon },
			setError,
			( response ) => {
				setComingSoon( ! comingSoon );
			}
		);
	};

	const getComingSoonSectionDescription = () => {
		return comingSoon
			? __(
					'Turn off your "Coming Soon" page when you are ready to launch your website.',
					'wp-plugin-hostgator'
			  )
			: __(
					'Turn on your "Coming Soon" page when you need to make major changes to your website.',
					'wp-plugin-hostgator'
			  );
	};

	const notifySuccess = () => {
		notify.push( 'coming-soon-toggle-notice', {
			title: getComingSoonNoticeTitle(),
			description: <span>{ getComingSoonNoticeText() }</span>,
			variant: 'success',
			autoDismiss: 5000,
		} );
	};

	useUpdateEffect( () => {
		setStore( {
			...store,
			comingSoon,
		} );

		notifySuccess();
		comingSoonAdminbarToggle( comingSoon );
	}, [ comingSoon ] );

	return (
		<Container.SettingsField
			title={ getComingSoonSectionTitle() }
			description={ getComingSoonSectionDescription() }
		>
			<div className="nfd-flex nfd-flex-col nfd-gap-6">
				<ToggleField
					id="coming-soon-toggle"
					label={ __( 'Coming Soon page', 'wp-plugin-hostgator' ) }
					description={ __(
						'Your Hostgator Coming Soon page lets you hide your site from visitors while you make the magic happen.',
						'wp-plugin-hostgator'
					) }
					checked={ comingSoon }
					onChange={ () => {
						toggleComingSoon();
					} }
				/>

				{ comingSoon && (
					<Alert variant="info">
						{ __(
							'Your website is currently displaying a "Coming Soon" page.',
							'wp-plugin-hostgator'
						) }
					</Alert>
				) }

				{ isError && (
					<Alert variant="error">
						{ __(
							'Oops! Something went wrong. Please try again.',
							'wp-plugin-hostgator'
						) }
					</Alert>
				) }
			</div>
		</Container.SettingsField>
	);
};

export default ComingSoon;
