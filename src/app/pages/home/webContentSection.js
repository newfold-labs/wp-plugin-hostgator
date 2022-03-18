import { Heading } from '../../components';
import graphicUrl from '../../../../assets/svg/a-illustration__gator-scales-image-3_-notext.svg';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
	Dashicon
} from '@wordpress/components';

const WebContentSection = () => {
	return (
		<section className="hgwp-section hgwp-section-home-content">
			<img src={graphicUrl} className='section-graphic' alt={__('Website illustration', 'wp-plugin-hostgator')} />
			<Card size="large" className="hgwp-section-card">
				<CardHeader>
					<Heading level="3">
						{__('Website Content', 'wp-plugin-hostgator')}
					</Heading>
					<p>
						{ __(
							'Create, manage & sort your story.',
							'wp-plugin-web'
						) }
					</p>
				</CardHeader>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4">
							<Dashicon icon="admin-post" />{' '}
							{__('Blog', 'wp-plugin-hostgator')}
						</Heading>
						<p>
							{__(
								'Write a new blog post.',
								'wp-plugin-hostgator'
							)}
						</p>
					</div>
					<Button
						variant="primary"
						href={HGWP.admin + 'post-new.php'}
						icon="admin-post"
					>
						{' '}
						{__('New Post', 'wp-plugin-hostgator')}{' '}
					</Button>
				</CardFooter>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4">
							<Dashicon icon="welcome-add-page" />{' '}
							{__('Pages', 'wp-plugin-hostgator')}
						</Heading>
						<p>
							{__(
								'Add fresh pages to your website.',
								'wp-plugin-hostgator'
							)}
						</p>
					</div>
					<Button
						variant="primary"
						href={HGWP.admin + 'post-new.php?post_type=page'}
						icon="welcome-add-page"
					>
						{__('New Page', 'wp-plugin-hostgator')}
					</Button>
				</CardFooter>
				<CardFooter>
					<div className="hgwp-cardlist-content">
						<Heading level="4">
							<Dashicon icon="category" />{' '}
							{__('Categories', 'wp-plugin-hostgator')}
						</Heading>
						<p>
							{__(
								'Organize existing content into categories.',
								'wp-plugin-hostgator'
							)}
						</p>
					</div>
					<Button
						variant="secondary"
						href={HGWP.admin + 'edit-tags.php?taxonomy=category'}
						icon="category"
					>
						{__('Manage Categories', 'wp-plugin-hostgator')}
					</Button>
				</CardFooter>
			</Card>
		</section>
	);
};

export default WebContentSection;
