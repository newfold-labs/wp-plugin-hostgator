import {
	Card,
	CardBody,
	CardHeader,
	CardDivider,
	ToggleControl,
	__experimentalHeading as Heading
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useUpdateEffect } from 'react-use';
import AppStore from '../../data/store';
import {
	hostgatorSettingsApiFetch,
	dispatchUpdateSnackbar,
	comingSoonAdminbarToggle
} from '../../util/helpers';
import Accordion from '../../components/accordion';

const ComingSoon = () => {
	const { store, setStore } = useContext(AppStore);
	const [comingSoon, setComingSoon] = useState(store.comingSoon);

	const getComingSoonNoticeText = () => {
		return comingSoon
			? __('Coming soon activated.', 'hostgator-wordpress-plugin')
			: __('Coming soon deactivated.', 'hostgator-wordpress-plugin');
	};
	const getComingSoonHelpText = () => {
		return comingSoon
			? __(
					'Coming soon page is active and site is protected.',
					'hostgator-wordpress-plugin'
			  )
			: __(
					'Coming soon page is not active and site is acessible.',
					'hostgator-wordpress-plugin'
			  );
	};
	

	useUpdateEffect(() => {
		hostgatorSettingsApiFetch({ 
			comingSoon,
		 }).then(() => {
			setStore({
				...store,
				comingSoon,
			});
			dispatchUpdateSnackbar(getComingSoonNoticeText());
			comingSoonAdminbarToggle();
		});
	}, [comingSoon]);

	return (
		<Card>
			<CardHeader>
				<Heading level="3">
					{__('Coming Soon', 'hostgator-wordpress-plugin')}
				</Heading>
			</CardHeader>
			<CardBody>
				{__(
					'Not ready for your site to be live? Enable a "Coming Soon" page while you build your website for the public eye. This will disable all parts of your site and show visitors a "coming soon" landing page.',
					'hostgator-wordpress-plugin'
				)}
			</CardBody>
			<CardDivider />
			<CardBody>
				<ToggleControl
					label={__('Coming Soon', 'hostgator-wordpress-plugin')}
					checked={comingSoon}
					help={getComingSoonHelpText()}
					onChange={() => {
						setComingSoon((value) => !value);
					}}
				/>
				{ comingSoon && (
					<Accordion
						summary={__(
							'Pro Tip: Begin collecting subscribers',
							'hostgator-wordpress-plugin'
						)}
					>
						<p>{__(
							'First, activate the "Jetpack" plugin, connect your site, and enable the "Subscriptions" module. Then, users can subsribe to be notified when you launch and publish new content.',
							'hostgator-wordpress-plugin'
						)}</p>
					</Accordion>
				)}
			</CardBody>
		</Card>
	);
};

export default ComingSoon;
