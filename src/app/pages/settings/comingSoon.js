import AppStore from '../../data/store';
import { Heading, ErrorCard, Accordion } from '../../components';
import {
	hostgatorSettingsApiFetch,
	dispatchUpdateSnackbar,
	comingSoonAdminbarToggle
} from '../../util/helpers';
import {
	Card,
	CardBody,
	CardHeader,
	CardDivider,
	ToggleControl
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useUpdateEffect } from 'react-use';

const ComingSoon = () => {
	const { store, setStore } = useContext(AppStore);
	const [comingSoon, setComingSoon] = useState(store.comingSoon);
	const [isError, setError] = useState(false);

	const getComingSoonNoticeText = () => {
		return comingSoon
			? __('Coming soon activated.', 'wp-plugin-hostgator')
			: __('Coming soon deactivated.', 'wp-plugin-hostgator');
	};
	const getComingSoonHelpText = () => {
		return comingSoon
			? __(
					'Coming soon page is active and site is protected.',
					'wp-plugin-hostgator'
			  )
			: __(
					'Coming soon page is not active and site is acessible.',
					'wp-plugin-hostgator'
			  );
	};
	

	useUpdateEffect(() => {
		hostgatorSettingsApiFetch({ comingSoon }, setError, (response) => {
			setStore({
				...store,
				comingSoon,
			});
			dispatchUpdateSnackbar(getComingSoonNoticeText());
			comingSoonAdminbarToggle();
		});
	}, [comingSoon]);

	if ( isError ) {
		return <ErrorCard error={isError} />
	}
	return (
		<Card className="card-coming-soon">
			<CardHeader>
				<Heading level="3">
					{__('Coming Soon', 'wp-plugin-hostgator')}
				</Heading>
			</CardHeader>
			<CardBody>
				{__(
					'Not ready for your site to be live? Enable a "Coming Soon" page while you build your website for the public eye. This will disable all parts of your site and show visitors a "coming soon" landing page.',
					'wp-plugin-hostgator'
				)}
			</CardBody>
			<CardDivider />
			<CardBody className="coming-soon-setting">
				<ToggleControl
					label={__('Coming Soon', 'wp-plugin-hostgator')}
					className="coming-soon-toggle"
					checked={comingSoon}
					help={getComingSoonHelpText()}
					onChange={() => {
						setComingSoon((value) => !value);
					}}
				/>
				{ comingSoon && (
					<Accordion
						className="coming-soon-protip"
						summary={__(
							'Pro Tip: Begin collecting subscribers',
							'wp-plugin-hostgator'
						)}
					>
						<p>{__(
							'First, activate the "Jetpack" plugin, connect your site, and enable the "Subscriptions" module. Then, users can subscribe to be notified when you launch and publish new content.',
							'wp-plugin-hostgator'
						)}</p>
					</Accordion>
				)}
			</CardBody>
		</Card>
	);
};

export default ComingSoon;
