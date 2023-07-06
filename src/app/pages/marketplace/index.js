import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';
import { useLocation } from 'react-router-dom';
import { Page } from "../../components/page";
import { SectionContainer, SectionHeader, SectionContent } from "../../components/section";
import MarketplaceList from './MarketplaceList';
import MarketplaceLoading from './MarketplaceLoading';
import MarketplaceError from './MarketplaceError';

const MarketplacePage = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	const [marketplaceItems, setMarketplaceItems] = useState([]);
	const [products, setProducts] = useState([]);

	let location = useLocation();

	// constants to pass to module
	const moduleConstants = {
		'resturl': window.HGWP.resturl,
		'eventendpoint': '/newfold-data/v1/events/',
		'perPage': 12,
		'supportsCTB': false, // not needed, but explicity setting to false anyway
	}

	useEffect(() => {
		apiFetch({
			url: `${moduleConstants.resturl}/newfold-marketplace/v1/marketplace`
		}).then((response) => {
			// check response for data
			if (!response.hasOwnProperty('categories') || !response.hasOwnProperty('products')) {
				setIsError(true);
			} else {
				setMarketplaceItems(response.products.data);
			}
		})
	}, []);

	useEffect(() => {
		if (marketplaceItems.length > 0) {
			filterProducts();
		}
	}, [marketplaceItems, location]);

	const filterProducts = () => {
		const urlpath = location.pathname.substring(
			location.pathname.lastIndexOf('/') + 1
		);
		const category = urlpath === 'marketplace' ? 'featured' : urlpath;

		const filterdProducts = marketplaceItems.filter((product) => {
			return product.categories.some(element => {
				return element.toLowerCase() === category.toLowerCase();
			});

		});

		setProducts(filterdProducts);
		setIsLoading(false);
	};

	return (
		<Page className={"hgwp-app-marketplace-page"}>
			<SectionContainer className={'hgwp-app-marketplace-container'}>
				<SectionHeader
					title={__('Marketplace', 'wp-plugin-hostgator')}
					subTitle={__('Explore our featured collection of tools and services.', 'wp-plugin-hostgator')}
					className={'hgwp-app-marketplace-header'}
				/>

				<SectionContent className={'hgwp-app-marketplace-content'}>
					{isLoading && <MarketplaceLoading />}
					{isError && <MarketplaceError />}
					{!isLoading && !isError && <MarketplaceList products={products} />}
				</SectionContent>
			</SectionContainer>
		</Page>
	);
};

export default MarketplacePage;