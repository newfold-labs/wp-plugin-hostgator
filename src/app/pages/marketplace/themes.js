import { useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { getJSONPathPerRegion } from '../../util/helpers';
import { Heading, ErrorCard, MarketplaceItem } from '../../components';

const Themes = () => {
	const [themes, setThemes] = useState([]);
	const [isError, setError] = useState(false);
	
	useEffect(() => {
		apiFetch({
			url: getJSONPathPerRegion( 'themes' )
		}).then((response) => {
			setThemes(response);
		}).catch((error) => {
			setError(error);
		});
	}, []);

	return (
		<div className="hgwp-themes grid col2">
			<Heading level="3" className="screen-reader-text">
				{__('Themes', 'wp-plugin-hostgator')}
			</Heading>
			{ isError && <ErrorCard error={isError} /> }
			{themes.map((item) => (
				<MarketplaceItem key={item.url} item={item} />
			))}
		</div>
	);
};

export default Themes;
