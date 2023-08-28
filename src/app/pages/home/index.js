import { Page } from '../../components/page';
import { SectionContainer, SectionHeader, SectionContent } from '../../components/section';
import ComingSoon from '../settings/comingSoon';
import SettingsSection from './settingsSection';
import WebContentSection from './webContentSection';
import WebHostingSection from './webHostingSection';

const Home = () => {
	return (
		<Page title="Settings" className={"hgwp-app-home-page"}>
			<SectionContainer className={'hgwp-app-home-container'}>
				<SectionHeader
					title={__('Home', 'wp-plugin-hostgator')}
					className={'hgwp-app-home-header'}
				/>

				<SectionContent separator={true} className={'hgwp-app-home-coming-soon'}>
					<ComingSoon />
				</SectionContent>

				<SectionContent separator={true} className={'hgwp-app-home-content'}>
					<WebContentSection />
				</SectionContent>

				<SectionContent separator={true} className={'hgwp-app-home-settings'}>
					<SettingsSection />
				</SectionContent>

				<SectionContent separator={false} className={'hgwp-app-home-hosting'}>
					<WebHostingSection />
				</SectionContent>
			</SectionContainer>
		</Page>
	);
};

export default Home;
