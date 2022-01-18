import { ReactComponent as Graphic } from '../../../../assets/svg/a-illustration__testenvironment.svg';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardMedia,
	CardFooter,
	Dashicon,
    __experimentalHeading as Heading
} from '@wordpress/components';

const WebHostingSection = () => {
	
	return (
        <section className="hgwp-section">
            <Graphic className="hgwp-section-graphic" />
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
                    <Button variant="primary" href="https://portal.hostgator.com/packages" target="_blank" icon="desktop">Manage Sites</Button>
                </CardFooter>
                <CardFooter>
                    <div className="hgwp-cardlist-content">
                        <Heading level="4"><Dashicon icon="email" /> Email</Heading>
                        <p>Create email accounts, compose, send, and receive your email from the control panel.</p>
                    </div>
                    <Button variant="primary" href="https://portal.hostgator.com/email" target="_blank" icon="email">Manage Email</Button>
                </CardFooter>
                <CardFooter>
                    <div className="hgwp-cardlist-content">
                        <Heading level="4"><Dashicon icon="admin-site" /> Domains</Heading>
                        <p>Find a new domain and assign it to your site or start a new site with a fresh domain.</p>
                    </div>
                    <Button variant="secondary" href="https://portal.hostgator.com/domain/purchase/registration" target="_blank" icon="admin-site">Find a Domain</Button>
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
    );
};

export default WebHostingSection;