import { Button } from '@wordpress/components';
import { Title } from '@newfold/ui-component-library';
import { ReactComponent as Brand } from '../../../../assets/svg/nav-for-light.svg';
import { delay } from 'lodash';

const Mark = () => {
	const defocus = () => {
		const button = document.querySelector( '.logo-mark' );
		delay( () => {
			if ( null !== button ) {
				button.blur();
			}
		}, 500 );
	};
	return (
		<Button
			icon={ <Brand className="hgwp-logo" /> }
			style={ { width: '160px', height: 'auto' } }
			onMouseUp={ defocus }
			className="logo-mark nfd-p-0"
			href="#/home"
			aria-label="HostGator"
		/>
	);
};

const Logo = () => {
	return (
		<div className="hgwp-logo-wrap">
			<Mark />
			<Title as="h2" className="screen-reader-text">
				{ __( 'Hostgator WordPress Plugin', 'wp-plugin-hostgator' ) }
			</Title>
		</div>
	);
};

export default Logo;
