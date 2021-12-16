import { __ } from '@wordpress/i18n';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	ToggleControl,
} from '@wordpress/components';
import { __experimentalHeading as Heading } from '@wordpress/components';

const Settings = () => {
	
	return (
		<div className="hgwp-Settings grid col2">

			<Card>
				<CardHeader>
					<Heading level="3">Automatic Updates</Heading>
				</CardHeader>
				<CardHeader>
					<strong>Core</strong>
					<ToggleControl
						// checked={true}
					/>
				</CardHeader>
				<CardHeader>
					<strong>Plugins</strong>
					<ToggleControl
						// help={'it some help'}
					/>
				</CardHeader>
				<CardHeader>
					<strong>Themes</strong>
					<ToggleControl
						// help={'it some help'}
					/>
				</CardHeader>
				<CardBody>
					Enable automatic updates for various parts of your site.
				</CardBody>
			</Card>

			<Card>
				<CardHeader>
					<Heading level="3">Comments</Heading>
				</CardHeader>
				<CardHeader>
					<strong>Disable comments for older posts</strong>
					<ToggleControl
						// checked={true}
					/>
				</CardHeader>
				<CardHeader>
					<strong>Close comments after __ days</strong>
					<ToggleControl
						// help={'it some help'}
					/>
				</CardHeader>
				<CardHeader>
					<strong>Display __ comments per page</strong>
					<ToggleControl
						// help={'it some help'}
					/>
				</CardHeader>
				<CardBody>
					Make comments disabled on older posts and control how many to display.
				</CardBody>
			</Card>

			<Card>
				<CardHeader>
					<Heading level="3">Coming Soon</Heading>
				</CardHeader>
				<CardHeader>
					<strong>Coming Soon</strong>
					<ToggleControl
						// checked={true}
						style={{ marginBottom: '0' }}
						// help={'it some help'}
					/>
				</CardHeader>

				<CardHeader>
					<strong>Custom Logo</strong>
					<ToggleControl
						// checked={true}
						style={{ marginBottom: '0' }}
						// help={'it some help'}
					/>
				</CardHeader>
				<CardHeader>
					<strong>Custom Headline</strong>
					<ToggleControl
						// checked={true}
						style={{ marginBottom: '0' }}
						// help={'it some help'}
					/>
				</CardHeader>
				<CardHeader>
					<strong>Custom Message</strong>
					<ToggleControl
						// checked={true}
						style={{ marginBottom: '0' }}
						// help={'it some help'}
					/>
				</CardHeader>
				<CardBody>
					Enable a "Coming Soon" page while you develop your website.
				</CardBody>
			</Card>

			<Card>
				<CardHeader>
					<Heading level="3">Content Options</Heading>
				</CardHeader>
				<CardHeader>
					<strong>Keep _ latest revisions</strong>
					<ToggleControl
						// checked={true}
						style={{ marginBottom: '0' }}
						// help={'it some help'}
					/>
				</CardHeader>

				<CardHeader>
					<strong>Empty trash every __ week</strong>
					<ToggleControl
						// checked={true}
						style={{ marginBottom: '0' }}
						// help={'it some help'}
					/>
				</CardHeader>
				<CardBody>
					Control content like revisions and trash.
				</CardBody>
			</Card>

			<Card>
				<CardHeader>
					<Heading level="3">Performance and Cache</Heading>
				</CardHeader>
				<CardHeader>
					<strong>Caching</strong>
					<ToggleControl
						// checked={true}
						style={{ marginBottom: '0' }}
						// help={'it some help'}
					/>
				</CardHeader>
				<CardHeader>
					<strong>Cache Level</strong>
					<ToggleControl
						// checked={true}
						style={{ marginBottom: '0' }}
						// help={'it some help'}
					/>
				</CardHeader>
				<CardHeader>
					<strong>Clear Cache</strong>
					<Button>
						Clear Cache
					</Button>
				</CardHeader>
				<CardBody>
					Cache options to speed up your site.
				</CardBody>
			</Card>

		</div>

	);
};

export default Settings;
