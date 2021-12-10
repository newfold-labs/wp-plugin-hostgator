// import './stylesheet.scss';

// import Home from './Home';
// import Reloader from './Reloader';
// import DesktopNav from './NavDesktop';
// import MobileNav from './NavMobile';
// import { useViewportMatch } from '@wordpress/compose';

const Header = () => {
	// const isLargeViewport = useViewportMatch('medium');
	return (
		<Fragment>
			<header className="brand-header">
				<div style={{ width: '64px' }} />
                <h1>Welcome to HostGator Plugin!</h1>
				{/* <Home />
				<Reloader /> */}
			</header>
			<nav>
				<ul>
                    <li>
                        <a href="#"><strong>Home</strong></a>
                    </li>
                    <li>
                        <a href="#">Themes</a>
                    </li>
                    <li>
                        <a href="#">Plugins</a>
                    </li>
                    <li>
                        <a href="#">Services</a>
                    </li>
                    <li>
                        <a href="#">Settings</a>
                    </li>
                    <li>
                        <a href="#">Help</a>
                    </li>
                </ul>
			</nav>
		</Fragment>
	);
};

export default Header;
