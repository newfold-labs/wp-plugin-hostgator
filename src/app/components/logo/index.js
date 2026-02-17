import { Button } from '@wordpress/components';
import { Title } from '@newfold/ui-component-library';
import { ReactComponent as HostGatorLogo } from 'Assets/svg/hostgator-snappy.svg';

const Mark = ({ variant }) => {
	const isIcon = (variant === 'icon');
	return (
		<Button
			icon={
				isIcon ? (
					<HostGatorLogo className="hgwp-logo hgwp-logo--icon" />
				) : (
					<HostGatorLogo className="hgwp-logo hgwp-logo--wordmark nfd-w-full nfd-h-auto" />
				)
			}
			className="logo-mark nfd-p-0 hgwp-logo"
			href="#/home"
			aria-label={__('HostGator', 'wp-plugin-hostgator')}
		/>
	);
};

const Logo = ({ variant = 'wordmark' }) => {
	return (
		<div className="hgwp-logo-wrap nfd-flex nfd-items-center nfd-justify-center">
			<Mark variant={variant} />
			<Title as="h2" className="nfd-sr-only">
				{__('HostGator WordPress Plugin', 'wp-plugin-hostgator')}
			</Title>
		</div>
	);
};

export default Logo;
