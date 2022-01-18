import { ReactComponent as Graphic } from '../../../../assets/svg/a-illustration__checklist.svg';

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
import {
	Icon,
	settings,
	trendingUp,
    store
} from "@wordpress/icons";

const SettingsSection = () => {
	
	return (
        <section className="hgwp-section">
            <Graphic className="hgwp-section-graphic" />
            <Card size="large" className="hgwp-section-card">
                <CardHeader>
                    <Heading level="2">Settings and Performance</Heading>
                </CardHeader>
                <CardBody>
                    <p>Manage your site within this dashboard</p>
                </CardBody>
                <CardFooter>
                    <div className="hgwp-cardlist-content">
                        <Heading level="4"><Icon icon={settings} /> Manage Settings</Heading>
                        <p>Manage your site settings. You can ajdust automatic updates, comments, revisions and more.</p>
                    </div>
                    <Button variant="primary" href="#/settings" icon={settings}>Settings</Button>
                </CardFooter>
                <CardFooter>
                    <div className="hgwp-cardlist-content">
                        <Heading level="4"><Icon icon={trendingUp} /> Performance</Heading>
                        <p>Manage site performance and caching settings as well as clear the site cache.</p>
                    </div>
                    <Button variant="primary" href="#/performance" icon={trendingUp}>Performance</Button>
                </CardFooter>
                <CardFooter>
                    <div className="hgwp-cardlist-content">
                        <Heading level="4"><Icon icon={store} /> Marketplace</Heading>
                        <p>Add site services, themes or plugins from the marketplace.</p>
                    </div>
                    <Button variant="primary" href="#/marketplace" icon={store}>Visit Marketplace</Button>
                </CardFooter>
            </Card>
        </section>
    );
};

export default SettingsSection;