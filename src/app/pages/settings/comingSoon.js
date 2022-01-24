import {
	Card,
	CardBody,
	CardHeader,
	CardDivider,
	TextControl,
	ToggleControl,
	__experimentalHeading as Heading,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useUpdateEffect } from 'react-use';
import AppStore from '../../data/store';
import {
	hostgatorSettingsApiFetch,
	dispatchUpdateSnackbar,
} from '../../util/helpers';

const ComingSoon = () => {
	const { store, setStore } = useContext(AppStore);
	const [comingSoon, setComingSoon] = useState(store.comingSoon);
	// const [ customComingSoon, setCustomComingSoon ] = useState( store.customComingSoon );
	// const [ comingSoonHeadline, setComingSoonHeadline ] = useState( store.comingSoonHeadline );
	// const [ comingSoonBody, setComingSoonBody ] = useState( store.comingSoonBody );

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
	const comingSoonAdminbarToggle = () => {
		const comingsoonadminbar = document.getElementById(
			'wp-admin-bar-hostgator-coming_soon'
		);
		if (!comingsoonadminbar) {
			return;
		}
		if (!comingSoon) {
			comingsoonadminbar.classList.add('hideme');
		} else {
			comingsoonadminbar.classList.remove('hideme');
		}
	};

	useUpdateEffect(() => {
		hostgatorSettingsApiFetch({ comingSoon }).then(() => {
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
						// setCustomComingSoon( () => false );
					}}
				/>
			</CardBody>

			{/* { comingSoon && 
            <CardBody>
                <ToggleControl
                    label="Custom Coming Soon Content"
                    checked={ customComingSoon }
                    help={
                        customComingSoon
                            ? 'Coming soon has custom content (below).'
                            : 'Default coming soon content.'
                    }
                    onChange={ () => {
                        setCustomComingSoon( ( value ) => ! value );
                    } }
                />
            </CardBody> }

            { customComingSoon && 
            <CardBody>
                <TextControl
                    placeholder={ __( 'A New WordPress Site', 'hostgator-wordpres-plugin' ) }
                    value={ comingSoonBody }
                    onChange={ (value) => { setComingSoonBody( () => { value } ) } }
                    tagName="h2"
                />
                <TextControl
                    placeholder={ __( 'Coming Soon', 'hostgator-wordpres-plugin' ) }
                    value={ comingSoonHeadline }
                    onChange={ (value) => { setComingSoonHeadline( () => { value } ) } }
                    tagName="h1"
                />
            </CardBody> }  */}
		</Card>
	);
};

export default ComingSoon;
