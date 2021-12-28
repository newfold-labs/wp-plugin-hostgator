import { __ } from '@wordpress/i18n';
import {
	Card,
	CardBody,
	CardHeader,
	CardDivider,
	ToggleControl,
	__experimentalHeading as Heading
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useUpdateEffect } from 'react-use';
import AppStore from '../../data/store';
import {
	hostgatorApiFetch,
	dispatchUpdateSnackbar
} from './helpers';

const AutomaticUpdates = () => {
	const { store, setStore } = useContext(AppStore);
	const [ autoUpdatesMajorCore, setAutoUpdatesCore ] = useState( store.autoUpdatesMajorCore );
	const [ autoUpdatesPlugins, setAutoUpdatesPlugins ] = useState( store.autoUpdatesPlugins );
	const [ autoUpdatesThemes, setAutoUpdatesThemes ] = useState( store.autoUpdatesThemes );

	const getCoreNoticeText = () => {
        return autoUpdatesMajorCore ?
            __('Core autoupdates activated.', 'hostgator-wordpress-plugin') :
            __('Core autoupdates deactivated.', 'hostgator-wordpress-plugin')
    };
    const getCoreHelpText = () => {
        return autoUpdatesMajorCore ?
            __('WordPress will automatically update.', 'hostgator-wordpress-plugin') :
            __('WordPress must be manually updated.', 'hostgator-wordpress-plugin')
    };
	const getPluginsNoticeText = () => {
        return autoUpdatesPlugins ?
            __('Plugin autoupdates activated.', 'hostgator-wordpress-plugin') :
            __('Plugin autoupdates deactivated.', 'hostgator-wordpress-plugin')
    };
    const getPluginsHelpText = () => {
        return autoUpdatesPlugins ?
            __('All plugins will automatically update.', 'hostgator-wordpress-plugin') :
            __('Each plugin must be manually updated.', 'hostgator-wordpress-plugin')
    };
	const getThemesNoticeText = () => {
        return autoUpdatesThemes ?
            __('Theme autoupdates activated.', 'hostgator-wordpress-plugin') :
            __('Theme autoupdates deactivated.', 'hostgator-wordpress-plugin')
    };
    const getThemesHelpText = () => {
        return autoUpdatesThemes ?
            __('All themes will automatically update.', 'hostgator-wordpress-plugin') :
            __('Each theme must be manually updated.', 'hostgator-wordpress-plugin')
    };
	
	useUpdateEffect(() => {
		hostgatorApiFetch( { autoUpdatesMajorCore } ).then( () => {
			setStore({
				...store,
				autoUpdatesMajorCore
			});
			dispatchUpdateSnackbar( getCoreNoticeText() );
		});
	}, [autoUpdatesMajorCore]);

	useUpdateEffect(() => {
		hostgatorApiFetch( { autoUpdatesPlugins } ).then( () => {
			setStore({
				...store,
				autoUpdatesPlugins
			});
			dispatchUpdateSnackbar( getPluginsNoticeText() );
		});
	}, [autoUpdatesPlugins]);

	useUpdateEffect(() => {
		hostgatorApiFetch( { autoUpdatesThemes } ).then( () => {
			setStore({
				...store,
				autoUpdatesThemes
			});
			dispatchUpdateSnackbar( getThemesNoticeText() );
		});
	}, [autoUpdatesThemes]);


	return (
            <Card>
				<CardHeader>
					<Heading level="3">{ __('Automatic Updates', 'hostgator-wordpress-plugins') }</Heading>
				</CardHeader>
				<CardBody>
					{ __( 'Allow your site to stay updated automatically.', 'hostgator-wordpress-plugins' ) }
				</CardBody>
				<CardDivider />
				<CardBody>
					<ToggleControl
						label={ __( 'Core', 'hostgator-wordpress-plugin' ) }
						checked={ autoUpdatesMajorCore }
						help={ getCoreHelpText() }
						onChange={ () => {
							setAutoUpdatesCore( ( value ) => ! value );
						} }
					/>
				</CardBody>
				<CardDivider />
				<CardBody>
					<ToggleControl
						label={ __( 'Plugins', 'hostgator-wordpress-plugin' ) }
						checked={ autoUpdatesPlugins }
						help={ getPluginsHelpText() }
						onChange={ () => {
							setAutoUpdatesPlugins( ( value ) => ! value );
						} }
					/>
				</CardBody>
				<CardDivider />
				<CardBody>
					<ToggleControl
						label={ __( 'Themes', 'hostgator-wordpress-plugin' ) }
						checked={ autoUpdatesThemes }
						help={ getThemesHelpText() }
						onChange={ () => {
							setAutoUpdatesThemes( ( value ) => ! value );
						} }
					/>
				</CardBody>
			</Card>
    );
};

export default AutomaticUpdates;
