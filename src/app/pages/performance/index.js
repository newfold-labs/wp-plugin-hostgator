import AppStore from '../../data/store';
import { Container, Page } from '@newfold/ui-component-library';
import { useState, useEffect, useContext, Fragment } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __, sprintf } from '@wordpress/i18n';
import { useUpdateEffect } from 'react-use';
import { NewfoldRuntime } from '@newfold/wp-module-runtime';
import { useNotification } from 'App/components/notifications';
import {
	hostgatorSettingsApiFetch as newfoldSettingsApiFetch,
	hostgatorPurgeCacheApiFetch as newfoldPurgeCacheApiFetch,
} from '../../util/helpers';

import { default as NewfoldPerformance } from '../../../../vendor/newfold-labs/wp-module-performance/components/performance/';

const PerformancePage = () => {
	// constants to pass to module
	const moduleConstants = {
		text: {},
	};

	// methods to pass to module
	const moduleMethods = {
		apiFetch,
		useState,
		useEffect,
		useContext,
		NewfoldRuntime,
		useNotification,
		newfoldSettingsApiFetch,
		newfoldPurgeCacheApiFetch,
		useUpdateEffect,
		AppStore,
	};

	const moduleComponents = {
		Fragment,
	};

	return (
		<Page title="Performance" className={ 'hgwp-app-settings-page' }>
			<Container className={ 'hgwp-app-settings-container' }>
				<Container.Header
					title={ __( 'Performance', 'wp-plugin-hostgator' ) }
					description={ __(
						'This is where you can manage cache settings for your website.',
						'wp-plugin-hostgator'
					) }
					className={ 'hgwp-app-settings-header' }
				/>
				<NewfoldPerformance
					constants={ moduleConstants }
					methods={ moduleMethods }
					Components={ moduleComponents }
				/>
			</Container>
		</Page>
	);
};

export default PerformancePage;
