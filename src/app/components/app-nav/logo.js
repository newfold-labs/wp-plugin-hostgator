import { Button } from '@wordpress/components';
import { Heading } from '..';
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
		/>
	);
};

const Logo = () => {
	return (
		<div className="hgwp-logo-wrap">
			<Mark />
			<Heading level="2" className="screen-reader-text">
				{ __( 'Hostgator WordPress Plugin', 'wp-plugin-hostgator' ) }
			</Heading>
		</div>
	);
};

export default Logo;
