import AppStore from '../../data/store';
import { Container, Page } from '@newfold/ui-component-library';
import { useState, useEffect, useContext, Fragment } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import classnames from 'classnames';
import { useUpdateEffect } from 'react-use';
import { NewfoldRuntime } from '@newfold-labs/wp-module-runtime';
import { useNotification } from 'App/components/notifications';
import {
	hostgatorSettingsApiFetch as newfoldSettingsApiFetch,
	hostgatorPurgeCacheApiFetch as newfoldPurgeCacheApiFetch,
} from '../../util/helpers';

import { default as NewfoldPerformance } from '../../../../vendor/newfold-labs/wp-module-performance/components/performance/';

const PerformancePage = () => {
	// constants to pass to module
	const moduleConstants = {
		text: {
			cacheLevel0Description:
				__( 'No cache enabled.', 'wp-plugin-hostgator' ) +
				' ' +
				__( 'Every page load is fresh.', 'wp-plugin-hostgator' ) +
				' ',
			cacheLevel0Label: __( 'Disabled', 'wp-plugin-hostgator' ),
			cacheLevel0NoticeText:
				__( 'No cache enabled.', 'wp-plugin-hostgator' ) +
				' ' +
				__( 'Every page load is fresh.', 'wp-plugin-hostgator' ),
			cacheLevel0Recommendation: __(
				'Not recommended.',
				'wp-plugin-hostgator'
			),
			cacheLevel1Description:
				__(
					'Cache static assets like images and the appearance of your site for 1 hour.',
					'wp-plugin-hostgator'
				) + ' ',
			cacheLevel1Label: __( 'Assets Only', 'wp-plugin-hostgator' ),
			cacheLevel1NoticeText: __(
				'Cache enabled for assets only.',
				'wp-plugin-hostgator'
			),
			cacheLevel1Recommendation: __(
				'Recommended for ecommerce and sites that update frequently or display info in real-time.',
				'wp-plugin-hostgator'
			),
			cacheLevel2Description:
				__(
					'Cache static assets for 24 hours and web pages for 2 hours.',
					'wp-plugin-hostgator'
				) + ' ',
			cacheLevel2Label: __( 'Assets & Web Pages', 'wp-plugin-hostgator' ),
			cacheLevel2NoticeText: __(
				'Cache enabled for assets and pages.',
				'wp-plugin-hostgator'
			),
			cacheLevel2Recommendation: __(
				'Recommended for blogs, educational sites, and sites that update at least weekly.',
				'wp-plugin-hostgator'
			),
			cacheLevel3Description:
				__(
					'Cache static assets for 1 week and web pages for 8 hours.',
					'wp-plugin-hostgator'
				) + ' ',
			cacheLevel3Label: __(
				'Assets & Web Pages - Extended',
				'wp-plugin-hostgator'
			),
			cacheLevel3NoticeText: __(
				'Cache enabled for assets and pages (extended).',
				'wp-plugin-hostgator'
			),
			cacheLevel3Recommendation: __(
				'Recommended for sites that update a few times a month or less like porfolios or brochure sites.',
				'wp-plugin-hostgator'
			),
			cacheLevelDescription: __(
				'Boost speed and performance by storing a copy of your website content, files, and images online so the pages of your website load faster for your visitors.',
				'wp-plugin-hostgator'
			),
			cacheLevelNoticeTitle: __(
				'Cache setting saved',
				'wp-plugin-hostgator'
			),
			cacheLevelTitle: __( 'Cache Level', 'wp-plugin-hostgator' ),
			clearCacheButton: __(
				'Clear All Cache Now',
				'wp-plugin-hostgator'
			),
			clearCacheDescription: __(
				"We automatically clear your cache as you work (creating content, changing settings, installing plugins and more). But you can manually clear it here to be confident it's fresh.",
				'wp-plugin-hostgator'
			),
			clearCacheNoticeTitle: __( 'Cache cleared', 'wp-plugin-hostgator' ),
			clearCacheTitle: __( 'Clear Cache', 'wp-plugin-hostgator' ),
		},
	};

	// methods to pass to module
	const moduleMethods = {
		apiFetch,
		classnames,
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
