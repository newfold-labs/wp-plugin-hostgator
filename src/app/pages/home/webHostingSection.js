import ActionField from '../../components/action-field';
import { Container } from '@newfold/ui-component-library';
import { getLinkPerRegion, supportsLinkPerRegion } from '../../util/helpers';

const WebHostingSection = () => {
	return (
		<Container.SettingsField
			title={ __( 'Web Hosting', 'wp-plugin-hostgator' ) }
			description={ __(
				'Access & manage your HostGator account.',
				'wp-plugin-hostgator'
			) }
		>
			<div className="nfd-flex nfd-flex-col nfd-gap-5">
				{ supportsLinkPerRegion( 'home_manage_sites' ) && (
					<ActionField
						label={ __( 'Manage Sites', 'wp-plugin-hostgator' ) }
						buttonLabel={ __(
							'Manage Sites',
							'wp-plugin-hostgator'
						) }
						href={ getLinkPerRegion(
							'home_manage_sites',
							__( 'Manage Sites', 'wp-plugin-hostgator' )
						) }
						target="_blank"
						className={ 'hgwp-app-home-sites-action' }
					>
						{ __(
							'Manage your site from the control panel. You can create backups, set security, and improve performance.',
							'wp-plugin-hostgator'
						) }
					</ActionField>
				) }

				{ supportsLinkPerRegion( 'home_manage_email' ) && (
					<ActionField
						label={ __( 'Email', 'wp-plugin-hostgator' ) }
						buttonLabel={ __(
							'Manage Email',
							'wp-plugin-hostgator'
						) }
						href={ getLinkPerRegion(
							'home_manage_email',
							__( 'Manage Email', 'wp-plugin-hostgator' )
						) }
						target="_blank"
						className={ 'hgwp-app-home-emails-action' }
					>
						{ __(
							'Create email accounts, compose, send, and receive your email from the control panel.',
							'wp-plugin-hostgator'
						) }
					</ActionField>
				) }

				{ supportsLinkPerRegion( 'home_find_domain' ) && (
					<ActionField
						label={ __( 'Domains', 'wp-plugin-hostgator' ) }
						buttonLabel={ __(
							'Manage Domain',
							'wp-plugin-hostgator'
						) }
						href={ getLinkPerRegion(
							'home_find_domain',
							__( 'Find a Domain', 'wp-plugin-hostgator' )
						) }
						target="_blank"
						className={ 'hgwp-app-home-domains-action' }
					>
						{ __(
							'Find a new domain and assign it to your site or start a new site with a fresh domain.',
							'wp-plugin-hostgator'
						) }
					</ActionField>
				) }

				<ActionField
					label={ __( 'Help', 'wp-plugin-hostgator' ) }
					buttonLabel={ __( 'Get Help', 'wp-plugin-hostgator' ) }
					href={ '#/help' }
					className={ 'hgwp-app-home-help-action' }
				>
					{ __(
						'24/7/365 support. We work when you work.',
						'wp-plugin-hostgator'
					) }
				</ActionField>
			</div>
		</Container.SettingsField>
	);
};

export default WebHostingSection;
