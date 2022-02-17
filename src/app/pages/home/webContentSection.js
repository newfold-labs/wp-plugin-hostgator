import graphicUrl from '../../../../assets/svg/a-illustration__gator-scales-image-3_-notext.svg';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
	Dashicon,
	__experimentalHeading as Heading,
} from '@wordpress/components';

const WebContentSection = () => {
	return (
		<section className="hgwp-section hgwp-section-home-content">
			<img src={graphicUrl} className='section-graphic' alt={__('Website illustration', 'hostgator-wordpress-plugin')} />
			<Card size="large" className="hgwp-section-card">
				<CardHeader>
					<Heading level="3">
						{__('Website Content', 'hostgator-wordpress-plugin')}
					</Heading>
				</CardHeader>
				<CardBody>
					<p>
						{__(
							'Manage website content easily with these shortcut links.',
							'hostgator-wordpress-plugin'
						)}
					</p>
				</CardBody>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4">
							<Dashicon icon="admin-post" />{' '}
							{__('Blog', 'hostgator-wordpress-plugin')}
						</Heading>
						<p>
							{__(
								'Write a new blog post.',
								'hostgator-wordpress-plugin'
							)}
						</p>
					</div>
					<Button
						variant="primary"
						href={HGWP.admin + 'post-new.php'}
						icon="admin-post"
					>
						{' '}
						{__('New Post', 'hostgator-wordpress-plugin')}{' '}
					</Button>
				</CardFooter>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4">
							<Dashicon icon="welcome-add-page" />{' '}
							{__('Pages', 'hostgator-wordpress-plugin')}
						</Heading>
						<p>
							{__(
								'Add fresh pages to your website.',
								'hostgator-wordpress-plugin'
							)}
						</p>
					</div>
					<Button
						variant="primary"
						href={HGWP.admin + 'post-new.php?post_type=page'}
						icon="welcome-add-page"
					>
						{__('New Page', 'hostgator-wordpress-plugin')}
					</Button>
				</CardFooter>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4">
							<Dashicon icon="category" />{' '}
							{__('Categories', 'hostgator-wordpress-plugin')}
						</Heading>
						<p>
							{__(
								'Organize existing content into categories.',
								'hostgator-wordpress-plugin'
							)}
						</p>
					</div>
					<Button
						variant="secondary"
						href={HGWP.admin + 'edit-tags.php?taxonomy=category'}
						icon="category"
					>
						{__('Manage Categories', 'hostgator-wordpress-plugin')}
					</Button>
				</CardFooter>
			</Card>
		</section>
	);
};

export default WebContentSection;
