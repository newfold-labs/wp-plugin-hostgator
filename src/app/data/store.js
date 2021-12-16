import { createContext, useMemo } from '@wordpress/element';

import apiFetch from '@wordpress/api-fetch';

/* domain.site/wp-json/hostgator/v1 */
export const REST_BASE = 'hostgator/v1';

/* endpoints inside REST_BASE */
export const ENDPOINTS = [
	'settings',
];

const DEFAULT = {
	store: {},
	setStore: () => {},
};

const AppStore = createContext(DEFAULT);

export const hgApiFetchAll = async (endpoint, options = {}) => {
	if (!endpoint in ENDPOINTS) {
		return false; // only allow-list this method for presslens endpoints
	}

	return await apiFetch({
		path: REST_BASE + '/' + endpoint,
		// headers: { 'X-HGWP': window.HGWP.uid },
		...options,
	});
};

export const reformStore = (store, endpoint, response) => {
	return {
		...store,
		[_camelCase(endpoint)]: response,
	};
};

export const AppStoreProvider = ({ children }) => {
	const [booted, setBooted] = useState(false);
	const [store, setStore] = useState({});

	const contextStore = useMemo(
		() => ({ store, setStore, booted, setBooted }),
		[store, booted]
	);

	useEffect(() => {
		if (false === booted) {
			hgApiFetchAll('settings').then((settings) => {
				setStore({ ...store, ...window.HGWP, ...settings });
				window.HGWP = {
					// uid: window.HGWP.uid,
					url: window.HGWP.url,
                    admin: window.HGWP.admin,
					migrated: true,
                    // comingSoon: settings.comingSoon,
				};
				setBooted(true);
			});
		}
	}, []);

	return (
		<AppStore.Provider value={contextStore}> {children} </AppStore.Provider>
	);
};

export default AppStore;
