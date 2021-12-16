import './stylesheet.scss';

import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import Header from './components/header';
import AppRoutes from './data/routes';

const AppBody = ( props ) => {
	// const isLargeViewport = useMediaQuery('(min-width: >= 1020px)');
	// const location = useLocation();

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
				<AppRoutes />
			</div>
		</main>
	);
};

export const App = () => (
	<Router>
		<AppBody />
	</Router>
);

export default App;
