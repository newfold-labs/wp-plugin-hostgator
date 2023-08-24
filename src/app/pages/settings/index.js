import AutomaticUpdates from './automaticUpdates';
import ComingSoon from './comingSoon';
import CommentSettings from './commentSettings';
import ContentSettings from './contentSettings';
import { Page } from '../../components/page';
import { SectionContainer, SectionHeader, SectionContent } from '../../components/section';

const Settings = () => {
	return (
		<Page title="Settings" className={"hgwp-app-settings-page"}>
			<SectionContainer className={'hgwp-app-settings-container'}>
				<SectionHeader
					title={__('Settings', 'wp-plugin-hostgator')}
					subTitle={__('This is where you can manage common settings for your website.', 'wp-plugin-hostgator')}
					className={'hgwp-app-settings-header'}
				/>

				<SectionContent separator={true} className={'hgwp-app-settings-coming-soon'}>
					<ComingSoon />
				</SectionContent>

				<SectionContent separator={true} className={'hgwp-app-settings-update'}>
					<AutomaticUpdates />
				</SectionContent>

				<SectionContent separator={true} className={'hgwp-app-settings-content'}>
					<ContentSettings />
				</SectionContent>

				<SectionContent className={'hgwp-app-settings-comments'}>
					<CommentSettings />
				</SectionContent>

			</SectionContainer>
		</Page>
	);
};

export default Settings;