import {
	Card,
	CardBody,
	CardHeader,
	CardDivider,
	ToggleControl,
	__experimentalHeading as Heading,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useEffect } from 'react';
import { useUpdateEffect } from 'react-use';
import AppStore from '../../data/store';
import {
	hostgatorSettingsApiFetch,
	dispatchUpdateSnackbar,
} from '../../util/helpers';

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

	const getAllNoticeText = () => {
		return autoUpdatesAll
			? __('Everything will auto-update.', 'hostgator-wordpress-plugin')
			: __('Custom auto-update settings.', 'hostgator-wordpress-plugin');
	};
	const getAllHelpText = () => {
		return autoUpdatesAll
			? __(
					'Yay! Everything will automatically update.',
					'hostgator-wordpress-plugin'
			  )
			: __(
					'Custom automatic update settings.',
					'hostgator-wordpress-plugin'
			  );
	};
	const getCoreNoticeText = () => {
		return autoUpdatesMajorCore
			? __('Core will auto-update.', 'hostgator-wordpress-plugin')
			: __('Core will not auto-update.', 'hostgator-wordpress-plugin');
	};
	const getCoreHelpText = () => {
		return autoUpdatesMajorCore
			? __(
					'WordPress will automatically update.',
					'hostgator-wordpress-plugin'
			  )
			: __(
					'WordPress must be manually updated.',
					'hostgator-wordpress-plugin'
			  );
	};
	const getPluginsNoticeText = () => {
		return autoUpdatesPlugins
			? __('Plugins will auto-update.', 'hostgator-wordpress-plugin')
			: __(
					'Plugins will not auto-update.',
					'hostgator-wordpress-plugin'
			  );
	};
	const getPluginsHelpText = () => {
		return autoUpdatesPlugins
			? __(
					'All plugins will automatically update.',
					'hostgator-wordpress-plugin'
			  )
			: __(
					'Each plugin must be manually updated.',
					'hostgator-wordpress-plugin'
			  );
	};
	const getThemesNoticeText = () => {
		return autoUpdatesThemes
			? __('Themes will auto-update.', 'hostgator-wordpress-plugin')
			: __(
					'Theme will not auto-update.',
					'hostgator-wordpress-plugin'
			  );
	};
	const getThemesHelpText = () => {
		return autoUpdatesThemes
			? __(
					'All themes will automatically update.',
					'hostgator-wordpress-plugin'
			  )
			: __(
					'Each theme must be manually updated.',
					'hostgator-wordpress-plugin'
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
		dispatchUpdateSnackbar( getAllNoticeText() );
		if ( autoUpdatesAll ) {
			setAutoUpdatesCore( autoUpdatesAll );
			setAutoUpdatesPlugins( autoUpdatesAll );
			setAutoUpdatesThemes( autoUpdatesAll );
		} else {
			// don't set anything, just enable them
		}
	}, [autoUpdatesAll]);

	useUpdateEffect(() => {
		hostgatorSettingsApiFetch({ autoUpdatesMajorCore }).then(() => {
			setStore({
				...store,
				autoUpdatesMajorCore,
			});
			dispatchUpdateSnackbar( getCoreNoticeText() );
		});
	}, [autoUpdatesMajorCore]);

	useUpdateEffect(() => {
		hostgatorSettingsApiFetch({ autoUpdatesPlugins }).then(() => {
			setStore({
				...store,
				autoUpdatesPlugins,
			});
			dispatchUpdateSnackbar( getPluginsNoticeText() );
		});
	}, [autoUpdatesPlugins]);

	useUpdateEffect(() => {
		hostgatorSettingsApiFetch({ autoUpdatesThemes }).then(() => {
			setStore({
				...store,
				autoUpdatesThemes,
			});
			dispatchUpdateSnackbar( getThemesNoticeText() );
		});
	}, [autoUpdatesThemes]);

	return (
		<Card>
			<CardHeader>
				<Heading level="3">
					{__('Automatic Updates', 'hostgator-wordpress-plugins')}
				</Heading>
			</CardHeader>
			<CardBody>
				{__(
					'Allow your site to stay updated automatically.',
					'hostgator-wordpress-plugins'
				)}
			</CardBody>
			<CardDivider />
			<CardBody>
				<ToggleControl
					label={__('Everything', 'hostgator-wordpress-plugin')}
					checked={autoUpdatesAll}
					help={getAllHelpText()}
					onChange={() => {
						setAutoUpdatesAll((value) => !value);
					}}
				/>
			</CardBody>
			<CardDivider />
			<CardBody 
				className={ autoUpdatesAll  ? 'disabled' : '' }
			>
				<ToggleControl
					label={__('Core', 'hostgator-wordpress-plugin')}
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
				className={ autoUpdatesAll  ? 'disabled' : '' }
			>
				<ToggleControl
					label={__('Plugins', 'hostgator-wordpress-plugin')}
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
				className={ autoUpdatesAll  ? 'disabled' : '' }
			>
				<ToggleControl
					label={__('Themes', 'hostgator-wordpress-plugin')}
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
