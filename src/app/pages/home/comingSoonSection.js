import snappyUrl from '../../../../assets/svg/snappy-holding-site-left.svg';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
	__experimentalHeading as Heading,
} from '@wordpress/components';
import AppStore from '../../data/store';
import { useState } from '@wordpress/element';
import { useUpdateEffect } from 'react-use';
import {
	hostgatorSettingsApiFetch,
	dispatchUpdateSnackbar,
	comingSoonAdminbarToggle
} from '../../util/helpers';

const ComingSoonSection = () => {
	const { store, setStore } = useContext(AppStore);
	const [comingSoon, setComingSoon] = useState(store.comingSoon);
	const [wasComingSoon, setWasComingSoon] = useState(false);

	const getComingSoonHeadline = () => {
		return comingSoon
			? __('Coming Soon', 'hostgator-wordpress-plugin')
			: __('Site Launched!', 'hostgator-wordpress-plugin');
	};
	const getComingSoonBody = () => {
		return comingSoon
			? __(
					'Your site currently displays a coming soon page to visitors. Once you have finished setting up your site, be sure to launch it so your visitors can reach it.',
					'hostgator-wordpress-plugin'
			  )
			: __(
					'Congratulations! You just successfully launched your site! Visitors will now see the site, you can easily undo this and restore the coming soon page if you are not ready.',
					'hostgator-wordpress-plugin'
			  );
	};
	const getComingSoonGraphicClass = () => {
		return comingSoon
			? 'section-graphic'
			: 'section-graphic reverse';
	};
	const getComingSoonButton = () => {
		return comingSoon ? (
			<Button
				variant="primary"
				icon="yes-alt"
				onClick={() => {
					setComingSoon(() => false);
					setWasComingSoon(() => true);
				}}
			>
				{__('Launch Site', 'hostgator-wordpress-plugin')}
			</Button>
		) : (
			<>
				<Button
					variant="secondary"
					icon="no-alt"
					onClick={() => {
						setComingSoon(() => true);
						setWasComingSoon(() => true);
					}}
				>
					{__('Undo Launch', 'hostgator-wordpress-plugin')}
				</Button>
				<Button
					variant="link"
					onClick={() => {
						setComingSoon(() => false);
						setWasComingSoon(() => false);
					}}
				>
					{__('Dismiss', 'hostgator-wordpress-plugin')}
				</Button>
			</>
		);
	};
	const getComingSoonNoticeText = () => {
		return comingSoon
			? __('Coming soon activated.', 'hostgator-wordpress-plugin')
			: __('Coming soon deactivated.', 'hostgator-wordpress-plugin');
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
			comingSoonAdminbarToggle(comingSoon);
		});
	}, [comingSoon]);

	return (
		<>
			{(comingSoon || (!comingSoon && wasComingSoon)) && (
				<section className="hgwp-section coming-soon">
					<img src={snappyUrl} className={getComingSoonGraphicClass()} style={{ top: 0 }} alt={__('HostGator`s Snappy holding site', 'hostagtor-wordpress-plugin')}/>
					<Card size="large" className="hgwp-section-card">
						<CardHeader>
							<Heading level="2">
								{getComingSoonHeadline()}
							</Heading>
						</CardHeader>
						<CardBody>{getComingSoonBody()}</CardBody>
						<CardFooter>{getComingSoonButton()}</CardFooter>
					</Card>
				</section>
			)}
		</>
	);
};

export default ComingSoonSection;
