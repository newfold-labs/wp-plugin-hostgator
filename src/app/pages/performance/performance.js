import { Fragment, useState } from '@wordpress/element';
import { useUpdateEffect } from 'react-use';
import { Alert, Button, Label, RadioGroup } from "@newfold/ui-component-library";
import AppStore from '../../data/store';
import { hostgatorSettingsApiFetch, hostgatorPurgeCacheApiFetch } from '../../util/helpers';
import { useNotification } from '../../components/notifications/feed';
import { SectionSettings } from "../../components/section";

const CacheSettings = ({ setError, notify }) => {
	const { store, setStore } = useContext(AppStore);
	const [cacheLevel, setCacheLevel] = useState(store.cacheLevel);

	const cacheOptions = [
		{
			label: __('Disabled', 'wp-plugin-hostgator'),
			description: __('No cache enabled.', 'wp-plugin-hostgator') + ' ' +
				__('Every page load is fresh.', 'wp-plugin-hostgator') + ' ' +
				__('Not recommended.', 'wp-plugin-hostgator'),
			value: 0,
			notice: __('Caching disabled.', 'wp-plugin-hostgator'),
		},
		{
			label: __('Assets Only', 'wp-plugin-hostgator'),
			description: __('Cache static assets like images and the appearance of your site for 1 hour.', 'wp-plugin-hostgator') + ' ' +
				__('Recommended for ecommerce and sites that update frequently or display info in real-time.', 'wp-plugin-hostgator'),
			value: 1,
			notice: __('Cache enabled for assets only.', 'wp-plugin-hostgator'),
		},
		{
			label: __('Assets & Web Pages', 'wp-plugin-hostgator'),
			description: __('Cache static assets for 24 hours and web pages for 2 hours.', 'wp-plugin-hostgator') + ' ' +
				__('Recommended for blogs, educational sites, and sites that update at least weekly.', 'wp-plugin-hostgator'),
			value: 2,
			notice: __('Cache enabled for assets and pages.', 'wp-plugin-hostgator'),
		},
		{
			label: __('Assets & Web Pages - Extended', 'wp-plugin-hostgator'),
			description: __('Assets & Web Pages - Extended', 'wp-plugin-hostgator') + ' ' +
				__('Recommended for portfolios, brochure sites, and sites that update monthly or less often.', 'wp-plugin-hostgator'),
			value: 3,
			notice: __('Cache enabled for assets and pages (extended).', 'wp-plugin-hostgator'),
		},
	];

	const getCacheLevelNoticeTitle = () => {
		return __('Cache setting saved', 'wp-plugin-hostgator');
	};

	const getCacheLevelNoticeText = () => {
		return cacheOptions[cacheLevel].notice;
	};

	const handleCacheLevelChange = (e) => {
		hostgatorSettingsApiFetch({ cacheLevel: parseInt(e.target.value) }, setError, (response) => {
			setCacheLevel(parseInt(e.target.value));
		});
	};

	const notifySuccess = () => {
		notify.push("cache-level-change-notice", {
			title: getCacheLevelNoticeTitle(),
			description: (
				<span>
					{getCacheLevelNoticeText()}
				</span>
			),
			variant: "success",
			autoDismiss: 5000,
		});
	};

	useUpdateEffect(() => {
		setStore({
			...store,
			cacheLevel,
		});

		notifySuccess();
	}, [cacheLevel]);

	return (
		<RadioGroup
			className="cache-options"
			id="cache-type"
			name="cache-level"
			value=""
		>
			{cacheOptions.map((option) => {
				return (
					<Fragment key={option.value}>
						<RadioGroup.Radio
							key={option.value}
							defaultChecked={option.value === store.cacheLevel}
							id={'cache-level-' + option.value}
							label={option.label}
							value={option.value}
							name="cache-level"
							onChange={handleCacheLevelChange}
						/>
						<div className="nfd-radio__description">
							{option.description}
						</div>
					</Fragment>
				);
			})}
		</RadioGroup>
	);
}

const ClearCache = ({ setError, notify }) => {
	const { store, setStore } = useContext(AppStore);

	const getCacheClearNoticeTitle = () => {
		return __('Cache cleared', 'wp-plugin-hostgator');
	};

	const notifySuccess = () => {
		notify.push("disable-old-posts-comments-notice", {
			title: getCacheClearNoticeTitle(),
			variant: "success",
			autoDismiss: 5000,
		});
	};

	const clearCache = () => {
		hostgatorPurgeCacheApiFetch({}, setError, (response) => {
			notifySuccess();
		});
	};

	return (
		<div className="nfd-flex nfd-flex-col nfd-gap-4 clear-cache">
			<div className="nfd-flex nfd-justify-between nfd-items-center">
				<Label>{__('Clear Cache', 'wp-plugin-hostgator')}</Label>
				<Button
					variant="secondary"
					className="clear-cache-button"
					disabled={store.cacheLevel > 0 ? false : true}
					onClick={clearCache}
				>
					{__('Clear All Cache Now', 'wp-plugin-hostgator')}
				</Button>
			</div>
			<p className="lg:nfd-mr-[10.5rem]">
				{
					__('We automatically clear your cache', 'wp-plugin-hostgator') +
					', ' +
					__("as you work (creating content, changing settings, installing plugins and more). But you can manually clear it here to be confident it's fresh.", 'wp-plugin-hostgator')
				}
			</p>
		</div>
	);
}

const Performance = () => {
	const [isError, setError] = useState(false);

	let notify = useNotification();

	return (
		<SectionSettings
			title={__('Performance', 'wp-plugin-hostgator')}
			description={__('Boost speed and performance by storing a copy of your website content, files, and images online so the pages of your website load faster for your visitors.',
				'wp-plugin-hostgator')}
		>
			<div className="nfd-flex nfd-flex-col nfd-gap-4">
				<Label>{__('Caching', 'wp-plugin-hostgator')}</Label>

				<div className="nfd-flex nfd-flex-col nfd-gap-6">
					<CacheSettings setError={setError} notify={notify} />
					<ClearCache setError={setError} notify={notify} />

					{isError &&
						<Alert variant="error">
							{__('Oops! Something went wrong. Please try again.', 'wp-plugin-hostgator')}
						</Alert>
					}
				</div>
			</div>
		</SectionSettings >
	);
}

export default Performance;
