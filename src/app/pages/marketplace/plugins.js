import MarketplaceItem from '../../components/marketplaceItem';
import plugins from '../../data/plugins';

const Plugins = () => {
	return (
		<div className="hgwp-plugins grid col2">
			{plugins.map((item) => (
				<MarketplaceItem key={item.url} item={item} />
			))}
		</div>
	);
};

export default Plugins;
