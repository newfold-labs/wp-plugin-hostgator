import graphicUrl from '../../../../assets/svg/a-illustration__testenvironment.svg';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
	Dashicon,
	__experimentalHeading as Heading,
} from '@wordpress/components';

const WebHostingSection = () => {
	return (
		<section className="hgwp-section hgwp-section-home-hosting">
			<img src={graphicUrl} className='section-graphic' alt={__('Hosting illustration', 'hostgator-wordpress-plugin')} />
			<Card size="large" className="hgwp-section-card">
				<CardHeader>
					<Heading level="3">
						{__('Web Hosting', 'hostgator-wordpress-plugin')}
					</Heading>
				</CardHeader>
				<CardBody>
					<p>
						{__(
							'Manage hosting in your HostGator portal account',
							'hostgator-wordpress-plugin'
						)}
					</p>
				</CardBody>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4">
							<Dashicon icon="desktop" />{' '}
							{__('Manage Sites', 'hostgator-wordpress-plugin')}
						</Heading>
						<p>
							{__(
								'Manage your site from the control panel. You can create backups, set security, and improve performance.',
								'hostgator-wordpress-plugin'
							)}
						</p>
					</div>
					<Button
						variant="primary"
						href={
							`https://portal.hostgator.com/packages?`+
							`&utm_campaign=`+
							`&utm_content=home_hosting_sites_link`+
							`&utm_term=manage_sites`+
							`&utm_medium=brand_plugin`+
							`&utm_source=wp-admin/admin.php?page=hostgator#/home`
						}
						target="_blank"
						icon="desktop"
					>
						{__('Manage Sites', 'hostgator-wordpress-plugin')}
					</Button>
				</CardFooter>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4">
							<Dashicon icon="email" />{' '}
							{__('Email', 'hostgator-wordpress-plugin')}
						</Heading>
						<p>
							{__(
								'Create email accounts, compose, send, and receive your email from the control panel.',
								'hostgator-wordpress-plugin'
							)}
						</p>
					</div>
					<Button
						variant="primary"
						href={
							`https://portal.hostgator.com/email?`+
							`&utm_campaign=`+
							`&utm_content=home_hosting_email_link`+
							`&utm_term=manage_email`+
							`&utm_medium=brand_plugin`+
							`&utm_source=wp-admin/admin.php?page=hostgator#/home`
						}
						target="_blank"
						icon="email"
					>
						{__('Manage Email', 'hostgator-wordpress-plugin')}
					</Button>
				</CardFooter>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4">
							<Dashicon icon="admin-site" />{' '}
							{__('Domains', 'hostgator-wordpress-plugin')}
						</Heading>
						<p>
							{__(
								'Find a new domain and assign it to your site or start a new site with a fresh domain.',
								'hostgator-wordpress-plugin'
							)}
						</p>
					</div>
					<Button
						variant="secondary"
						href={
							`https://portal.hostgator.com/domain/purchase/registration?`+
							`&utm_campaign=`+
							`&utm_content=home_hosting_domain_link`+
							`&utm_term=find_domain`+
							`&utm_medium=brand_plugin`+
							`&utm_source=wp-admin/admin.php?page=hostgator#/home`
						}
						target="_blank"
						icon="admin-site"
					>
						{__('Find a Domain', 'hostgator-wordpress-plugin')}
					</Button>
				</CardFooter>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4">
							<Dashicon icon="sos" />{' '}
							{__('Help', 'hostgator-wordpress-plugin')}
						</Heading>
						<p>{__('24/7/365 support. We work when you work.', 'hostgator-wordpress-plugin')}</p>
					</div>
					<Button
						variant="secondary"
						href="#/help"
						icon="sos"
						className="callout-link-help"
					>
						{__('Get Help', 'hostgator-wordpress-plugin')}
					</Button>
				</CardFooter>
			</Card>
		</section>
	);
};

export default WebHostingSection;
