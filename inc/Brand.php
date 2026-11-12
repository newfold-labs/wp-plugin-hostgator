<?php
/**
 * Brand constants and helpers for the HostGator plugin.
 *
 * Single home for everything brand-shaped: visual constants, regional link
 * map (mirrors src/app/data/region.js and is also published to the JS runtime
 * so the JS side reads from here), brand icon URLs, and the payload consumed
 * by wp-module-editor-chat via its container key.
 *
 * @package HostGatorWordPressPlugin
 */

namespace HostGator;

/**
 * Class Brand
 */
final class Brand {

	/**
	 * Brand identifier used by modules (editor-chat, onboarding, etc.).
	 */
	const ID = 'hostgator';

	/**
	 * Human-readable brand name.
	 */
	const NAME = 'HostGator';

	/**
	 * Background color for brand-styled buttons rendered outside the React app
	 * (e.g. the "Login with HostGator" button on wp-login.php).
	 * Meets WCAG 2 AA (>=4.5:1) with white label text at 15px/500 on wp-login.php.
	 */
	const BUTTON_BACKGROUND = '#b45300';

	/**
	 * Container key consumed by wp-module-editor-chat.
	 */
	private const EDITOR_CHAT_CONTAINER_KEY = 'editor_chat_brand';

	/**
	 * Regional link map. Each entry has a `default` (US/.com) plus overrides
	 * per LATAM country code. A string `'false'` means the surface should hide
	 * that link in that region (see supports()).
	 *
	 * Supported region codes: AR, BO, BR, CL, CO, DO, EC, MX, PE, PR, UY.
	 */
	private const LINKS = array(
		'main'              => array(
			'default' => 'https://www.hostgator.com',
			'AR'      => 'https://www.hostgator.ar',
			'BO'      => 'https://www.hostgator.bo',
			'BR'      => 'https://www.hostgator.com.br',
			'CL'      => 'https://www.hostgator.cl',
			'CO'      => 'https://www.hostgator.co',
			'DO'      => 'https://www.hostgator.do',
			'EC'      => 'https://www.hostgator.net.ec',
			'MX'      => 'https://www.hostgator.mx',
			'PE'      => 'https://www.hostgator.pe',
			'UY'      => 'https://www.hostgator.uy',
		),
		'site_info_portal'  => array(
			'default' => 'https://www.hostgator.com/my-account/login',
			'AR'      => 'https://cliente.hostgator.ar',
			'BO'      => 'https://cliente.hostgator.bo',
			'BR'      => 'https://financeiro.hostgator.com.br',
			'CL'      => 'https://cliente.hostgator.cl',
			'CO'      => 'https://cliente.hostgator.co',
			'DO'      => 'https://cliente.hostgator.do',
			'EC'      => 'https://cliente.hostgator.net.ec',
			'MX'      => 'https://cliente.hostgator.mx',
			'PE'      => 'https://cliente.hostgator.pe',
			'UY'      => 'https://cliente.hostgator.uy',
		),
		'home_manage_sites' => array(
			'default' => 'https://www.hostgator.com/my-account/hosting/details/sites',
			'AR'      => 'https://cliente.hostgator.ar/sitios-web',
			'BO'      => 'https://cliente.hostgator.bo/sitios-web',
			'BR'      => 'https://cliente.hostgator.com.br',
			'CL'      => 'https://cliente.hostgator.cl/sitios-web',
			'CO'      => 'https://cliente.hostgator.co/sitios-web',
			'DO'      => 'https://cliente.hostgator.do/sitios-web',
			'EC'      => 'https://cliente.hostgator.net.ec/sitios-web',
			'MX'      => 'https://cliente.hostgator.mx/sitios-web',
			'PE'      => 'https://cliente.hostgator.pe/sitios-web',
			'UY'      => 'https://cliente.hostgator.uy/sitios-web',
		),
		'home_manage_email' => array(
			'default' => 'https://www.hostgator.com/my-account/google-workspace/google-workspace-list',
			'AR'      => 'https://cliente.hostgator.ar/e-mails',
			'BO'      => 'https://cliente.hostgator.bo/e-mails',
			'BR'      => 'https://cliente.hostgator.com.br/emails-list',
			'CL'      => 'https://cliente.hostgator.cl/emails-list',
			'CO'      => 'https://cliente.hostgator.co/emails-list',
			'DO'      => 'https://cliente.hostgator.do/e-mails',
			'EC'      => 'https://cliente.hostgator.net.ec/e-mails',
			'MX'      => 'https://cliente.hostgator.mx/e-mails',
			'PE'      => 'https://cliente.hostgator.pe/e-mails',
			'UY'      => 'https://cliente.hostgator.uy/e-mails',
		),
		'home_find_domain'  => array(
			'default' => 'https://www.hostgator.com/my-account/domain-center/domain-list',
			'AR'      => 'https://www.hostgator.ar/dominios',
			'BO'      => 'https://www.hostgator.bo/dominios',
			'BR'      => 'https://www.hostgator.com.br/registro-de-dominio/',
			'CL'      => 'https://www.hostgator.cl/dominios',
			'CO'      => 'https://www.hostgator.co/dominios',
			'DO'      => 'https://www.hostgator.do/dominios',
			'EC'      => 'https://www.hostgator.net.ec/dominios',
			'MX'      => 'https://www.hostgator.mx/dominios',
			'PE'      => 'https://www.hostgator.pe/dominios',
			'UY'      => 'https://www.hostgator.uy/dominios',
		),
		'help_phone_number' => array(
			'default' => 'tel:8669642867',
			'AR'      => 'false',
			'BO'      => 'false',
			'BR'      => 'false',
			'CL'      => 'false',
			'CO'      => 'false',
			'DO'      => 'false',
			'EC'      => 'false',
			'MX'      => 'false',
			'PE'      => 'false',
			'UY'      => 'false',
		),
		'help_chat'         => array(
			'default' => 'https://helpchat.hostgator.com',
			'AR'      => 'https://soporte.hostgator.mx/hc/es-419/articles/28439167280915-C%C3%B3mo-entrar-en-contacto-con-Soporte',
			'BO'      => 'https://soporte.hostgator.mx/hc/es-419/articles/28439167280915-C%C3%B3mo-entrar-en-contacto-con-Soporte',
			'BR'      => 'https://soporte.hostgator.mx/hc/es-419/articles/28439167280915-C%C3%B3mo-entrar-en-contacto-con-Soporte',
			'CL'      => 'https://soporte.hostgator.mx/hc/es-419/articles/28439167280915-C%C3%B3mo-entrar-en-contacto-con-Soporte',
			'CO'      => 'https://soporte.hostgator.mx/hc/es-419/articles/28439167280915-C%C3%B3mo-entrar-en-contacto-con-Soporte',
			'DO'      => 'https://soporte.hostgator.mx/hc/es-419/articles/28439167280915-C%C3%B3mo-entrar-en-contacto-con-Soporte',
			'EC'      => 'https://soporte.hostgator.mx/hc/es-419/articles/28439167280915-C%C3%B3mo-entrar-en-contacto-con-Soporte',
			'MX'      => 'https://soporte.hostgator.mx/hc/es-419/articles/28439167280915-C%C3%B3mo-entrar-en-contacto-con-Soporte',
			'PE'      => 'https://soporte.hostgator.mx/hc/es-419/articles/28439167280915-C%C3%B3mo-entrar-en-contacto-con-Soporte',
			'UY'      => 'https://soporte.hostgator.mx/hc/es-419/articles/28439167280915-C%C3%B3mo-entrar-en-contacto-con-Soporte',
		),
		'help_twitter'      => array(
			'default' => 'https://twitter.com/hgsupport',
			'AR'      => 'false',
			'BO'      => 'false',
			'BR'      => 'false',
			'CL'      => 'false',
			'CO'      => 'false',
			'DO'      => 'false',
			'EC'      => 'false',
			'MX'      => 'false',
			'PE'      => 'false',
			'UY'      => 'false',
		),
		'help_kb'           => array(
			'default' => 'https://www.hostgator.com/help',
			'AR'      => 'https://soporte.hostgator.mx/hc/es-419',
			'BO'      => 'https://soporte.hostgator.mx/hc/es-419',
			'BR'      => 'https://suporte.hostgator.com.br/hc/pt-br',
			'CL'      => 'https://soporte.hostgator.mx/hc/es-419',
			'CO'      => 'https://soporte.hostgator.mx/hc/es-419',
			'DO'      => 'https://soporte.hostgator.mx/hc/es-419',
			'EC'      => 'https://soporte.hostgator.mx/hc/es-419',
			'MX'      => 'https://soporte.hostgator.mx/hc/es-419',
			'PE'      => 'https://soporte.hostgator.mx/hc/es-419',
			'UY'      => 'https://soporte.hostgator.mx/hc/es-419',
		),
		'help_blog'         => array(
			'default' => 'https://www.hostgator.com/blog/',
			'AR'      => 'https://www.hostgator.mx/blog/',
			'BO'      => 'https://www.hostgator.mx/blog/',
			'BR'      => 'https://www.hostgator.com.br/blog/',
			'CL'      => 'https://www.hostgator.mx/blog/',
			'CO'      => 'https://www.hostgator.mx/blog/',
			'DO'      => 'https://www.hostgator.mx/blog/',
			'EC'      => 'https://www.hostgator.mx/blog/',
			'MX'      => 'https://www.hostgator.mx/blog/',
			'PE'      => 'https://www.hostgator.mx/blog/',
			'UY'      => 'https://www.hostgator.mx/blog/',
		),
		'help_youtube'      => array(
			'default' => 'https://www.youtube.com/c/hostgatorUS',
			'AR'      => 'https://www.youtube.com/c/HostGatorMexico',
			'BO'      => 'https://www.youtube.com/c/HostGatorMexico',
			'BR'      => 'https://www.youtube.com/user/HostGatorBRTV',
			'CL'      => 'https://www.youtube.com/c/HostGatorMexico',
			'CO'      => 'https://www.youtube.com/c/HostGatorMexico',
			'DO'      => 'https://www.youtube.com/c/HostGatorMexico',
			'EC'      => 'https://www.youtube.com/c/HostGatorMexico',
			'MX'      => 'https://www.youtube.com/c/HostGatorMexico',
			'PE'      => 'https://www.youtube.com/c/HostGatorMexico',
			'UY'      => 'https://www.youtube.com/c/HostGatorMexico',
		),
	);

