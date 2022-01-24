import './stylesheet.scss';

import AppStore, { AppStoreProvider } from './data/store';
import { useLocation, HashRouter as Router } from 'react-router-dom';
import { __ } from '@wordpress/i18n';
import { SnackbarList, Spinner } from '@wordpress/components';
import classnames from 'classnames';
import Header from './components/header';
import AppRoutes from './data/routes';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from 'react';
import { store as noticesStore } from '@wordpress/notices';
import { setActiveSubnav } from './util/helpers';

const Notices = () => {
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
	useEffect(() => {
		setActiveSubnav(location.pathname);
	}, [location]);
};

const AppBody = (props) => {
	const { booted } = useContext(AppStore);
	handlePageLoad();
	// const isLargeViewport = useMediaQuery('(min-width: >= 1020px)');

	return (
		<main
			id="hgwp-app-rendered"
			className={classnames('wpadmin-brand-hostgator', props.className)}
		>
			<Header />
			<div className="hgwp-app-body">
				{(true === booted && <AppRoutes />) || <Spinner />}
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
