import { __ } from '@wordpress/i18n';
import {
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

const AutomaticUpdates = () => {
	const { store, setStore } = useContext(AppStore);
	const [ isAutoUpdatesCore, setAutoUpdatesCore ] = useState( store.autoUpdatesMajorCore );
	const [ isAutoUpdatesPlugins, setAutoUpdatesPlugins ] = useState( store.autoUpdatesPlugins );
	const [ isAutoUpdatesThemes, setAutoUpdatesThemes ] = useState( store.autoUpdatesThemes );
	
	useEffect(() => {
		setStore({
			...store,
			autoUpdatesMajorCore: isAutoUpdatesCore,
		});
		//save setting to db
		apiFetch( { path: 'hostgator/v1/settings', method: 'POST', data: {
			autoUpdatesMajorCore: isAutoUpdatesCore
		} } );
	}, [isAutoUpdatesCore]);

	useEffect(() => {
		setStore({
			...store,
			autoUpdatesPlugins: isAutoUpdatesPlugins,
		});
		//save setting to db
		apiFetch( { path: 'hostgator/v1/settings', method: 'POST', data: {
			autoUpdatesPlugins: isAutoUpdatesPlugins
		} } );
	}, [isAutoUpdatesPlugins]);

	useEffect(() => {
		setStore({
			...store,
			autoUpdatesThemes: isAutoUpdatesThemes,
		});
		//save setting to db
		apiFetch( { path: 'hostgator/v1/settings', method: 'POST', data: {
			autoUpdatesThemes: isAutoUpdatesThemes
		} } );
	}, [isAutoUpdatesThemes]);


	return (
            <Card>
				<CardHeader>
					<Heading level="3">Automatic Updates</Heading>
				</CardHeader>
				<CardBody>
					Allow your site to stay updated automatically.
				</CardBody>
				<CardDivider />
				<CardBody>
					<ToggleControl
						label="Core"
						checked={ isAutoUpdatesCore }
						help={
							isAutoUpdatesCore
								? 'WordPress will automatically update.'
								: 'WordPress must be manually updated.'
						}
						onChange={ () => {
							setAutoUpdatesCore( ( state ) => ! state );
						} }
					/>
				</CardBody>
				<CardDivider />
				<CardBody>
					<ToggleControl
						label="Plugins"
						checked={ isAutoUpdatesPlugins }
						help={
							isAutoUpdatesPlugins
								? 'All plugins will automatically update.'
								: 'Each plugin must be manually updated.'
						}
						onChange={ () => {
							setAutoUpdatesPlugins( ( state ) => ! state );
						} }
					/>
				</CardBody>
				<CardDivider />
				<CardBody>
					<ToggleControl
						label="Themes"
						checked={ isAutoUpdatesThemes }
						help={
							isAutoUpdatesThemes
								? 'All themes will automatically update.'
								: 'Each theme must be manually updated.'
						}
						onChange={ () => {
							setAutoUpdatesThemes( ( state ) => ! state );
						} }
					/>
				</CardBody>
			</Card>
    );
};

export default AutomaticUpdates;
