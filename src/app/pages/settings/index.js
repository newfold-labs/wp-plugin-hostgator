import { Container, Page, Title } from '@newfold/ui-component-library';
import ComingSoon from './comingSoon';
import AutomaticUpdates from './automaticUpdates';
import HelpCenterSettings from './helpCenterSettings';
import WonderBlocksSettings from './wonderBlocksSettings';
import CommentSettings from './commentSettings';
import ContentSettings from './contentSettings';

const Settings = () => {
	return (
		<Page title="Settings" className={ 'hgwp-app-settings-page' }>
			<div
				id={ 'settings-header' }
				className={ 'hgwp-app-settings-header' }
			>
				<Title as={ 'h1' } className={ 'nfd-mb-2' }>
					{ __( 'Settings', 'wp-plugin-hostgator' ) }
				</Title>
				<Title as={ 'h2' } className="nfd-font-normal nfd-text-[13px]">
					{ __(
						'This is where you can manage common settings for your website.',
						'wp-plugin-hostgator'
					) }
				</Title>
			</div>
			<Container className={ 'hgwp-app-settings-container' }>
				<Container.Block
					separator={ true }
					className={ 'hgwp-app-settings-coming-soon' }
				>
					<ComingSoon />
				</Container.Block>

				<Container.Block
					separator={ true }
					className={ 'hgwp-app-settings-wonder-blocks' }
				>
					<Container.SettingsField
						title={ __( 'Features', 'wp-plugin-hostgator' ) }
					></Container.SettingsField>
					<WonderBlocksSettings />
					<br />
					<HelpCenterSettings />
				</Container.Block>

				<Container.Block
					separator={ true }
					className={ 'hgwp-app-settings-update' }
				>
					<AutomaticUpdates />
				</Container.Block>

				<Container.Block
					separator={ true }
					className={ 'hgwp-app-settings-content' }
				>
					<ContentSettings />
				</Container.Block>

				<Container.Block className={ 'hgwp-app-settings-comments' }>
					<CommentSettings />
				</Container.Block>
			</Container>
		</Page>
	);
};

export default Settings;
