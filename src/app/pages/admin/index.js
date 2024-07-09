import { Container, Page } from '@newfold/ui-component-library';
import HelpCenterSettings from '../settings/helpCenterSettings';
import WonderBlocksSettings from '../settings/wonderBlocksSettings';
import StagingFeatureSettings from '../settings/stagingFeatureSettings';
import PerformanceFeatureSettings from '../settings/performanceFeatureSettings';

const Admin = () => {
	return (
		<Page title="Admin" className={ 'hgwp-app-settings-page' }>
			<Container className={ 'hgwp-app-settings-container' }>
				<Container.Header
					title={ __( 'Admin', 'wp-plugin-hostgator' ) }
					description={ __(
						'Secret page to manage admin features and settings.',
						'wp-plugin-hostgator'
					) }
					className={ 'hgwp-app-settings-header' }
				/>

				<Container.Block
					separator={ true }
					id={ 'help-center' }
					className={ classNames( 'hgwp-app-admin' ) }
				>
					<Container.SettingsField
						title="Features"
						description="Toggle features – not settings."
					>
						<WonderBlocksSettings />
						<br />
						<HelpCenterSettings forceShow={ true } />
						<br />
						<StagingFeatureSettings />
						<br />
						<PerformanceFeatureSettings />
					</Container.SettingsField>
				</Container.Block>
			</Container>
		</Page>
	);
};

export default Admin;
