import { Heading } from '../../components';
import graphicUrl from '../../../../assets/svg/a-illustration__checklist.svg';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
	Dashicon,
} from '@wordpress/components';
import { Icon, settings, store } from '@wordpress/icons';

const SettingsSection = () => {
	return (
		<section className="hgwp-section hgwp-section-home-settings">
			<img
				src={graphicUrl}
				className="section-graphic"
				alt={__('Settings illustration', 'wp-plugin-hostgator')}
			/>
			<Card size="large" className="hgwp-section-card">
				<CardHeader>
					<Heading level="3">
						{__('Settings and Performance', 'wp-plugin-hostgator')}
					</Heading>
					<p>
						{__(
							'Customize & fine-tune your site.',
							'wp-plugin-hostgator'
						)}
					</p>
				</CardHeader>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4">
							<Icon icon={settings} />{' '}
							{__('Manage Settings', 'wp-plugin-hostgator')}
						</Heading>
						<p>
							{__(
								'Manage your site settings. You can ajdust automatic updates, comments, revisions and more.',
								'wp-plugin-hostgator'
							)}
						</p>
					</div>
					<Button
						variant="primary"
						href="#/settings"
						icon={settings}
						className="callout-link-settings"
					>
						{__('Settings', 'wp-plugin-hostgator')}
					</Button>
				</CardFooter>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4">
							<Dashicon icon="performance" />{' '}
							{__('Performance', 'wp-plugin-hostgator')}
						</Heading>
						<p>
							{__(
								'Manage site performance and caching settings as well as clear the site cache.',
								'wp-plugin-hostgator'
							)}
						</p>
					</div>
					<Button
						variant="primary"
						href="#/performance"
						icon={<Dashicon icon="performance" />}
						className="callout-link-performance"
					>
						{__('Performance', 'wp-plugin-hostgator')}
					</Button>
				</CardFooter>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4">
							<Icon icon={store} />{' '}
							{__('Marketplace', 'wp-plugin-hostgator')}
						</Heading>
						<p>
							{__(
								'Add site services, themes or plugins from the marketplace.',
								'wp-plugin-hostgator'
							)}
						</p>
					</div>
					<Button
						variant="primary"
						href="#/marketplace"
						icon={store}
						className="callout-link-marketplace"
					>
						{__('Visit Marketplace', 'wp-plugin-hostgator')}
					</Button>
				</CardFooter>
			</Card>
		</section>
	);
};

export default SettingsSection;
