import { Button } from '@wordpress/components';
import { ReactComponent as Brand } from '../../../../assets/svg/nav-for-light.svg';

const Logo = () => {

	return (
		<div className="hgwp-logo">
			<Button
				icon={<Brand className="hgwp-logo" />}
                style={{ height: '39px' }}
				iconSize={39}
				href="#/home"
			>
			</Button>
			<h2 className="screen-reader-text">{__('HostGator WordPress Plugin', 'brand')}</h2>
		</div>
	);
};

export default Logo;
