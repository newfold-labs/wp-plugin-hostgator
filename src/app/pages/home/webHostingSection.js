import { Heading } from '../../components';
import graphicUrl from '../../../../assets/svg/a-illustration__testenvironment.svg';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
	Dashicon
} from '@wordpress/components';

const WebHostingSection = () => {
	return (
		<section className="hgwp-section hgwp-section-home-hosting">
			<img src={graphicUrl} className='section-graphic' alt={__('Hosting illustration', 'wp-plugin-hostgator')} />
			<Card size="large" className="hgwp-section-card">
				<CardHeader>
					<Heading level="3">
						{__('Web Hosting', 'wp-plugin-hostgator')}
					</Heading>
				</CardHeader>
				<CardBody>
					<p>
						{__(
							'Manage hosting in your HostGator portal account',
							'wp-plugin-hostgator'
						)}
					</p>
				</CardBody>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4">
							<Dashicon icon="desktop" />{' '}
							{__('Manage Sites', 'wp-plugin-hostgator')}
						</Heading>
						<p>
							{__(
								'Manage your site from the control panel. You can create backups, set security, and improve performance.',
								'wp-plugin-hostgator'
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
						{__('Manage Sites', 'wp-plugin-hostgator')}
					</Button>
				</CardFooter>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4">
							<Dashicon icon="email" />{' '}
							{__('Email', 'wp-plugin-hostgator')}
						</Heading>
						<p>
							{__(
								'Create email accounts, compose, send, and receive your email from the control panel.',
								'wp-plugin-hostgator'
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
						{__('Manage Email', 'wp-plugin-hostgator')}
					</Button>
				</CardFooter>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4">
							<Dashicon icon="admin-site" />{' '}
							{__('Domains', 'wp-plugin-hostgator')}
						</Heading>
						<p>
							{__(
								'Find a new domain and assign it to your site or start a new site with a fresh domain.',
								'wp-plugin-hostgator'
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
						{__('Find a Domain', 'wp-plugin-hostgator')}
					</Button>
				</CardFooter>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4">
							<Dashicon icon="sos" />{' '}
							{__('Help', 'wp-plugin-hostgator')}
						</Heading>
						<p>{__('24/7/365 support. We work when you work.', 'wp-plugin-hostgator')}</p>
					</div>
					<Button
						variant="secondary"
						href="#/help"
						icon="sos"
						className="callout-link-help"
					>
						{__('Get Help', 'wp-plugin-hostgator')}
					</Button>
				</CardFooter>
			</Card>
		</section>
	);
};

export default WebHostingSection;
