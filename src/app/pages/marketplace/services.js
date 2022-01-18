import { __ } from '@wordpress/i18n';
import { __experimentalHeading as Heading } from '@wordpress/components';
import MarketplaceItem from '../../components/marketplaceItem';
import services from '../../data/services';

const Services = () => {

	return (
        <div className="hgwp-services grid col2">
			{services.map((item) => (
                <MarketplaceItem item={item} />
            ))}
        </div>
    );
};

export default Services;