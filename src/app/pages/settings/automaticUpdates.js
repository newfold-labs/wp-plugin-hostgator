import AppStore from '../../data/store';
import { hostgatorSettingsApiFetch } from '../../util/helpers';
import { useUpdateEffect } from 'react-use';
import { useState } from '@wordpress/element';
import { Alert, Container, ToggleField } from '@newfold/ui-component-library';
import { useNotification } from '../../components/notifications/feed';

const AutomaticUpdatesAll = ( { setError, notify } ) => {
	const { store, setStore } = useContext( AppStore );
	const [ autoUpdatesAll, setAutoUpdatesAll ] = useState(
		store.autoUpdatesMajorCore &&
			store.autoUpdatesPlugins &&
			store.autoUpdatesThemes
			? true
			: false
	);

	const getAllNoticeTitle = () => {
		return autoUpdatesAll
			? __( 'Enabled All auto-updates', 'wp-plugin-hostgator' )
			: __( 'Disabled All auto-updates', 'wp-plugin-hostgator' );
	};
	const getAllNoticeText = () => {
		return autoUpdatesAll
			? __(
					'Everything will automatically update.',
					'wp-plugin-hostgator'
			  )
			: __( 'Custom auto-update settings.', 'wp-plugin-hostgator' );
	};

	const toggleAutoUpdatesAll = () => {
		if ( autoUpdatesAll ) {
			// is unchecking
			// just uncheck this one
			setAutoUpdatesAll( ! autoUpdatesAll );
		} else {
			// is checking
			hostgatorSettingsApiFetch(
				{
					autoUpdatesMajorCore: true,
					autoUpdatesPlugins: true,
					autoUpdatesThemes: true,
				},
				setError,
				( response ) => {
					setAutoUpdatesAll( ! autoUpdatesAll );
				}
			);
		}
	};

	const notifySuccess = () => {
		notify.push( 'everything-autoupdate-notice', {
			title: getAllNoticeTitle(),
			description: <span>{ getAllNoticeText() }</span>,
			variant: 'success',
			autoDismiss: 5000,
		} );
	};

	useEffect( () => {
		if (
			store.autoUpdatesMajorCore &&
			store.autoUpdatesPlugins &&
			store.autoUpdatesThemes
		) {
			setAutoUpdatesAll( true );
		} else {
			setAutoUpdatesAll( false );
		}
	}, [
		store.autoUpdatesMajorCore,
		store.autoUpdatesPlugins,
		store.autoUpdatesThemes,
	] );

	useUpdateEffect( () => {
		setStore( {
			...store,
			autoUpdatesAll,
		} );

		notifySuccess();
	}, [ autoUpdatesAll ] );

	return (
		<ToggleField
			id="autoupdate-all-toggle"
			label={ __( 'Manage All Updates', 'wp-plugin-hostgator' ) }
			checked={ autoUpdatesAll }
			onChange={ toggleAutoUpdatesAll }
		/>
	);
};

const AutomaticUpdatesMajorCore = ( { setError, notify } ) => {
	const { store, setStore } = useContext( AppStore );
	const [ autoUpdatesMajorCore, setAutoUpdatesCore ] = useState(
		store.autoUpdatesMajorCore
	);

	const getCoreNoticeTitle = () => {
		return autoUpdatesMajorCore
			? __( 'Enabled Core auto-updates', 'wp-plugin-hostgator' )
			: __( 'Disabled Core auto-updates', 'wp-plugin-hostgator' );
	};
	const getCoreNoticeText = () => {
		return autoUpdatesMajorCore
			? __(
					'WordPress will automatically update.',
					'wp-plugin-hostgator'
			  )
			: __(
					'WordPress must be manually updated.',
					'wp-plugin-hostgator'
			  );
	};

	const toggleAutoUpdatesMajorCore = () => {
		hostgatorSettingsApiFetch(
			{ autoUpdatesMajorCore: ! autoUpdatesMajorCore },
			setError,
			( response ) => {
				setAutoUpdatesCore( ! autoUpdatesMajorCore );
			}
		);
	};

	const notifySuccess = () => {
		notify.push( 'major-core-autoupdate-notice', {
			title: getCoreNoticeTitle(),
			description: <span>{ getCoreNoticeText() }</span>,
			variant: 'success',
			autoDismiss: 5000,
		} );
	};

	useUpdateEffect( () => {
		setStore( {
			...store,
			autoUpdatesMajorCore,
		} );

		notifySuccess();
	}, [ autoUpdatesMajorCore ] );

	return (
		<ToggleField
			id="autoupdate-core-toggle"
			label={ __( 'WordPress Core', 'wp-plugin-hostgator' ) }
			checked={ autoUpdatesMajorCore || store.autoUpdatesAll }
			disabled={ store.autoUpdatesAll }
			onChange={ toggleAutoUpdatesMajorCore }
		/>
	);
};

