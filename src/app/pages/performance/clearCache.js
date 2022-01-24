import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
	__experimentalHeading as Heading,
} from '@wordpress/components';
import AppStore from '../../data/store';
import {
	hostgatorPurgeCacheApiFetch,
	dispatchUpdateSnackbar,
} from '../../util/helpers';

const ClearCache = () => {
	const { store, setStore } = useContext(AppStore);

	const getCacheClearNoticeText = () => {
		return __('Cache cleared', 'hostgator-wordpress-plugin');
	};

	const clearCache = () => {
		hostgatorPurgeCacheApiFetch().then(() => {
			dispatchUpdateSnackbar(getCacheClearNoticeText());
		});
	};

	return (
		<Card>
			<CardHeader>
				<Heading level="3">
					{__('Clear Cache', 'hostgator-wordpress-plugin')}
				</Heading>
			</CardHeader>
			<CardBody>
				{__(
					'If you’ve recently updated your website, we recommend clearing the site cache. We’ll fetch a fresh version of your site to cache.',
					'hostgator-wordpress-plugin'
				)}
			</CardBody>
			<CardFooter>
				<Button
					variant="primary"
					onClick={() => {
						clearCache();
					}}
					disabled={!store.cacheLevel}
				>
					{__('Clear All Cache Now', 'hostgator-wordpress-plugin')}
				</Button>
			</CardFooter>
		</Card>
	);
};

export default ClearCache;
