import MarketplaceItem from '../../components/marketplaceItem';
import themes from '../../data/themes';

const Themes = () => {
	return (
		<div className="hgwp-themes grid col3">
			{themes.map((item) => (
				<MarketplaceItem item={item} />
			))}
		</div>
	);
};

export default Themes;
