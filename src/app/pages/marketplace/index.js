import './stylesheet.scss';
import { __ } from '@wordpress/i18n';
import {
    __experimentalDivider as Divider
} from '@wordpress/components';
import Themes from './themes';
import Plugins from './plugins';
import Services from './services';

const Marketplace = () => {
	
	return (
		<div className="hgwp-marketplace">
			<Services />
			<Divider />
			<Themes />
			<Divider />
			<Plugins />
		</div>
	);
};

export default Marketplace;
