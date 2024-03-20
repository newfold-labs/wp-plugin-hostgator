import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';
import { useLocation } from 'react-router-dom';
import classnames from 'classnames';
import { Container, Page } from '@newfold/ui-component-library';
import { NewfoldRuntime } from '@newfold-labs/wp-module-runtime';
// component sourced from marketplace module
import { default as NewfoldMarketplace } from '../../../../vendor/newfold-labs/wp-module-marketplace/components/marketplace/';

const MarketplacePage = () => {
	// constants to pass to module
	const moduleConstants = {
		text: {
			title: __( 'Marketplace', 'wp-plugin-hostgator' ),
			subTitle: __(
				'Explore our featured collection of tools and services.',
				'wp-plugin-hostgator'
			),
			error: __(
				'Oops, there was an error loading the marketplace, please try again later.',
				'wp-plugin-hostgator'
			),
			noProducts: __(
				'Sorry, no marketplace items. Please, try again later.',
				'wp-plugin-hostgator'
			),
			loadMore: __( 'Load More', 'wp-plugin-hostgator' ),
		},
	};

	// methods to pass to module
	const moduleMethods = {
		apiFetch,
		classnames,
		useState,
		useEffect,
		useLocation,
		NewfoldRuntime,
	};

	return (
		<Page className={ 'hgwp-app-marketplace-page' }>
			<Container className={ 'hgwp-app-marketplace-container' }>
				<NewfoldMarketplace
					methods={ moduleMethods }
					constants={ moduleConstants }
				/>
			</Container>
		</Page>
	);
};

export default MarketplacePage;
