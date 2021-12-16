import { NavLink } from 'react-router-dom';
import { topRoutes } from '../../data/routes';

const NavLarge = () => (
	<ul className="hgwp-nav-large">
        {topRoutes.map((page) => (
			<li>
                <NavLink key={page.name} to={page.name}>
                    {page.title}
                </NavLink>
            </li>
		))}
	</ul>
);

export default NavLarge;
