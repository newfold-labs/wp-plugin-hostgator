import Performance from './performance';
import { Page } from '../../components/page';
import { SectionContainer, SectionHeader, SectionContent } from '../../components/section';

const PerformancePage = () => {
	return (
		<Page title="Performance" className={"hgwp-app-settings-page"}>
			<SectionContainer className={'hgwp-app-settings-container'}>
				<SectionHeader
					title={__('Performance', 'wp-plugin-hostgator')}
					subTitle={__('This is where you can manage cache settings for your website.', 'wp-plugin-hostgator')}
					className={'hgwp-app-settings-header'}
				/>

				<SectionContent className={'hgwp-app-settings-performance'}>
					<Performance />
				</SectionContent>

			</SectionContainer>
		</Page>
	);
};

export default PerformancePage;
