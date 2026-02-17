import { useEffect, useState } from '@wordpress/element';
import { Container, Page, Title } from '@newfold/ui-component-library';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';
import ComingSoon from './comingSoon';
import AutomaticUpdates from './automaticUpdates';
import HelpCenterSettings from './helpCenterSettings';
import WonderBlocksSettings from './wonderBlocksSettings';
import CommentSettings from './commentSettings';
import ContentSettings from './contentSettings';
import { waitForFeatures } from 'App/util/helpers';

const Settings = () => {
	const [isStagingEnabled, setIsStagingEnabled] = useState(true);
	const [isPerformanceEnabled, setIsPerformanceEnabled] = useState(true);
	const location = useLocation();

	const getFeature = async (featureName) => {
		const nfdFeatures = await waitForFeatures();
		return nfdFeatures.features[featureName] || false;
	};

	useEffect(() => {
		if (!isStagingEnabled && !isPerformanceEnabled) {
			const settingsDetails =
				document.querySelector('.settings-details');
			if (settingsDetails) {
				settingsDetails.setAttribute('open', 'true');
			}
		}
	}, [isStagingEnabled, isPerformanceEnabled]);

	useEffect(() => {
		getFeature('staging').then(setIsStagingEnabled);
		getFeature('performance').then(setIsPerformanceEnabled);

		const stagingPortal = document.getElementById('staging-portal');
		const performancePortal =
			document.getElementById('performance-portal');
		if (stagingPortal) {
			window.NFDPortalRegistry.registerPortal('staging', stagingPortal);
		}
		if (performancePortal) {
			window.NFDPortalRegistry.registerPortal(
				'performance',
				performancePortal
			);
		}
		return () => {
			window.NFDPortalRegistry.unregisterPortal('staging');
			window.NFDPortalRegistry.unregisterPortal('performance');
		};
	}, []);

	useEffect(() => {
		const path = location.pathname;
		const allDetails = document.querySelectorAll('.nfd-details');
		allDetails.forEach((details) => {
			details.removeAttribute('open');
		});
		const accordionMap = {
			'/settings/performance': '.performance-details',
			'/settings/staging': '.staging-details',
			'/settings/settings': '.settings-details',
		};
		const targetSelector = accordionMap[path];
		if (targetSelector) {
			const targetDetails = document.querySelector(targetSelector);
			if (targetDetails) {
				targetDetails.setAttribute('open', 'true');
			}
		}
	}, [location.pathname]);

	return (
		<Page title="Settings" className={'hgwp-app-settings-page'}>
			<div
				className={
					'hgwp-app-settings-page__header nfd-flex nfd-flex-col nfd-gap-y-4'
				}
			>
				<Title as="h1">
					{__('Manage WordPress', 'wp-plugin-hostgator')}
				</Title>
				<Title
					as="h2"
					className="nfd-font-normal nfd-text-[13px] nfd-color-body"
				>
					{__(
						'Optimize your website my managing cache, security and performance settings.',
						'wp-plugin-hostgator'
					)}
				</Title>
			</div>
			{isPerformanceEnabled && (
				<Container
					id="nfd-performance"
					className={'nfd-settings-app-wrapper nfd-performance performance-fill'}
				>
					<details className="nfd-details settings-app-wrapper performance-details">
						<summary>
							<div
								id={'performance-header'}
								className={'hgwp-app-performance-header'}
							>
								<Title as={'h1'} className={'nfd-mb-2'}>
									{__(
										'Performance',
										'wp-plugin-hostgator'
									)}
								</Title>
								<Title
									as={'h2'}
									className="nfd-font-normal nfd-text-[13px]"
								>
									{__(
										'Optimize your website by managing cache and performance settings',
										'wp-plugin-hostgator'
									)}
								</Title>
							</div>
							<span className="nfd-details-icon">
								<ChevronUpIcon />
							</span>
						</summary>
						<div id="nfd-performance-portal-wrapper">
							<div id="performance-portal"></div>
						</div>
					</details>
				</Container>
			)}
			<Container
				className={
					'nfd-settings-app-wrapper hgwp-app-settings-container'
				}
			>
				<details className="nfd-details settings-app-wrapper settings-details">
					<summary>
						<div
							id={'settings-header'}
							className={'hgwp-app-settings-header'}
						>
							<Title as={'h1'} className={'nfd-mb-2'}>
								{__(
									'General Settings',
									'wp-plugin-hostgator'
								)}
							</Title>
							<Title
								as={'h2'}
								className="nfd-font-normal nfd-text-[13px]"
							>
								{__(
									'This is where you can manage common settings for your website.',
									'wp-plugin-hostgator'
								)}
							</Title>
						</div>
						<span className="nfd-details-icon">
							<ChevronUpIcon />
						</span>
					</summary>
					<Container.Block
						separator={true}
						className={'hgwp-app-settings-coming-soon'}
					>
						<ComingSoon />
					</Container.Block>

					<Container.Block
						separator={true}
						className={'hgwp-app-settings-wonder-blocks'}
					>
						<Container.SettingsField
							title={__('Features', 'wp-plugin-hostgator')}
						></Container.SettingsField>
						<WonderBlocksSettings />
						<br />
						<HelpCenterSettings />
					</Container.Block>

					<Container.Block
						separator={true}
						className={'hgwp-app-settings-update'}
					>
						<AutomaticUpdates />
					</Container.Block>

					<Container.Block
						separator={true}
						className={'hgwp-app-settings-content'}
					>
						<ContentSettings />
					</Container.Block>

					<Container.Block className={'hgwp-app-settings-comments'}>
						<CommentSettings />
					</Container.Block>
				</details>
			</Container>
			{isStagingEnabled && (
				<Container className={'nfd-settings-app-wrapper nfd-staging staging-fill'}>
					<details className="nfd-details settings-app-wrapper staging-details">
						<summary>
							<div
								id={'staging-header'}
								className={'hgwp-app-staging-header'}
							>
								<Title as={'h1'} className={'nfd-mb-2'}>
									{__('Staging', 'wp-plugin-hostgator')}
								</Title>
								<Title
									as={'h2'}
									className="nfd-font-normal nfd-text-[13px]"
								>
									{__(
										'A staging site is a duplicate of your live site, offering a secure environment to experiment, test updates, and deploy when ready.',
										'wp-plugin-hostgator'
									)}
								</Title>
							</div>
							<span className="nfd-details-icon">
								<ChevronUpIcon />
							</span>
						</summary>
						<div
							id="nfd-staging-portal-wrapper"
							className="nfd-staging"
						>
							<div id="staging-portal"></div>
						</div>
					</details>
				</Container>
			)}
		</Page>
	);
};

export default Settings;
