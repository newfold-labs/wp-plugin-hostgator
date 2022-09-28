import './stylesheet.scss';

import AppStore, { AppStoreProvider } from './data/store';
import { useLocation, HashRouter as Router } from 'react-router-dom';
import { __ } from '@wordpress/i18n';
import { SnackbarList, Spinner } from '@wordpress/components';
import classnames from 'classnames';
import Header from './components/header';
import AppRoutes from './data/routes';
import ErrorCard from './components/errorCard';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { store as noticesStore } from '@wordpress/notices';
import { setActiveSubnav } from './util/helpers';

// component sourced from module
import { default as NewfoldNotifications } from '../../vendor/newfold-labs/wp-module-notifications/assets/js/components/notifications/'; 
// to pass to notifications module
import apiFetch from '@wordpress/api-fetch'; 
import { useState } from '@wordpress/element';

const Notices = () => {
	if ('undefined' === typeof noticesStore) {
		return null;
	}
	const notices = useSelect(
		(select) =>
			select(noticesStore)
				.getNotices()
				.filter((notice) => notice.type === 'snackbar'),
		[]
	);
	const { removeNotice } = useDispatch(noticesStore);
	return (
		<SnackbarList
			className="edit-site-notices"
			notices={notices}
			onRemove={removeNotice}
		/>
	);
};

const handlePageLoad = () => {
	const location = useLocation();
	const routeContents = document.querySelector('.hgwp-app-body-inner');
	useEffect(() => {
		setActiveSubnav(location.pathname);
		window.scrollTo(0, 0);
		if (routeContents) {
			routeContents.focus({ preventScroll: true });
		}
	}, [location.pathname]);
};

const AppBody = (props) => {
	const { booted, hasError } = useContext(AppStore);

	handlePageLoad();

	return (
		<main
			id="hgwp-app-rendered"
			className={classnames(
				'wpadmin-brand-web',
				`hgwp-wp-${HGWP.wpversion}`,
				props.className
			)}
		>
			<Header />
			<NewfoldNotifications
				apiFetch={apiFetch}
				classnames={classnames} 
				context='web-plugin'
				filter={filter}
				page={hashedPath}
				resturl={window.WPPW.resturl}
				useEffect={useEffect}
				useState={useState}
			/>
			<div className="hgwp-app-body">
				<div className="hgwp-app-body-inner">
					<ErrorBoundary FallbackComponent={<ErrorCard />}>
						{hasError && <ErrorCard error={hasError} />}
						{(true === booted && <AppRoutes />) ||
							(!hasError && <Spinner />)}
					</ErrorBoundary>
				</div>
			</div>

			<div className="hgwp-app-snackbar">
				<Notices />
			</div>
		</main>
	);
};

export const App = () => (
	<AppStoreProvider>
		<Router>
			<AppBody />
		</Router>
	</AppStoreProvider>
);

export default App;
