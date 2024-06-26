import { useUpdateEffect } from 'react-use';
import { OnboardingScreen } from '@newfold-labs/wp-module-ecommerce';
import { useNotification } from 'App/components/notifications';
import AppStore from '../../data/store';
import { useContext } from '@wordpress/element';
import { hostgatorSettingsApiFetch } from '../../util/helpers';
import { comingSoonAdminbarToggle } from '../../util/helpers';

const WelcomeSection = () => {
	const { store, setStore } = useContext( AppStore );
	const notify = useNotification();
	const toggleComingSoon = () =>
		hostgatorSettingsApiFetch(
			{ comingSoon: ! store.comingSoon },
			console.error,
			() => setStore( { ...store, comingSoon: ! store.comingSoon } )
		);

	useUpdateEffect( () => {
		comingSoonAdminbarToggle( store.comingSoon );
	}, [ store.comingSoon ] );

	return (
		<OnboardingScreen
			comingSoon={ store.comingSoon }
			toggleComingSoon={ toggleComingSoon }
			notify={ notify }
			showShadowBox={ false }
		/>
	);
};

export default WelcomeSection;
