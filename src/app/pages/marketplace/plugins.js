import { __ } from '@wordpress/i18n';
import { __experimentalHeading as Heading } from '@wordpress/components';
import MarketplaceItem from '../../components/marketplaceItem';
import plugins from '../../data/plugins';

const Plugins = () => {

	return (
        <>
        <Heading>Plugins</Heading>
        <div className="hgwp-plugins grid col2">
			{plugins.map((item) => (
                <MarketplaceItem item={item} />
            ))}
        </div>
        </>
    );
};

export default Plugins;