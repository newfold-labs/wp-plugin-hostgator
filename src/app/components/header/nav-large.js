import { NavLink } from 'react-router-dom';
import { topRoutes } from '../../data/routes';

const NavLarge = () => (
	<ul className="hgwp-nav-large">
		{topRoutes.map((page) => (
			<li key={page.name}>
				<NavLink to={page.name} className={`link-${page.title}`}>{page.title}</NavLink>
			</li>
		))}
	</ul>
);

export default NavLarge;