const AutomaticUpdatesPlugins = ( { setError, notify } ) => {
	const { store, setStore } = useContext( AppStore );
	const [ autoUpdatesPlugins, setAutoUpdatesPlugins ] = useState(
		store.autoUpdatesPlugins
	);

	const getPluginsNoticeTitle = () => {
		return autoUpdatesPlugins
			? __( 'Enabled Plugins auto-update', 'wp-plugin-hostgator' )
			: __( 'Disabled Plugins auto-update', 'wp-plugin-hostgator' );
	};
	const getPluginsNoticeText = () => {
		return autoUpdatesPlugins
			? __(
					'All plugins will automatically update.',
					'wp-plugin-hostgator'
			  )
			: __(
					'Each plugin must be manually updated.',
					'wp-plugin-hostgator'
			  );
	};

	const toggleAutoUpdatesPlugins = () => {
		hostgatorSettingsApiFetch(
			{ autoUpdatesPlugins: ! autoUpdatesPlugins },
			setError,
			( response ) => {
				setAutoUpdatesPlugins( ! autoUpdatesPlugins );
			}
		);
	};

	const notifySuccess = () => {
		notify.push( 'plugins-autoupdate-notice', {
			title: getPluginsNoticeTitle(),
			description: <span>{ getPluginsNoticeText() }</span>,
			variant: 'success',
			autoDismiss: 5000,
		} );
	};

	useUpdateEffect( () => {
		setStore( {
			...store,
			autoUpdatesPlugins,
		} );

		notifySuccess();
	}, [ autoUpdatesPlugins ] );

	return (
		<ToggleField
			id="autoupdate-plugins-toggle"
			label={ __( 'Plugins', 'wp-plugin-hostgator' ) }
			checked={ autoUpdatesPlugins || store.autoUpdatesAll }
			disabled={ store.autoUpdatesAll }
			onChange={ toggleAutoUpdatesPlugins }
		/>
	);
};

const AutomaticUpdatesThemes = ( { setError, notify } ) => {
	const { store, setStore } = useContext( AppStore );
	const [ autoUpdatesThemes, setAutoUpdatesThemes ] = useState(
		store.autoUpdatesThemes
	);

	const getThemesNoticeTitle = () => {
		return autoUpdatesThemes
			? __( 'Enabled Themes auto-update', 'wp-plugin-hostgator' )
			: __( 'Disabled Themes auto-update', 'wp-plugin-hostgator' );
	};

	const getThemesNoticeText = () => {
		return autoUpdatesThemes
			? __(
					'All themes will automatically update.',
					'wp-plugin-hostgator'
			  )
			: __(
					'Each theme must be manually updated.',
					'wp-plugin-hostgator'
			  );
	};

	const toggleAutoUpdatesThemes = () => {
		hostgatorSettingsApiFetch(
			{ autoUpdatesThemes: ! autoUpdatesThemes },
			setError,
			( response ) => {
				setAutoUpdatesThemes( ! autoUpdatesThemes );
			}
		);
	};

	const notifySuccess = () => {
		notify.push( 'themes-autoupdate-notice', {
			title: getThemesNoticeTitle(),
			description: <span>{ getThemesNoticeText() }</span>,
			variant: 'success',
			autoDismiss: 5000,
		} );
	};

	useUpdateEffect( () => {
		setStore( {
			...store,
			autoUpdatesThemes,
		} );

		notifySuccess();
	}, [ autoUpdatesThemes ] );

	return (
		<ToggleField
			id="autoupdate-themes-toggle"
			label={ __( 'Themes', 'wp-plugin-hostgator' ) }
			checked={ autoUpdatesThemes || store.autoUpdatesAll }
			disabled={ store.autoUpdatesAll }
			onChange={ toggleAutoUpdatesThemes }
		/>
	);
};

const AutomaticUpdates = () => {
	const [ isError, setError ] = useState( false );

	const notify = useNotification();

	return (
		<Container.SettingsField
			title={ __( 'Automatic Updates', 'wp-plugin-hostgator' ) }
			description={ __(
				'Keeping automatic updates on ensures timely security fixes and the latest features.',
				'wp-plugin-hostgator'
			) }
		>
			<div className="nfd-flex nfd-flex-col nfd-gap-4">
				<AutomaticUpdatesAll setError={ setError } notify={ notify } />
				<AutomaticUpdatesMajorCore
					setError={ setError }
					notify={ notify }
				/>
				<AutomaticUpdatesPlugins
					setError={ setError }
					notify={ notify }
				/>
				<AutomaticUpdatesThemes
					setError={ setError }
					notify={ notify }
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
		</Container.SettingsField>
	);
};

export default AutomaticUpdates;
