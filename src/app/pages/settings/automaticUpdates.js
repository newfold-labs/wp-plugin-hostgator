import AppStore from '../../data/store';
import { Heading, ErrorCard } from '../../components';
import {
	hostgatorSettingsApiFetch,
	dispatchUpdateSnackbar,
} from '../../util/helpers';
import {
	Card,
	CardBody,
	CardHeader,
	CardDivider,
	ToggleControl
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useEffect } from 'react';
import { useUpdateEffect } from 'react-use';

const AutomaticUpdates = () => {
	const { store, setStore } = useContext(AppStore);
	const [autoUpdatesAll, setAutoUpdatesAll] = useState(
		store.autoUpdatesMajorCore && store.autoUpdatesPlugins && store.autoUpdatesThemes ? true : false
	);
	const [autoUpdatesMajorCore, setAutoUpdatesCore] = useState(
		store.autoUpdatesMajorCore
	);
	const [autoUpdatesPlugins, setAutoUpdatesPlugins] = useState(
		store.autoUpdatesPlugins
	);
	const [autoUpdatesThemes, setAutoUpdatesThemes] = useState(
		store.autoUpdatesThemes
	);
	const [isError, setError] = useState(false);

	const getAllNoticeText = () => {
		return autoUpdatesAll
			? __('Everything will auto-update.', 'wp-plugin-hostgator')
			: __('Custom auto-update settings.', 'wp-plugin-hostgator');
	};
	const getAllHelpText = () => {
		return autoUpdatesAll
			? __(
					'Yay! Everything will automatically update.',
					'wp-plugin-hostgator'
			  )
			: __(
					'Custom automatic update settings.',
					'wp-plugin-hostgator'
			  );
	};
	const getCoreNoticeText = () => {
		return autoUpdatesMajorCore
			? __('Core will auto-update.', 'wp-plugin-hostgator')
			: __('Core will not auto-update.', 'wp-plugin-hostgator');
	};
	const getCoreHelpText = () => {
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
	const getPluginsNoticeText = () => {
		return autoUpdatesPlugins
			? __('Plugins will auto-update.', 'wp-plugin-hostgator')
			: __(
					'Plugins will not auto-update.',
					'wp-plugin-hostgator'
			  );
	};
	const getPluginsHelpText = () => {
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
	const getThemesNoticeText = () => {
		return autoUpdatesThemes
			? __('Themes will auto-update.', 'wp-plugin-hostgator')
			: __(
					'Theme will not auto-update.',
					'wp-plugin-hostgator'
			  );
	};
	const getThemesHelpText = () => {
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

	useEffect(() => {
		if ( autoUpdatesMajorCore && autoUpdatesPlugins && autoUpdatesThemes ) {
			setAutoUpdatesAll( true );
		} else {
			setAutoUpdatesAll( false );
		}
	}, [autoUpdatesMajorCore, autoUpdatesPlugins, autoUpdatesThemes]);

	useUpdateEffect(() => {
		if ( autoUpdatesAll ) {
			setAutoUpdatesCore( autoUpdatesAll );
			setAutoUpdatesPlugins( autoUpdatesAll );
			setAutoUpdatesThemes( autoUpdatesAll );
			dispatchUpdateSnackbar( getAllNoticeText() );
		} else {
			// don't set anything, just enable them
		}
	}, [autoUpdatesAll]);

	useUpdateEffect(() => {
		hostgatorSettingsApiFetch({ autoUpdatesMajorCore }, setError, (response) => {
			setStore({
				...store,
				autoUpdatesMajorCore,
			});
			if ( !autoUpdatesAll ) {
				dispatchUpdateSnackbar( getCoreNoticeText() );
			}
		});
	}, [autoUpdatesMajorCore]);

	useUpdateEffect(() => {
		hostgatorSettingsApiFetch({ autoUpdatesPlugins }, setError, (response) => {
			setStore({
				...store,
				autoUpdatesPlugins,
			});
			if ( !autoUpdatesAll ) {
				dispatchUpdateSnackbar( getPluginsNoticeText() );
			}
		});
	}, [autoUpdatesPlugins]);

	useUpdateEffect(() => {
		hostgatorSettingsApiFetch({ autoUpdatesThemes }, setError, (response) => {
			setStore({
				...store,
				autoUpdatesThemes,
			});
			if ( !autoUpdatesAll ) {
				dispatchUpdateSnackbar( getThemesNoticeText() );
			}
		});
	}, [autoUpdatesThemes]);

	if ( isError ) {
		return <ErrorCard error={isError} />
	}
	return (
		<Card className="card-auto-updates">
			<CardHeader>
				<Heading level="3">
					{__('Automatic Updates', 'wp-plugin-hostgator')}
				</Heading>
			</CardHeader>
			<CardBody>
				{__(
					'Allow your site to stay updated automatically.',
					'wp-plugin-hostgator'
				)}
			</CardBody>
			<CardDivider />
			<CardBody 
				className="autoupdate-all-setting"
			>
				<ToggleControl
					label={__('Everything', 'wp-plugin-hostgator')}
					className="autoupdate-all-toggle"
					checked={autoUpdatesAll}
					help={getAllHelpText()}
					onChange={() => {
						setAutoUpdatesAll((value) => !value);
					}}
				/>
			</CardBody>
			<CardDivider />
			<CardBody 
				className={`autoupdate-core-setting  ${autoUpdatesAll  ? 'disabled' : ''}` }
			>
				<ToggleControl
					label={__('Core', 'wp-plugin-hostgator')}
					className="autoupdate-core-toggle"
					checked={autoUpdatesMajorCore}
					disabled={autoUpdatesAll}
					help={getCoreHelpText()}
					onChange={() => {
						setAutoUpdatesCore((value) => !value);
					}}
				/>
			</CardBody>
			<CardDivider />
			<CardBody 
				className={`autoupdate-plugin-setting  ${autoUpdatesAll  ? 'disabled' : ''}` }
				>
				<ToggleControl
					label={__('Plugins', 'wp-plugin-hostgator')}
					className="autoupdate-plugin-toggle"
					checked={autoUpdatesPlugins}
					disabled={autoUpdatesAll}
					help={getPluginsHelpText()}
					onChange={() => {
						setAutoUpdatesPlugins((value) => !value);
					}}
				/>
			</CardBody>
			<CardDivider />
			<CardBody 
				className={`autoupdate-theme-setting  ${autoUpdatesAll  ? 'disabled' : ''}` }
				>
				<ToggleControl
					label={__('Themes', 'wp-plugin-hostgator')}
					className="autoupdate-theme-toggle"
					checked={autoUpdatesThemes}
					disabled={autoUpdatesAll}
					help={getThemesHelpText()}
					onChange={() => {
						setAutoUpdatesThemes((value) => !value);
					}}
				/>
			</CardBody>
		</Card>
	);
};

export default AutomaticUpdates;
