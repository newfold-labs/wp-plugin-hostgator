import { ReactComponent as Graphic } from '../../../../assets/svg/hg-build-website.svg';
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

const WebContentSection = () => {
	
	return (
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
    );
};

export default WebContentSection;