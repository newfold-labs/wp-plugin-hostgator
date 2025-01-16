import { FreePlugins } from '@newfold/wp-module-ecommerce';
import { useNotification } from 'App/components/notifications';

const FreePluginsSection = () => {
	const notify = useNotification();
	return <FreePlugins notify={ notify } showShadowBox={ false } />;
};

export default FreePluginsSection;
