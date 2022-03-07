import { Heading } from '../../components';
import { ReactComponent as Brand } from '../../../../assets/svg/nav-for-light.svg';
import { Button } from '@wordpress/components';

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
				{__('HostGator WordPress Plugin', 'wp-plugin-hostgator')}
			</Heading>
		</div>
	);
};

export default Logo;
