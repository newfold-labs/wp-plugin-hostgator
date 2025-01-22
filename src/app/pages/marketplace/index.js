import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import { Container, Page } from '@newfold/ui-component-library';
import { NewfoldRuntime } from '@newfold/wp-module-runtime';
// component sourced from marketplace module
import { default as NewfoldMarketplace } from '@modules/wp-module-marketplace/components/';

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
			productPage: {
				error: {
					title: __(
						'Oops! Something Went Wrong',
						'wp-plugin-hostgator'
					),
					description: __(
						'An error occurred while loading the content. Please try again later.',
						'wp-plugin-hostgator'
					),
				},
			},
		},
	};

	// methods to pass to module
	const moduleMethods = {
		apiFetch,
		classNames,
		useState,
		useEffect,
		useLocation,
		useMatch,
		useNavigate,
		NewfoldRuntime,
	};

	return (
		<Page className={ 'hgwp-app-marketplace-page' }>
			<Container className={ 'hgwp-app-marketplace-container nfd-overflow-clip' }>
				<NewfoldMarketplace
					methods={ moduleMethods }
					constants={ moduleConstants }
				/>
			</Container>
		</Page>
	);
};

export default MarketplacePage;
