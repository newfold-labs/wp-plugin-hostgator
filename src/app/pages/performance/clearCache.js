import AppStore from '../../data/store';
import { Heading, ErrorCard } from '../../components';
import {
	hostgatorPurgeCacheApiFetch,
	dispatchUpdateSnackbar,
} from '../../util/helpers';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardFooter
} from '@wordpress/components';

const ClearCache = () => {
	const { store, setStore } = useContext(AppStore);
	const [isError, setError] = useState(false);

	const getCacheClearNoticeText = () => {
		return __('Cache cleared', 'wp-plugin-hostgator');
	};

	const clearCache = () => {
		hostgatorPurgeCacheApiFetch({}, setError, (response) => {
			dispatchUpdateSnackbar(getCacheClearNoticeText());
		});
	};

	if ( isError ) {
		return <ErrorCard error={isError} />
	}
	return (
		<Card className={`short card-clear-cache ${!store.cacheLevel ? 'disabled' : ''}`}>
			<CardHeader>
				<Heading level="3">
					{__('Clear Cache', 'wp-plugin-hostgator')}
				</Heading>
			</CardHeader>
			<CardBody>
				{__(
					'If you’ve recently updated your website, we recommend clearing the site cache. We’ll fetch a fresh version of your site to cache.',
					'wp-plugin-hostgator'
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
					{__('Clear All Cache Now', 'wp-plugin-hostgator')}
				</Button>
			</CardFooter>
		</Card>
	);
};

export default ClearCache;