	/**
	 * Return the full regional link map (for JS runtime localization).
	 *
	 * @return array<string, array<string, string>>
	 */
	public static function links(): array {
		return self::LINKS;
	}

	/**
	 * Current region code, uppercased. Mirrors `getRegionValue()` in JS.
	 *
	 * @return string
	 */
	public static function region(): string {
		return strtoupper( (string) \get_option( 'hg_region', 'US' ) );
	}

	/**
	 * Resolve a link for the current (or specified) region, falling back to
	 * `default` if the region is missing or marked `'false'`.
	 *
	 * @param string      $key    One of the LINKS top-level keys.
	 * @param string|null $region Optional region override; defaults to current.
	 *
	 * @return string URL (or `tel:` for help_phone_number). Empty string if key unknown.
	 */
	public static function link( string $key, ?string $region = null ): string {
		if ( ! isset( self::LINKS[ $key ] ) ) {
			return '';
		}
		$region = $region ? strtoupper( $region ) : self::region();
		$value  = self::LINKS[ $key ][ $region ] ?? self::LINKS[ $key ]['default'];
		if ( 'false' === $value ) {
			return self::LINKS[ $key ]['default'];
		}
		return $value;
	}

	/**
	 * Whether a link is supported in the current (or specified) region.
	 * Mirrors `supportsLinkPerRegion()` in JS — `'false'` means hide the surface.
	 *
	 * @param string      $key    One of the LINKS top-level keys.
	 * @param string|null $region Optional region override; defaults to current.
	 *
	 * @return bool
	 */
	public static function supports( string $key, ?string $region = null ): bool {
		if ( ! isset( self::LINKS[ $key ] ) ) {
			return false;
		}
		$region = $region ? strtoupper( $region ) : self::region();
		$value  = self::LINKS[ $key ][ $region ] ?? self::LINKS[ $key ]['default'];
		return 'false' !== $value;
	}

