import './stylesheet.scss';

import Logo from './logo';
import NavLarge from './nav-large';
import NavMobile from './nav-mobile';
import NavUtility from './nav-utility';
import { useViewportMatch } from '@wordpress/compose';

const Header = () => {
	const isLargeViewport = useViewportMatch('medium');
	return (
		<Fragment>
			<header className="hgwp-header">
				<div className="hgwp-header-inner">
					<Logo />
					{(isLargeViewport && <NavUtility />) || <NavMobile />}
				</div>
			</header>
			{isLargeViewport && (
				<nav className="hgwp-nav">
					<NavLarge />
				</nav>
			)}
		</Fragment>
	);
};

export default Header;
