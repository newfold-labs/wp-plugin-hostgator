import './stylesheet.scss';
import { __ } from '@wordpress/i18n';
import { ReactComponent as Graphic } from '../../../../assets/svg/hg-build-website.svg';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardMedia,
	CardFooter,
	Dashicon
} from '@wordpress/components';
import { __experimentalHeading as Heading } from '@wordpress/components';

const Home = () => {
	
	return (
		<div className="hgwp-home ">
			
			<section className="hgwp-section">
			<Graphic className="hgwp-section-graphic" />
			<Card size="large" className="hgwp-section-card">
				<CardHeader>
					<Heading level="2">Website Content</Heading>
				</CardHeader>
				<CardBody>
					<p>Manage website content easily with these shortcut links.</p>
				</CardBody>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4"><Dashicon icon="admin-post" /> Blog</Heading>
						<p>Write a new blog post.</p>
					</div>
					<Button variant="primary" href={HGWP.admin + "post-new.php"} icon="admin-post"> New Post </Button>
				</CardFooter>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4"><Dashicon icon="welcome-add-page" /> Pages</Heading>
						<p>Add fresh pages to your website.</p>
					</div>
					<Button variant="primary" href={HGWP.admin + "post-new.php?post_type=page"} icon="welcome-add-page">New Page</Button>
				</CardFooter>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4"><Dashicon icon="menu" /> Navigation</Heading>
						<p>Adjust or edit your site's navigation menus.</p>
					</div>
					<Button variant="secondary" href={HGWP.admin + "customize.php?autofocus[panel]=nav_menus"} icon="menu">Manage Menus</Button>
				</CardFooter>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4"><Dashicon icon="category" /> Categories</Heading>
						<p>Organize existing content into categories.</p>
					</div>
					<Button variant="secondary" href={HGWP.admin + "edit-tags.php?taxonomy=category"} icon="category">Manage Categories</Button>
				</CardFooter>
			</Card>
			</section>
			
			<section className="hgwp-section">
			<img src="https://static.hostgator.com//img/My-Site.svg" className="hgwp-section-graphic" />
			<Card size="large" className="hgwp-section-card">
				<CardHeader>
					<Heading level="2">Web Hosting</Heading>
				</CardHeader>
				<CardBody>
					<p>Manage hosting in your HostGator portal account</p>
				</CardBody>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4"><Dashicon icon="desktop" /> Manage Sites</Heading>
						<p>Manage your site from the control panel. You can create backups, set security, and improve performance.</p>
					</div>
					<Button variant="primary" href="https://portal.hostgator.com/packages" icon="desktop">Manage Sites</Button>
				</CardFooter>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4"><Dashicon icon="email" /> Email</Heading>
						<p>Create email accounts, compose, send, and receive your email from the control panel.</p>
					</div>
					<Button variant="primary" href="https://portal.hostgator.com/email" icon="email">Manage Email</Button>
				</CardFooter>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4"><Dashicon icon="admin-site" /> Domains</Heading>
						<p>Find a new domain and assign it to your site or start a new site with a fresh domain.</p>
					</div>
					<Button variant="secondary" href="https://portal.hostgator.com/email" icon="admin-site">Find a Domain</Button>
				</CardFooter>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4"><Dashicon icon="sos" /> Help</Heading>
						<p>Get Help.</p>
					</div>
					<Button variant="secondary" href="#/help" icon="sos">Get Help</Button>
				</CardFooter>
			</Card>
			</section>
			
		</div>
	);
};

export default Home;