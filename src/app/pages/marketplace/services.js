import { useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { getJSONPathPerRegion } from '../../util/helpers';
import { Heading, ErrorCard, MarketplaceItem } from '../../components';

const Services = () => {
	const [services, setServices] = useState([]);
	const [isError, setError] = useState(false);
	
	useEffect(() => {
		apiFetch({
			url: getJSONPathPerRegion( 'services' )
		}).then((response) => {
			setServices(response);
		}).catch((error) => {
			setError(error);
		});
	}, []);

	return (
		<div className="hgwp-services grid col2">
			<Heading level="3" className="screen-reader-text">
				{__('Services', 'wp-plugin-hostgator')}
			</Heading>
			{ isError && <ErrorCard error={isError} /> }
			{services.map((item) => (
				<MarketplaceItem key={item.url} item={item} />
			))}
		</div>
	);
};

export default Services;
