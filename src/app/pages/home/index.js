import { Container, Page, Title } from '@newfold/ui-component-library';
import ComingSoon from '../settings/comingSoon';
import FreePluginsSection from './freeAddonsSection';
import SettingsSection from './settingsSection';
import WebContentSection from './webContentSection';
import WebHostingSection from './webHostingSection';
import WelcomeSection from './welcomeSection';
import WebinarsBanner from 'App/components/webinars-banner';

const Home = () => {
	return (
		<Page title="Settings" className={ 'hgwp-app-home-page hgwp-home xl:nfd-max-w-screen-lg' }>
			<div className="nfd-home__title-section">
				<Title className="nfd-mb-1 nfd-font-bold">
					{ __( 'Welcome to Bluehost', 'wp-plugin-bluehost' ) }
				</Title>
				<span className="nfd-text-sm">
					{ __(
						"We're very excited to get started with you!",
						'wp-plugin-bluehost'
					) }
				</span>
			</div>
			<WelcomeSection />
			<WebinarsBanner />
			<FreePluginsSection />
			
			<Container className={ 'hgwp-app-home-container nfd-max-w-full' }>
				<Container.Header
					title={ __( 'More', 'wp-plugin-hostgator' ) }
					className={ 'hgwp-app-home-header display-none' }
				/>
				<Container.Block
					separator={ true }
					className={ 'hgwp-app-home-coming-soon' }
				>
					<ComingSoon />
				</Container.Block>

				<Container.Block
					separator={ true }
					className={ 'hgwp-app-home-content' }
				>
					<WebContentSection />
				</Container.Block>

				<Container.Block
					separator={ true }
					className={ 'hgwp-app-home-settings' }
				>
					<SettingsSection />
				</Container.Block>

				<Container.Block
					separator={ false }
					className={ 'hgwp-app-home-hosting' }
				>
					<WebHostingSection />
				</Container.Block>
			</Container>
		</Page>
	);
};

export default Home;
