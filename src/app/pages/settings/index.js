import { __ } from '@wordpress/i18n';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardDivider,
	ToggleControl,
} from '@wordpress/components';
import { __experimentalHeading as Heading } from '@wordpress/components';
import AppStore from '../../data/store';
import { useState } from '@wordpress/element';
import { useEffect } from 'react';

const Settings = () => {
	const { store, setStore } = useContext(AppStore);
	const [ isComingSoon, setComingSoon ] = useState( store.comingSoon );

	useEffect(() => {
		setStore({
			...store,
			comingSoon: isComingSoon,
		});
		//save setting to db
	}, [isComingSoon]);

	return (
		<div className="hgwp-Settings grid col2">

			<Card>
				<CardHeader>
					<Heading level="3">Automatic Updates</Heading>
				</CardHeader>
				<CardHeader>
					<strong>Core</strong>
					<ToggleControl
						disabled={true}
					/>
				</CardHeader>
				<CardHeader>
					<strong>Plugins</strong>
					<ToggleControl
						disabled={true}
					/>
				</CardHeader>
				<CardHeader>
					<strong>Themes</strong>
					<ToggleControl
						disabled={true}
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
						disabled={true}
					/>
				</CardHeader>
				<CardHeader>
					<strong>Close comments after __ days</strong>
					<ToggleControl
						disabled={true}
					/>
				</CardHeader>
				<CardHeader>
					<strong>Display __ comments per page</strong>
					<ToggleControl
						disabled={true}
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
				<CardBody>
					Not ready for your site to be live? Enable a "Coming Soon" page while you build your website for the public eye. This will disable all parts of your site and give visitors a "coming soon" landing page.
				</CardBody>
				<CardDivider />
				<CardBody>
					<ToggleControl
						label="Coming Soon"
						checked={ isComingSoon }
						help={
							isComingSoon
								? 'Coming soon is active.'
								: 'Coming soon is not active.'
						}
						onChange={ () => {
							setComingSoon( ( state ) => ! state );
							// setCustomComingSoon( () => false );
						} }
					/>
				</CardBody>
				
				{/* 				
				{ isComingSoon && 
				<CardBody>
					<ToggleControl
						label="Custom Coming Soon Content"
						checked={ isCustomComingSoon }
						help={
							isCustomComingSoon
								? 'Coming soon has custom content (below).'
								: 'Default coming soon content.'
						}
						onChange={ () => {
							setCustomComingSoon( ( state ) => ! state );
						} }
					/>
				</CardBody> }

				{ isCustomComingSoon && 
				<CardBody>
					<RichText
						placeholder={ __( 'Coming Soon', 'hostgator-wordpres-plugin' ) }
						value={ comingSoonHeadline }
						onChange={ (value) => { setComingSoonHeadline( () => { value } ) } }
						tagName="h2"
						allowedFormats={[]}
					/>
					<RichText
						placeholder={ __( 'A New WordPress Site', 'hostgator-wordpres-plugin' ) }
						value={ comingSoonBody }
						onChange={ (value) => { setComingSoonBody( () => { value } ) } }
						tagName="p"
					/>
				</CardBody> } 
				*/}
			</Card>

			<Card>
				<CardHeader>
					<Heading level="3">Content Options</Heading>
				</CardHeader>
				<CardHeader>
					<strong>Keep _ latest revisions</strong>
					<ToggleControl
						disabled={true}
					/>
				</CardHeader>

				<CardHeader>
					<strong>Empty trash every __ week</strong>
					<ToggleControl
						disabled={true}
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
						disabled={true}
					/>
				</CardHeader>
				<CardHeader>
					<strong>Cache Level</strong>
					<ToggleControl
						disabled={true}
					/>
				</CardHeader>
				<CardHeader>
					<strong>Clear Cache</strong>
					<Button
						variant="primary"
						disabled
					>
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
