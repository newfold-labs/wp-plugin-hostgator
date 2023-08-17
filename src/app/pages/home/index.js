import { Page } from '../../components/page';
import { SectionContainer, SectionHeader, SectionContent } from '../../components/section';
import ComingSoon from '../settings/comingSoon';
import FreePluginsSection from './freeAddonsSection';
import SettingsSection from './settingsSection';
import WebContentSection from './webContentSection';
import WebHostingSection from './webHostingSection';
import WelcomeSection from './welcomeSection';

const Home = () => {
	return (
		<Page title="Settings" className={"hgwp-app-home-page"}>
			<SectionContainer className={'hgwp-app-home-container'}>
				<SectionHeader
					title={__('Home', 'wp-plugin-hostgator')}
					className={'hgwp-app-home-header'}
				/>
				<SectionContent separator={true} className={'hgwp-app-home-welcome'}>
					<WelcomeSection />
				</SectionContent>
				<SectionContent separator={true} className={'hgwp-app-home-free-plugins'}>
					<FreePluginsSection />
				</SectionContent>
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
