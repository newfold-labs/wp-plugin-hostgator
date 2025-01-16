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
			linkPrefetchDescription: __(
				'Asks the browser to download and cache links on the page ahead of them being clicked on, so that when they are clicked they load almost instantly. ',
				'wp-plugin-hostgator'
			),
			linkPrefetchNoticeTitle: __(
				'Link prefetching setting saved',
				'wp-plugin-hostgator'
			),
			linkPrefetchTitle: __( 'Link Prefetch', 'wp-plugin-hostgator' ),
			linkPrefetchActivateOnDesktopDescription: __(
				'Enable link prefetching on desktop',
				'wp-plugin-hostgator'
			),
			linkPrefetchActivateOnDesktopLabel: __(
				'Activate on desktop',
				'wp-plugin-hostgator'
			),
			linkPrefetchBehaviorDescription: __(
				'Behavior of the prefetch',
				'wp-plugin-hostgator'
			),
			linkPrefetchBehaviorLabel: __( 'Behavior', 'wp-plugin-hostgator' ),
			linkPrefetchBehaviorMouseDownLabel: __(
				'Prefetch on Mouse down',
				'wp-plugin-hostgator'
			),
			linkPrefetchBehaviorMouseDownDescription: __(
				'Prefetch on Mouse Down: Starts loading the page as soon as you click down, for faster response when you release the click.',
				'wp-plugin-hostgator'
			),
			linkPrefetchBehaviorMouseHoverLabel: __(
				'Prefetch on Mouse Hover (Recommended)',
				'wp-plugin-hostgator'
			),
			linkPrefetchBehaviorMouseHoverDescription: __(
				'Prefetch on Mouse Hover: Begins loading the page the moment your cursor hovers over a link',
				'wp-plugin-hostgator'
			),
			linkPrefetchActivateOnMobileDescription: __(
				'Enable link prefetching on Mobile',
				'wp-plugin-hostgator'
			),
			linkPrefetchActivateOnMobileLabel: __(
				'Activate on mobile',
				'wp-plugin-hostgator'
			),
			linkPrefetchBehaviorMobileTouchstartLabel: __(
				'Prefetch on Touchstart (Recommended)',
				'wp-plugin-hostgator'
			),
			linkPrefetchBehaviorMobileTouchstartDescription: __(
				'Prefetch on Touch Start: Instantly starts loading the page as soon as you tap the screen, ensuring a quicker response when you lift your finger.',
				'wp-plugin-hostgator'
			),
			linkPrefetchBehaviorMobileViewportLabel: __(
				'Prefetch Above the Fold',
				'wp-plugin-hostgator'
			),
			linkPrefetchBehaviorMobileViewportDescription: __(
				"Prefetch Above the Fold: Loads links in your current view instantly, ensuring they're ready when you need them.",
				'wp-plugin-hostgator'
			),
			linkPrefetchIgnoreKeywordsDescription: __(
				'Exclude Keywords: A comma separated list of words or strings that will exclude a link from being prefetched. For example, excluding "app" will prevent https://example.com/apple from being prefetched.',
				'wp-plugin-hostgator'
			),
			linkPrefetchIgnoreKeywordsLabel: __(
				'Exclude keywords',
				'wp-plugin-hostgator'
			),
			performanceAdvancedSettingsTitle: __(
				'Advanced settings',
				'wp-plugin-hostgator'
			),
			performanceAdvancedSettingsDescription: __(
				'Additional speed and scalability features powered by Jetpack Boost to make your site as fast as it can be.',
				'wp-plugin-hostgator'
			),
			jetpackBoostCriticalCssTitle: __(
				'Optimize Critical CSS Loading (manual)',
				'wp-plugin-hostgator'
			),
			jetpackBoostCriticalCssDescription: __(
				'Move important styling information to the start of the page, which helps pages display your content sooner, so your users don’t have to wait for the entire page to load.',
				'wp-plugin-hostgator'
			),
			jetpackBoostCriticalCssPremiumTitle: __(
				'Optimize Critical CSS Loading (UPGRADED)',
				'wp-plugin-hostgator'
			),
			jetpackBoostCriticalCssUpgradeTitle: __(
				'Generate Critical CSS Automatically',
				'wp-plugin-hostgator'
			),
			jetpackBoostCriticalCssPremiumDescription: sprintf(
				// translators: %1$s is a line break (<br>), %2$s is the opening <strong> tag, %3$s is the closing </strong> tag.
				__(
					'Move important styling information to the start of the page, which helps pages display your content sooner, so your users don’t have to wait for the entire page to load.%1$s %2$sBoost will automatically generate your Critical CSS%3$s whenever you make changes to the HTML or CSS structure of your site.',
					'wp-plugin-hostgator'
				),
				'<br>',
				'<strong>',
				'</strong>'
			),
			jetpackBoostRenderBlockingTitle: __(
				'Defer Non-Essential JavaScript',
				'wp-plugin-hostgator'
			),
			jetpackBoostRenderBlockingDescription: __(
				'Run non-essential JavaScript after the page has loaded so that styles and images can load more quickly.',
				'wp-plugin-hostgator'
			),
			jetpackBoostMinifyJsTitle: __(
				'Concatenate JS',
				'wp-plugin-hostgator'
			),
			jetpackBoostMinifyJsDescription: __(
				'Scripts are grouped by their original placement, concatenated and minified to reduce site loading time and reduce the number of requests.',
				'wp-plugin-hostgator'
			),
			jetpackBoostExcludeJsTitle: __(
				'Exclude JS Strings',
				'wp-plugin-hostgator'
			),
			jetpackBoostMinifyCssTitle: __(
				'Concatenate CSS',
				'wp-plugin-hostgator'
			),
			jetpackBoostMinifyCssDescription: __(
				'Styles are grouped by their original placement, concatenated and minified to reduce site loading time and reduce the number of requests.',
				'wp-plugin-hostgator'
			),
			jetpackBoostExcludeCssTitle: __(
				'Exclude CSS Strings',
				'wp-plugin-hostgator'
			),
			jetpackBoostShowMore: __( 'Show more', 'wp-plugin-hostgator' ),
			jetpackBoostShowLess: __( 'Show less', 'wp-plugin-hostgator' ),
			jetpackBoostDicoverMore: __(
				'Discover More',
				'wp-plugin-hostgator'
			),
			jetpackBoostCtaText: __(
				'Install Jetpack Boost to unlock',
				'wp-plugin-hostgator'
			),
			jetpackBoostInstalling: __(
				'Installing Jetpack Boost…',
				'wp-plugin-hostgator'
			),
			jetpackBoostActivated: __(
				'Jetpack Boost is now active',
				'wp-plugin-hostgator'
			),
			jetpackBoostActivationFailed: __(
				'Activation failed',
				'wp-plugin-hostgator'
			),
			// translators: %1$s is the opening <a> tag, %2$s is the closing </a> tag.
			jetpackBoostDiscoverMore: __(
				'Discover more %1$shere%2$s',
				'wp-plugin-hostgator'
			),
			optionSet: __( 'Option saved correctly', 'wp-plugin-hostgator' ),
			optionNotSet: __( 'Error saving option', 'wp-plugin-hostgator' ),
			// Image Optimization
			imageOptimizationSettingsTitle: __(
				'Image Optimization',
				'wp-plugin-hostgator'
			),
			imageOptimizationSettingsDescription: __(
				'We automatically optimize your uploaded images to WebP format for faster performance and reduced file sizes. You can also choose to delete the original images to save storage space.',
				'wp-plugin-hostgator'
			),
			imageOptimizationEnabledLabel: __(
				'Enable Image Optimization',
				'wp-plugin-hostgator'
			),
			imageOptimizationEnabledDescription: __(
				'Enable or disable image optimization globally.',
				'wp-plugin-hostgator'
			),
			imageOptimizationAutoOptimizeLabel: __(
				'Automatically Optimize Uploaded Images',
				'wp-plugin-hostgator'
			),
			imageOptimizationAutoOptimizeDescription: __(
				'When enabled, all your new image uploads will be automatically optimized to WebP format, ensuring faster page loading and reduced file sizes.',
				'wp-plugin-hostgator'
			),
			imageOptimizationAutoDeleteLabel: __(
				'Auto Delete Original Image',
				'wp-plugin-hostgator'
			),
			imageOptimizationAutoDeleteDescription: __(
				'When enabled, the original uploaded image is deleted and replaced with the optimized version, helping to save storage space. If disabled, the optimized image is saved as a separate file, retaining the original.',
				'wp-plugin-hostgator'
			),
			imageOptimizationNoSettings: __(
				'No settings available.',
				'wp-plugin-hostgator'
			),
			imageOptimizationErrorMessage: __(
				'Oops! Something went wrong. Please try again.',
				'wp-plugin-hostgator'
			),
			imageOptimizationLoadingMessage: __(
				'Loading settings…',
				'wp-plugin-hostgator'
			),
			imageOptimizationUpdatedTitle: __(
				'Settings updated successfully',
				'wp-plugin-hostgator'
			),
			imageOptimizationUpdatedDescription: __(
				'Your image optimization settings have been saved.',
				'wp-plugin-hostgator'
			),
			imageOptimizationLazyLoadingLabel: __(
				'Enable Lazy Loading',
				'wp-plugin-hostgator'
			),
			imageOptimizationLazyLoadingDescription: __(
				'Lazy loading defers the loading of images until they are visible on the screen, improving page load speed and performance.',
				'wp-plugin-hostgator'
			),
			imageOptimizationLazyLoadingNoticeText: __(
				'Lazy loading has been updated.',
				'wp-plugin-hostgator'
			),
			imageOptimizationLazyLoadingErrorMessage: __(
				'Oops! There was an error updating the lazy loading settings.',
				'wp-plugin-hostgator'
			),
			imageOptimizationBulkOptimizeLabel: __(
				'Enable Bulk Optimization of Images',
				'wp-plugin-hostgator'
			),
			imageOptimizationBulkOptimizeDescription: __(
				'When enabled, allows bulk optimization of images in the media library.',
				'wp-plugin-hostgator'
			),
			imageOptimizationBulkOptimizeButtonLabel: __(
				'Go to Media Library',
				'wp-plugin-hostgator'
			),
			imageOptimizationUpdateErrorTitle: __(
				'Error Updating Settings',
				'wp-plugin-hostgator'
			),
			imageOptimizationPreferWebPLabel: __(
				'Prefer Optimized Image When Exists',
				'wp-plugin-hostgator'
			),
			imageOptimizationPreferWebPDescription: __(
				'When enabled, optimized images will be served in place of original images when they exist, improving performance.',
				'wp-plugin-hostgator'
			),
			imageOptimizationGenericErrorMessage: __(
				'Something went wrong while updating the settings. Please try again.',
				'wp-plugin-hostgator'
			),
		},
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
