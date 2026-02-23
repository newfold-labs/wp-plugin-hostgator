import { Container, Page, Title } from '@newfold/ui-component-library';
import ComingSoon from '../settings/comingSoon';
import SettingsSection from './settingsSection';
import WebContentSection from './webContentSection';
import WebHostingSection from './webHostingSection';
import WebinarsBanner from 'App/components/webinars-banner';

const Home = () => {

	useEffect(() => {
		// run when mounts
		const comingSoonPortal =
			document.getElementById('coming-soon-portal');

		if (comingSoonPortal) {
			window.NFDPortalRegistry.registerPortal(
				'coming-soon',
				comingSoonPortal
			);
		}

		// run when unmounts
		return () => {
			window.NFDPortalRegistry.unregisterPortal('coming-soon');
		};
	}, []);

	return (
		<Page
			title="Settings"
			className={'hgwp-app-home-page hgwp-home xl:nfd-max-w-screen-lg'}
		>
			<div className="nfd-home__title-section">
				<Title className="nfd-mb-1 nfd-font-bold">
					{__('Welcome to HostGator', 'wp-plugin-hostgator')}
				</Title>
				<span className="nfd-text-sm">
					{__(
						"We're very excited to get started with you!",
						'wp-plugin-hostgator'
					)}
				</span>
			</div>

			<Container className="nfd-max-w-full nfd-p-8">
				<div id="coming-soon-portal" />
			</Container>

			<WebinarsBanner />

			<Container className={'hgwp-app-home-container nfd-max-w-full'}>
				<Container.Header
					title={__('Quick Links', 'wp-plugin-hostgator')}
					className={'hgwp-app-home-header display-none'}
				/>

				<Container.Block
					separator={true}
					className={'hgwp-app-home-content'}
				>
					<WebContentSection />
				</Container.Block>

				<Container.Block
					separator={true}
					className={'hgwp-app-home-settings'}
				>
					<SettingsSection />
				</Container.Block>

				<Container.Block
					separator={false}
					className={'hgwp-app-home-hosting'}
				>
					<WebHostingSection />
				</Container.Block>
			</Container>
		</Page>
	);
};

export default Home;
