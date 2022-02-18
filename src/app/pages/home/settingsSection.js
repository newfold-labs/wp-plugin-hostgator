import graphicUrl from '../../../../assets/svg/a-illustration__checklist.svg';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
	Dashicon,
	__experimentalHeading as Heading,
} from '@wordpress/components';
import { Icon, settings, store } from '@wordpress/icons';

const SettingsSection = () => {
	return (
		<section className="hgwp-section hgwp-section-home-settings">
			<img src={graphicUrl} className='section-graphic' alt={__('Settings illustration', 'hostgator-wordpress-plugin')} />
			<Card size="large" className="hgwp-section-card">
				<CardHeader>
					<Heading level="3">
						{__(
							'Settings and Performance',
							'hostgator-wordpress-plugin'
						)}
					</Heading>
				</CardHeader>
				<CardBody>
					{__(
						'Manage your site within this dashboard',
						'hostgator-wordpress-plugin'
					)}
				</CardBody>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4">
							<Icon icon={settings} />{' '}
							{__(
								'Manage Settings',
								'hostgator-wordpress-plugin'
							)}
						</Heading>
						<p>
							{__(
								'Manage your site settings. You can ajdust automatic updates, comments, revisions and more.',
								'hostgator-wordpress-plugin'
							)}
						</p>
					</div>
					<Button 
						variant="primary"
						href="#/settings"
						icon={settings}
						className="callout-link-settings"
					>
						{__('Settings', 'hostgator-wordpress-plugin')}
					</Button>
				</CardFooter>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4">
							<Dashicon icon='performance' />{' '}
							{__('Performance', 'hostgator-wordpress-plugin')}
						</Heading>
						<p>
							{__(
								'Manage site performance and caching settings as well as clear the site cache.',
								'hostgator-wordpress-plugin'
							)}
						</p>
					</div>
					<Button
						variant="primary"
						href="#/performance"
						icon={<Dashicon icon='performance' />}
						className="callout-link-performance"
					>
						{__('Performance', 'hostgator-wordpress-plugin')}
					</Button>
				</CardFooter>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4">
							<Icon icon={store} />{' '}
							{__('Marketplace', 'hostgator-wordpress-plugin')}
						</Heading>
						<p>
							{__(
								'Add site services, themes or plugins from the marketplace.',
								'hostgator-wordpress-plugin'
							)}
						</p>
					</div>
					<Button 
						variant="primary"
						href="#/marketplace"
						icon={store}
						className="callout-link-marketplace"
					>
						{__('Visit Marketplace', 'hostgator-wordpress-plugin')}
					</Button>
				</CardFooter>
			</Card>
		</section>
	);
};

export default SettingsSection;
