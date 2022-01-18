import './stylesheet.scss';
import { __experimentalDivider as Divider } from '@wordpress/components';
import Themes from './themes';
import Plugins from './plugins';
import Services from './services';

const Marketplace = () => {
	
	return (
		<div className="hgwp-marketplace">
			<Services />
			<Divider />
			<Plugins />
			<Divider />
			<Themes />
		</div>
	);
};

export default Marketplace;
