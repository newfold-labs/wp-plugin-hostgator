import { Container, Page } from '@newfold/ui-component-library';
import AutomaticUpdates from './automaticUpdates';
import ComingSoon from './comingSoon';
import CommentSettings from './commentSettings';
import ContentSettings from './contentSettings';

const Settings = () => {
	return (
		<Page title="Settings" className={ 'hgwp-app-settings-page' }>
			<Container className={ 'hgwp-app-settings-container' }>
				<Container.Header
					title={ __( 'Settings', 'wp-plugin-hostgator' ) }
					description={ __(
						'This is where you can manage common settings for your website.',
						'wp-plugin-hostgator'
					) }
					className={ 'hgwp-app-settings-header' }
				/>

				<Container.Block
					separator={ true }
					className={ 'hgwp-app-settings-coming-soon' }
				>
					<ComingSoon />
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
