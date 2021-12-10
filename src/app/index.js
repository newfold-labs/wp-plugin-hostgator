
// import { useLocation } from 'react-router-dom';

// import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import Header from './components/header';
// import { kebabCase } from 'lodash';

const AppBody = ( props ) => {
	
	return (
		<main 
			id="bwa-app-rendered" 
			className={ classnames(
				'wpadmin-brand-hostgator',
				props.className
			) }
		>
            <Header />
            <p>The react app is started!</p>
		</main>
	)
}

export const App = () => (
    <AppBody />
)

export default App;
