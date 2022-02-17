import { __experimentalHeading as Heading } from '@wordpress/components';
import MarketplaceItem from '../../components/marketplaceItem';
import services from '../../data/services';

const Services = () => {
	return (
		<div className="hgwp-services grid col2">
			<Heading level="3" className="screen-reader-text">
				{__('Services', 'hostgator-wordpress-plugin')}
			</Heading>
			{services.map((item) => (
				<MarketplaceItem key={item.url} item={item} />
			))}
		</div>
	);
};

export default Services;
