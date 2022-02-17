import { Icon } from '@wordpress/icons';
import { Dashicon } from '@wordpress/components';
import { NavLink } from 'react-router-dom';
import { utilityRoutes } from '../../data/routes';

const NavUtility = () => (
	<ul className="hgwp-nav-utility">
		{utilityRoutes.map((page) => (
			<li key={page.name}>
					<NavLink
						to={page.name}
						className={`hgwp-nav-utility-link utility-link-${page.title}`}
						aria-label={page.title}
						title={page.title}
					>
						{ page.Icon && 
							<Icon
								icon={page.Icon}
								className="hgwp-nav-utility-icon"
								size={28}
							/>
						}
						{ page.Dashicon && 
							<Dashicon 
								icon={page.Dashicon} 
								className="hgwp-nav-utility-icon"
							/>
						}
					</NavLink>
			</li>
		))}
	</ul>
);

export default NavUtility;
