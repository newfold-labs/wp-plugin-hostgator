import { __ } from '@wordpress/i18n';
import { __experimentalHeading as Heading } from '@wordpress/components';
import MarketplaceItem from '../../components/marketplaceItem';
import services from '../../data/services';

const Services = () => {

	return (
        <>
        <Heading>Services</Heading>
        <div className="hgwp-services grid col3">
			{services.map((item) => (
                <MarketplaceItem item={item} />
            ))}
        </div>
        </>
    );
};

export default Services;