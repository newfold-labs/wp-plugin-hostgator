import { useState } from '@wordpress/element';
import { useUpdateEffect } from 'react-use';
import { Alert, ToggleField } from '@newfold/ui-component-library';
import AppStore from '../../data/store';
import { featureToggle } from '../../util/helpers';
import { useNotification } from 'App/components/notifications';

const WonderBlocksSettings = () => {
	const { store, setStore } = useContext( AppStore );
	const [ wonderBlocks, setWonderBlocks ] = useState(
		store.features.patterns
	);
	const [ wonderBlocksLocked, setWonderBlocksLocked ] = useState(
		! store.toggleableFeatures.patterns
	);
	const [ isError, setError ] = useState( false );
	const notify = useNotification();

	const getWonderBlocksNoticeTitle = () => {
		return wonderBlocks
			? __( 'WonderBlocks Enabled', 'wp-plugin-hostgator' )
			: __( 'WonderBlocks Disabled', 'wp-plugin-hostgator' );
	};
	const getWonderBlocksNoticeText = () => {
		return wonderBlocks
			? __(
					'Create new content to see WonderBlocks in action.',
					'wp-plugin-hostgator'
			  )
			: __(
					'WonderBlocks will no longer display.',
					'wp-plugin-hostgator'
			  );
	};

	const toggleWonderBlocks = () => {
		featureToggle( 'patterns', ( response ) => {
			// console.log( response );
			if ( response.success ) {
				setWonderBlocks( ! wonderBlocks );
			} else {
				setWonderBlocksLocked( true );
				setError( true );
				notifyError();
			}
		} );
	};

	const notifyError = () => {
		notify.push( 'feature-toggle-notice', {
			title: __( 'Sorry, that is not allowed.', 'wp-plugin-hostgator' ),
			description: __(
				'This feature cannot currently be modified.',
				'wp-plugin-hostgator'
			),
			variant: 'error',
		} );
	};

	const notifySuccess = ( renderTitle, renderDescription ) => {
		notify.push( 'feature-toggle-notice', {
			title: renderTitle(),
			description: renderDescription(),
			variant: 'success',
			autoDismiss: 5000,
		} );
	};

	useUpdateEffect( () => {
		setStore( {
			...store,
			wonderBlocks,
		} );
		notifySuccess( getWonderBlocksNoticeTitle, getWonderBlocksNoticeText );
	}, [ wonderBlocks ] );

	return (
		<div className="nfd-flex nfd-flex-col nfd-gap-6">
			<ToggleField
				id="wonderblocks-toggle"
				label="WonderBlocks"
				description={ __(
					'WonderBlocks provides a library of customizable block patterns and page templates.',
					'wp-plugin-hostgator'
				) }
				disabled={ wonderBlocksLocked }
				checked={ wonderBlocks }
				onChange={ toggleWonderBlocks }
			/>

			{ isError && (
				<Alert variant="error">
					{ __(
						'Oops! Something went wrong. Please try again.',
						'wp-plugin-hostgator'
					) }
				</Alert>
			) }
		</div>
	);
};

export default WonderBlocksSettings;
