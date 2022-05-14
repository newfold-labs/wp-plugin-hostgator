import { Heading, MarketplaceItem } from '../../components';
import { useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { getJSONPathPerRegion } from '../../util/helpers';

const Themes = () => {
	const [themes, setThemes] = useState([]);
	
	useEffect(() => {
		apiFetch({
			url: getJSONPathPerRegion( 'themes' )
		}).then((response) => {
			setThemes(response);
		});
	}, []);

	return (
		<div className="hgwp-themes grid col2">
			<Heading level="3" className="screen-reader-text">
				{__('Themes', 'wp-plugin-hostgator')}
			</Heading>
			{themes.map((item) => (
				<MarketplaceItem key={item.url} item={item} />
			))}
		</div>
	);
};

export default Themes;
