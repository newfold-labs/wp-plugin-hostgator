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