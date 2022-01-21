import './stylesheet.scss';
import { TabPanel } from '@wordpress/components';
import Themes from './themes';
import Plugins from './plugins';
import Services from './services';

const Marketplace = () => {
	
	return (
		<div className="hgwp-marketplace">
			<TabPanel
				className="hgwp-marketplace-tabs"
				activeClass="current-tab"
				orientation="vertical"
				tabs={ [
					{
						name: 'plugins',
						className: 'plugins',
						title: 'Plugins',
						Component: Plugins,
					},
					{
						name: 'services',
						className: 'services',
						title: 'Services',
						Component: Services,
					},
					{
						name: 'themes',
						className: 'themes',
						title: 'Themes',
						Component: Themes,
					},

				] }
			>
				{ ( tab ) => <tab.Component /> }
			</TabPanel>
		</div>
	);
};

export default Marketplace;