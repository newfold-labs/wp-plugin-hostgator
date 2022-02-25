import {
	Card,
	CardBody,
	CardHeader,
	RadioControl,
	__experimentalHeading as Heading,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useUpdateEffect } from 'react-use';
import AppStore from '../../data/store';
import ErrorCard from '../../components/errorCard';
import {
	hostgatorSettingsApiFetch,
	dispatchUpdateSnackbar,
} from '../../util/helpers';

const CacheSettings = () => {
	const { store, setStore } = useContext(AppStore);
	const [cacheLevel, setCacheLevel] = useState(store.cacheLevel);
	const [isError, setError] = useState(false);
	
	const cacheOptions = [
		{
			label: (
				<span>
					<strong>
						{__('Disabled', 'wp-plugin-hostgator')}
					</strong>
					<span>
						{__('No cache enabled.', 'wp-plugin-hostgator')}
					</span>
					<em>
						{__('Not recommended.', 'wp-plugin-hostgator')}
					</em>
				</span>
			),
			value: 0,
			notice: 'Caching disabled.',
		},
		{
			label: (
				<span>
					<strong>
						{__('Assets Only', 'wp-plugin-hostgator')}
					</strong>
					<span>
						{__(
							'Cache static assets like images and the appearance of your site for 1 hour.',
							'wp-plugin-hostgator'
						)}
					</span>
					<em>
						{__(
							'Recommended for ecommerce and sites that update frequently or display info in real-time.',
							'wp-plugin-hostgator'
						)}
					</em>
				</span>
			),
			value: 1,
			notice: 'Cache enabled for assets only.',
		},
		{
			label: (
				<span>
					<strong>
						{__('Assets & Web Pages', 'wp-plugin-hostgator')}
					</strong>
					<span>
						{__(
							'Cache static assets for 24 hours and web pages for 2 hours.',
							'wp-plugin-hostgator'
						)}
					</span>
					<em>
						{__(
							'Recommended for blogs, educational sites, and sites that update at least weekly.',
							'wp-plugin-hostgator'
						)}
					</em>
				</span>
			),
			value: 2,
			notice: 'Cache enabled for assets and pages.',
		},
		{
			label: (
				<span>
					<strong>
						{__(
							'Assets & Web Pages - Extended',
							'wp-plugin-hostgator'
						)}
					</strong>
					<span>
						{__(
							'Cache static assets for 1 week and web pages for 8 hours.',
							'wp-plugin-hostgator'
						)}
					</span>
					<em>
						{__(
							'Recommended for portfolios, brochure sites, and sites that update monthly or less often.',
							'wp-plugin-hostgator'
						)}
					</em>
				</span>
			),
			value: 3,
			notice: 'Cache enabled for assets and pages (extended).',
		},
	];

	const getCacheLevelNoticeText = () => {
		return cacheOptions[cacheLevel].notice;
	};

	useUpdateEffect(() => {
		hostgatorSettingsApiFetch({ cacheLevel }, setError, (response) => {
			setStore({
				...store,
				cacheLevel,
			});
			dispatchUpdateSnackbar(getCacheLevelNoticeText());
		});
	}, [cacheLevel]);

	if ( isError ) {
		return <ErrorCard error={isError} />
	}
	return (
		<Card className="card-cache-settings">
			<CardHeader>
				<Heading level="3">
					{__('Cache Level', 'wp-plugin-hostgator')}
				</Heading>
			</CardHeader>
			<CardBody>
				{__(
					'Boost speed and performance by storing a copy of your website content, files, and images online so the pages of your website load faster for your visitors.',
					'wp-plugin-hostgator'
				)}
			</CardBody>
			<CardBody>
				<RadioControl
					className="input-cache-settings"
					selected={cacheLevel}
					options={cacheOptions}
					onChange={(value) => setCacheLevel(parseInt(value))}
				/>
			</CardBody>
		</Card>
	);
};

export default CacheSettings;
