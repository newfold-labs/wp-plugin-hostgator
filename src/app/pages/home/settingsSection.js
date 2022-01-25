import graphicUrl from '../../../../assets/svg/a-illustration__checklist.svg';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
	__experimentalHeading as Heading,
} from '@wordpress/components';
import { Icon, settings, trendingUp, store } from '@wordpress/icons';

const SettingsSection = () => {
	return (
		<section className="hgwp-section">
			<img src={graphicUrl} className='section-graphic' />
			<Card size="large" className="hgwp-section-card">
				<CardHeader>
					<Heading level="2">
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
					<Button variant="primary" href="#/settings" icon={settings}>
						{__('Settings', 'hostgator-wordpress-plugin')}
					</Button>
				</CardFooter>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4">
							<Icon icon={trendingUp} />{' '}
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
						icon={trendingUp}
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
					<Button variant="primary" href="#/marketplace" icon={store}>
						{__('Visit Marketplace', 'hostgator-wordpress-plugin')}
					</Button>
				</CardFooter>
			</Card>
		</section>
	);
};

export default SettingsSection;
