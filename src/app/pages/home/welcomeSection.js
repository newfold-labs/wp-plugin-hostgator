import {OnboardingScreen} from "@newfold-labs/wp-module-ecommerce";
import { useNotification } from "../../components/notifications/feed";
import AppStore from "../../data/store";
import { useContext } from "@wordpress/element";
import { hostgatorSettingsApiFetch } from "../../util/helpers";

const WelcomeSection = () => {
    const {store, setStore} = useContext(AppStore)
    const notify= useNotification();
    const toggleComingSoon = hostgatorSettingsApiFetch(!store?.comingSoon, console.error, (response) => setStore(() => ({ ...store, comingSoon: !store?.comingSoon})));
    return <OnboardingScreen notify={notify} />
}

export default WelcomeSection;
