import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';
import { useLocation } from 'react-router-dom';
import classnames from 'classnames';
import { Page } from "../../components/page";
import { SectionContainer, SectionHeader, SectionContent } from "../../components/section";
import { NewfoldRuntime } from "@newfold-labs/wp-module-runtime";
// component sourced from marketplace module
import { default as NewfoldMarketplace } from '../../../../vendor/newfold-labs/wp-module-marketplace/components/marketplace/';

const MarketplacePage = () => {

	// constants to pass to module
	const moduleConstants = {
		'eventendpoint': '/newfold-data/v1/events/',
		'perPage': 12,
		'supportsCTB': false, // not needed, but explicity setting to false anyway
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
		<Page className={"hgwp-app-marketplace-page"}>
			<SectionContainer className={'hgwp-app-marketplace-container'}>
				<SectionHeader
					title={__('Marketplace', 'wp-plugin-hostgator')}
					subTitle={__('Explore our featured collection of tools and services.', 'wp-plugin-hostgator')}
					className={'hgwp-app-marketplace-header'}
				/>
				<SectionContent className={'hgwp-app-marketplace-content'}>
					
					<NewfoldMarketplace 
                        methods={moduleMethods}
                        constants={moduleConstants}
                    />

				</SectionContent>
			</SectionContainer>
		</Page>
	);
};

export default MarketplacePage;