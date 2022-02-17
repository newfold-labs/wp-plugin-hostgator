import {
	Button,
	__experimentalHeading as Heading,
} from '@wordpress/components';
import { ReactComponent as Brand } from '../../../../assets/svg/nav-for-light.svg';

const Logo = () => {
	return (
		<div className="hgwp-logo-wrap">
			<Button
				icon={<Brand className="hgwp-logo" />}
				style={{ height: '39px' }}
				iconSize={39}
				href="#/home"
			></Button>
			<Heading level="2" className="screen-reader-text">
				{__('HostGator WordPress Plugin', 'hostgator-wordpress-plugin')}
			</Heading>
		</div>
	);
};

export default Logo;