	/**
	 * Brand icon URLs shared across surfaces (editor-chat avatar/menu, etc.).
	 *
	 * @return array{avatar:string,menu:string}
	 */
	public static function icons(): array {
		return array(
			'avatar' => HOSTGATOR_PLUGIN_URL . 'assets/svg/snappy.svg',
			'menu'   => HOSTGATOR_PLUGIN_URL . 'assets/svg/snappy-head.svg',
		);
	}

	/**
	 * Register brand payloads on the module loader container.
	 *
	 * @param \NewfoldLabs\WP\ModuleLoader\Container $container Module container.
	 *
	 * @return void
	 */
	public static function register( $container ) {
		$container->set( self::EDITOR_CHAT_CONTAINER_KEY, self::editor_chat_payload() );
	}

	/**
	 * Payload for wp-module-editor-chat. Portal URLs follow the current region
	 * via the shared LINKS map so onboarding and editor-chat stay in sync.
	 *
	 * @return array<string, mixed>
	 */
	private static function editor_chat_payload(): array {
		return array(
			'id'         => self::ID,
			'name'       => self::NAME,
			'accountUrl' => self::link( 'site_info_portal' ),
			'emailUrl'   => self::link( 'home_manage_email' ),
			'billingUrl' => self::link( 'site_info_portal' ),
			'adminUrl'   => \admin_url(),
			'icons'      => self::icons(),
		);
	}
}
