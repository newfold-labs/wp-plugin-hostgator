import './stylesheet.scss';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { NewfoldRuntime } from '@newfold/wp-module-runtime';
import { useNotification } from 'App/components/notifications';
// component sourced from staging module
import { default as NewfoldStaging } from '../../../../vendor/newfold-labs/wp-module-staging/components/staging/';

const Staging = () => {
	// constants to pass to module
	const moduleConstants = {
		text: {
			cancel: __( 'Cancel', 'wp-plugin-hostgator' ),
			clone: __( 'Clone', 'wp-plugin-hostgator' ),
			cloneConfirm: __( 'Confirm Clone Action', 'wp-plugin-hostgator' ),
			cloneDescription: __(
				'This will overwrite anything in staging and update it to an exact clone of the current production site. Are you sure you want to proceed?',
				'wp-plugin-hostgator'
			),
			cloneNoticeCompleteText: __(
				'Cloned to Staging',
				'wp-plugin-hostgator'
			),
			cloneNoticeStartText: __(
				'Cloning production to staging, this should take about a minute.',
				'wp-plugin-hostgator'
			),
			cloneStagingSite: __( 'Clone to staging', 'wp-plugin-hostgator' ),
			created: __( 'Created', 'wp-plugin-hostgator' ),
			createNoticeCompleteText: __(
				'Staging Created',
				'wp-plugin-hostgator'
			),
			createNoticeStartText: __(
				'Creating a staging site, this should take about a minute.',
				'wp-plugin-hostgator'
			),
			createStagingSite: __(
				'Create staging site',
				'wp-plugin-hostgator'
			),
			currentlyEditing: __( 'Currently editing', 'wp-plugin-hostgator' ),
			delete: __( 'Delete', 'wp-plugin-hostgator' ),
			deleteConfirm: __( 'Confirm Delete', 'wp-plugin-hostgator' ),
			deleteDescription: __(
				"This will permanently delete staging site. Are you sure you want to proceed? You can recreate another staging site at any time, but any specific changes you've made to this staging site will be lost.",
				'wp-plugin-hostgator'
			),
			deleteNoticeCompleteText: __(
				'Deleted Staging',
				'wp-plugin-hostgator'
			),
			deleteNoticeStartText: __(
				'Deleting the staging site, this should take about a minute.',
				'wp-plugin-hostgator'
			),
			deleteSite: __( 'Delete Staging Site', 'wp-plugin-hostgator' ),
			deploy: __( 'Deploy', 'wp-plugin-hostgator' ),
			deployAll: __( 'Deploy all changes', 'wp-plugin-hostgator' ),
			deployConfirm: __( 'Confirm Deployment', 'wp-plugin-hostgator' ),
			deployDatabase: __( 'Deploy database only', 'wp-plugin-hostgator' ),
			deployDescription: __(
				'This will deploy staging to production and overwrite current production site. Are you sure you want to proceed?',
				'wp-plugin-hostgator'
			),
			deployFiles: __( 'Deploy files only', 'wp-plugin-hostgator' ),
			deployNoticeCompleteText: __( 'Deployed', 'wp-plugin-hostgator' ),
			deployNoticeStartText: __(
				'Deploying from staging to production, this should take about a minute.',
				'wp-plugin-hostgator'
			),
			deploySite: __( 'Deploy Site', 'wp-plugin-hostgator' ),
			error: __( 'Error', 'wp-plugin-hostgator' ),
			noStagingSite: "You don't have a staging site yet.",
			notCurrentlyEditing: __(
				'Not currently editing',
				'wp-plugin-hostgator'
			),
			proceed: __( 'Proceed', 'wp-plugin-hostgator' ),
			productionSiteTitle: __( 'Production Site', 'wp-plugin-hostgator' ),
			stagingSiteTitle: __( 'Staging Site', 'wp-plugin-hostgator' ),
			subTitle: __(
				'A staging site is a duplicate of your live site, offering a secure environment to experiment, test updates, and deploy when ready.',
				'wp-plugin-hostgator'
			),
			switch: __( 'Switch', 'wp-plugin-hostgator' ),
			switching: __( 'Switching', 'wp-plugin-hostgator' ),
			switchToProduction: __(
				'Switch to Production',
				'wp-plugin-hostgator'
			),
			switchToProductionDescription: __(
				'This will navigate you to the production environment',
				'wp-plugin-hostgator'
			),
			switchToProductionNoticeCompleteText: __(
				'Loading the production environment now.',
				'wp-plugin-hostgator'
			),
			switchToProductionNoticeStartText: __(
				'Switching to the production environment, this should take about a minute.',
				'wp-plugin-hostgator'
			),
			switchToStaging: __( 'Switch to Staging', 'wp-plugin-hostgator' ),
			switchToStagingDescription: __(
				'This will navigate you to the staging environment',
				'wp-plugin-hostgator'
			),
			switchToStagingNoticeCompleteText: __(
				'Loading the staging environment now.',
				'wp-plugin-hostgator'
			),
			switchToStagingNoticeStartText: __(
				'Switching to the staging environment, this should take about a minute.',
				'wp-plugin-hostgator'
			),
			title: __( 'Staging', 'wp-plugin-hostgator' ),
			unknownErrorMessage: __(
				'An unknown error has occurred.',
				'wp-plugin-hostgator'
			),
			working: __( 'Working…', 'wp-plugin-hostgator' ),
		},
	};

	// methods to pass to module
	const moduleMethods = {
		apiFetch,
		classNames,
		useState,
		useEffect,
		NewfoldRuntime,
		useNotification,
	};

	return (
		<NewfoldStaging
			constants={ moduleConstants }
			methods={ moduleMethods }
		/>
	);
};

export default Staging;
