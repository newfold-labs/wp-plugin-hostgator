import { useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { getJSONPathPerRegion } from '../../util/helpers';
import { Heading, ErrorCard, MarketplaceItem } from '../../components';

const Plugins = () => {
	const [plugins, setPlugins] = useState([]);
	const [isError, setError] = useState(false);
	
	useEffect(() => {
		apiFetch({
			url: getJSONPathPerRegion( 'plugins' )
		}).then((response) => {
			setPlugins(response);
		}).catch((error) => {
			setError(error);
		});
	}, []);

	if (isError) {
		return <ErrorCard error={isError} />;
	}
	return (
		<div className="hgwp-plugins grid col2">
			<Heading level="3" className="screen-reader-text">
				{__('Plugins', 'wp-plugin-hostgator')}
			</Heading>
			{plugins.map((item) => (
				<MarketplaceItem key={item.url} item={item} />
			))}
		</div>
	);
};

export default Plugins;
