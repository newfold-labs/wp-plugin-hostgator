import MarketplaceItem from '../../components/marketplaceItem';
import themes from '../../data/themes';

const Themes = () => {
	return (
		<div className="hgwp-themes grid col2">
			{themes.map((item) => (
				<MarketplaceItem key={item.url} item={item} />
			))}
		</div>
	);
};

export default Themes;
