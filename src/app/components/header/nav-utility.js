import { Icon } from '@wordpress/icons';
import { NavLink } from 'react-router-dom';
import { utilityRoutes } from '../../data/routes';

const NavUtility = () => (
	<ul className="hgwp-nav-utility">
		{utilityRoutes.map((page) => (
			<li key={page.name}>
					<NavLink
						to={page.name}
						className="hgwp-nav-utility-link"
						aria-label={page.title}
						title={page.title}
					>
						<Icon
							icon={page.Icon}
							className="hgwp-nav-utility-icon"
							size={28}
						/>
					</NavLink>
			</li>
		))}
	</ul>
);

export default NavUtility;
