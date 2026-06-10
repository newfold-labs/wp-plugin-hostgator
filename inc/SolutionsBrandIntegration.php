<?php
/**
 * Coordinates wp-module-solutions branding with HostGator marketing surfaces.
 *
 * @package HostGatorWordPressPlugin
 */

namespace HostGator;

use NewfoldLabs\WP\ModuleLoader\Container;

use function NewfoldLabs\WP\Module\LinkTracker\Functions\build_link as buildLink;

/**
 * Registers container merges + WordPress filters expected by wp-module-solutions.
 */
final class SolutionsBrandIntegration {

	const ECOM_FAMILY_CTB_UUID = '5dc83bdd-9274-4557-a6d7-0b2adbc3919f';

	/**
	 * Hooks container merge + downstream branding filter after core container bootstrapping.
	 *
	 * @return void
	 */
	public static function init(): void {
		\add_action( 'plugins_loaded', array( __CLASS__, 'register_container_overrides' ), 25 );
		\add_filter( 'nfd_solutions_branding', array( __CLASS__, 'filter_branding_tracking_links' ), 30, 2 );
	}

	/**
	 * Partial branding payload merged by SolutionsBranding (URLs without marketing params –
	 * the filter adds buildLink / Link Tracker normalization).
	 *
	 * @return array<string, mixed>
	 */
	protected static function hostgator_branding_overrides(): array {
		return array(
			// Add Plugins tab badge: Snappy monotone head.
			'assets' => array(
				'tabIconSvg' => self::get_snappy_install_tab_icon_svg(),
			),
			// Visual tokens (marketing can revise).
			'colors' => array(
				// HostGator web green (near-brand); tweak with design sign-off.
				'primary'     => '#348f36',
				'tabIconFill' => '#348f36',
			),
			// Base destinations (marketing should confirm slug copy).
			'urls'   => array(
				'accountCenterLearnMore' => 'https://www.hostgator.com/my-account/account-center',
				'helpArticleSolutions'   => 'https://www.hostgator.com/help/article/wordpress-solutions',
				'ecomFamilyUpgrade'      => 'https://www.hostgator.com/my-account/hosting/details#click-to-buy-WP_SOLUTION_FAMILY',
			),
			'ctbs'   => array(
				'ecomFamily' => array(
					'id'  => self::ECOM_FAMILY_CTB_UUID,
					'url' => 'https://www.hostgator.com/my-account/hosting/details#click-to-buy-WP_SOLUTION_FAMILY',
				),
			),
		);
	}

	/**
	 * Store merge payload on the Newfold loader container for wp-module-solutions.
	 *
	 * @return void
	 */
	public static function register_container_overrides(): void {
		global $nfd_module_container;

		if ( ! $nfd_module_container instanceof Container ) {
			return;
		}

		// Only mutate when HostGator is the active loader plugin slug.
		if ( 'hostgator' !== (string) $nfd_module_container->plugin()->id ) {
			return;
		}

		$nfd_module_container->set(
			'solutions_branding',
			self::hostgator_branding_overrides()
		);
	}

	/**
	 * Apply tracked destination URLs via Link Tracker / buildLink helpers.
	 *
	 * Fragments (#hash) URLs skip build_link to preserve click-to-buy anchors.
	 *
	 * @param array     $branding Branding array from wp-module-solutions (post-merge).
	 * @param Container $container Loader container instance.
	 * @return array
	 */
	public static function filter_branding_tracking_links( $branding, $container ): array {
		if ( ! is_array( $branding ) ) {
			return $branding;
		}

		if ( ! $container instanceof Container ) {
			return $branding;
		}

		if ( 'hostgator' !== (string) $container->plugin()->id ) {
			return $branding;
		}

		$campaigns = array(
			'accountCenterLearnMore' => 'wps_account',
			'helpArticleSolutions'   => 'wps_help',
		);

		foreach ( $campaigns as $key => $utm_campaign_suffix ) {
			if ( empty( $branding['urls'][ $key ] ) || ! is_string( $branding['urls'][ $key ] ) ) {
				continue;
			}
			if ( strpos( $branding['urls'][ $key ], '#' ) !== false ) {
				continue;
			}
			$branding['urls'][ $key ] = buildLink(
				$branding['urls'][ $key ],
				array(
					'utm_source'   => 'wp-admin',
					'utm_medium'   => 'hostgator_plugin',
					'utm_campaign' => 'hostg_' . $utm_campaign_suffix,
				)
			);
		}

		if (
			! empty( $branding['ctbs']['ecomFamily']['url'] ) &&
			is_string( $branding['ctbs']['ecomFamily']['url'] ) &&
			false === strpos( $branding['ctbs']['ecomFamily']['url'], '#' )
		) {
			$branding['ctbs']['ecomFamily']['url'] = buildLink(
				$branding['ctbs']['ecomFamily']['url'],
				array(
					'utm_source'   => 'wp-admin',
					'utm_medium'   => 'hostgator_plugin',
					'utm_campaign' => 'hostg_wps_upgrade',
				)
			);
		}

		return $branding;
	}

	/**
	 * Tiny inline SVG for the Plugin Install » brand Solutions tab (16×16, plugin asset).
	 *
	 * @return string HTML fragment or empty string if the asset cannot be loaded.
	 */
	protected static function get_snappy_install_tab_icon_svg(): string {
		$raw = Helpers::get_svg( 'snappy-head-monotone' );
		$svg = trim( (string) $raw );
		if ( '' === $svg ) {
			return '';
		}

		$fill_hex = '#348f36';

		$normalized = preg_replace( '/fill="black"/', 'fill="' . esc_attr( $fill_hex ) . '"', $svg );
		if ( ! is_string( $normalized ) || '' === $normalized ) {
			return '';
		}

		$count  = 0;
		$marked = preg_replace(
			'/<svg\s+/i',
			'<svg id="nfd-tools-plugin-brand-icon" aria-hidden="true" focusable="false" role="presentation" width="16" height="16" ',
			$normalized,
			1,
			$count
		);

		if ( 1 !== (int) $count ) {
			return '';
		}

		return $marked;
	}
}
