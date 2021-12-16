import { NavLink } from 'react-router-dom';
import { topRoutes } from '../../data/routes';

const NavSmall = () => (
	<div className="hgwp-nav-small">
		<ul> 
            {topRoutes.map((page) => (
                <li>
                    <NavLink key={page.name} to={page.name}>
                        {page.title}
                    </NavLink>
                </li>
            ))}
        </ul>
	</div>
);

export default NavSmall;