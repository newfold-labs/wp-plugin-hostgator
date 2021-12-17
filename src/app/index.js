import './stylesheet.scss';

import AppStore, { AppStoreProvider } from './data/store';
import { useMediaQuery } from '@wordpress/compose';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';
import classnames from 'classnames';
import Header from './components/header';
import AppRoutes from './data/routes';

const AppBody = ( props ) => {
	const { booted } = useContext(AppStore);
	// const isLargeViewport = useMediaQuery('(min-width: >= 1020px)');

	return (
		<main 
			id="hgwp-app-rendered" 
			className={ classnames(
				'wpadmin-brand-hostgator',
				props.className
			) }
		>
            <Header />
			<div className='hgwp-app-body'>
				{(true === booted && <AppRoutes />) || <Spinner />}
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
