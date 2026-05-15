<?php

namespace HostGator;

use NewfoldLabs\WP\Module\SSO\SSO_Hosting_Login;

/**
 * WPUnit tests for HostGator\Filters (Hiive headers, coming soon portal, hosting login).
 *
 * @coversDefaultClass \HostGator\Filters
 */
class FiltersWpunitTest extends \lucatume\WPBrowser\TestCase\WPTestCase {

	/**
	 * @var callable|null
	 */
	private $stylesheet_wvc_stub;

	/**
	 * @var callable|null
	 */
	private $template_wvc_stub;

	protected function setUp(): void {
		parent::setUp();
		require_once codecept_root_dir( 'inc/Helpers.php' );
		require_once codecept_root_dir( 'inc/Brand.php' );
		require_once codecept_root_dir( 'inc/Filters.php' );
		$this->stylesheet_wvc_stub = null;
		$this->template_wvc_stub   = null;
	}

	protected function tearDown(): void {
		if ( $this->stylesheet_wvc_stub ) {
			\remove_filter( 'stylesheet', $this->stylesheet_wvc_stub, 99 );
			$this->stylesheet_wvc_stub = null;
		}
		if ( $this->template_wvc_stub ) {
			\remove_filter( 'template', $this->template_wvc_stub, 99 );
			$this->template_wvc_stub = null;
		}
		remove_all_filters( 'http_request_args' );
		remove_all_filters( 'newfold/sso/hosting_login' );
		remove_all_filters( 'newfold/coming-soon/filter/portal_data' );
		parent::tearDown();
	}

	private function stub_theme_slugs( string $stylesheet, string $template ): void {
		$this->stylesheet_wvc_stub = static function () use ( $stylesheet ) {
			return $stylesheet;
		};
		$this->template_wvc_stub = static function () use ( $template ) {
			return $template;
		};
		\add_filter( 'stylesheet', $this->stylesheet_wvc_stub, 99 );
		\add_filter( 'template', $this->template_wvc_stub, 99 );
	}

	private function stub_wvc_theme_slugs(): void {
		$this->stub_theme_slugs( 'wvc-theme', 'wvc-theme' );
	}

	private function stub_template_only_wvc(): void {
		$this->stub_theme_slugs( 'wvc-child', 'wvc-theme' );
	}

	private function stub_non_wvc_theme_slugs(): void {
		$this->stub_theme_slugs( 'twentytwentyfive', 'twentytwentyfive' );
	}

	/** @covers \HostGator\Filters::add_hiive_headers */
	public function test_add_hiive_headers_returns_unchanged_when_url_not_hiive(): void {
		$args = array(
			'method'  => 'GET',
			'headers' => array( 'Accept' => 'application/json' ),
		);
		$result = \HostGator\Filters::add_hiive_headers( $args, 'https://example.com/api' );
		$this->assertSame( $args, $result );
	}

	/** @covers \HostGator\Filters::add_hiive_headers */
	public function test_add_hiive_headers_returns_unchanged_when_headers_missing(): void {
		$args = array( 'method' => 'GET' );
		$result = \HostGator\Filters::add_hiive_headers( $args, 'https://other.org/feed' );
		$this->assertSame( $args, $result );
	}

	/** @covers \HostGator\Filters::filter_coming_soon_portal_data */
	public function test_filter_coming_soon_portal_data_returns_non_array_unchanged(): void {
		$not_array = new \stdClass();
		$result    = \HostGator\Filters::filter_coming_soon_portal_data( $not_array );
		$this->assertSame( $not_array, $result );
	}

	/** @covers \HostGator\Filters::filter_coming_soon_portal_data */
	public function test_filter_coming_soon_portal_data_leaves_array_when_not_wvc_theme(): void {
		$this->stub_non_wvc_theme_slugs();
		$input = array(
			'isComingSoon' => true,
			'editUrl'      => 'https://example.test/wp-admin/customize.php',
			'viewUrl'      => 'https://example.test',
			'previewUrl'   => 'https://example.test/?preview=coming_soon',
		);
		$result = \HostGator\Filters::filter_coming_soon_portal_data( $input );
		$this->assertSame( $input, $result );
	}

	/** @covers \HostGator\Filters::filter_coming_soon_portal_data */
	public function test_filter_coming_soon_portal_data_sets_wvc_editor_when_wvc_theme(): void {
		$this->stub_wvc_theme_slugs();
		$input = array(
			'isComingSoon' => true,
			'editUrl'      => 'https://example.test/wp-admin/site-editor.php',
			'viewUrl'      => 'https://example.test',
			'previewUrl'   => 'https://example.test/?preview=coming_soon',
		);
		$result = \HostGator\Filters::filter_coming_soon_portal_data( $input );
		$this->assertIsArray( $result );
		$this->assertArrayHasKey( 'editUrl', $result );
		$this->assertStringStartsWith( \admin_url(), $result['editUrl'] );
		$this->assertStringContainsString( 'admin.php?page=wvc-editor', $result['editUrl'] );
		$this->assertSame( $input['isComingSoon'], $result['isComingSoon'] );
		$this->assertSame( $input['viewUrl'], $result['viewUrl'] );
		$this->assertSame( $input['previewUrl'], $result['previewUrl'] );
	}

	/** @covers \HostGator\Filters::get_site_edit_admin_url */
	public function test_get_site_edit_admin_url_points_to_wvc_editor_when_wvc_theme(): void {
		$this->stub_wvc_theme_slugs();
		$url = \HostGator\Filters::get_site_edit_admin_url();
		$this->assertStringStartsWith( \admin_url(), $url );
		$this->assertStringContainsString( 'admin.php?page=wvc-editor', $url );
	}

	/** @covers \HostGator\Filters::get_site_edit_admin_url */
	public function test_get_site_edit_admin_url_wvc_when_only_template_slug_is_wvc(): void {
		$this->stub_template_only_wvc();
		$url = \HostGator\Filters::get_site_edit_admin_url();
		$this->assertStringContainsString( 'admin.php?page=wvc-editor', $url );
	}

	/** @covers \HostGator\Filters::get_site_edit_admin_url */
	public function test_get_site_edit_admin_url_uses_site_editor_or_customizer_when_not_wvc(): void {
		$this->stub_non_wvc_theme_slugs();
		$url      = \HostGator\Filters::get_site_edit_admin_url();
		$expected = \wp_is_block_theme() ? 'site-editor.php?canvas=edit' : 'customize.php';
		$this->assertSame( \admin_url( $expected ), $url );
	}

	/** @covers \HostGator\Filters::init */
	public function test_init_registers_portal_data_filter(): void {
		\HostGator\Filters::init();

		$callback = array( \HostGator\Filters::class, 'filter_coming_soon_portal_data' );

		$this->assertNotFalse(
			\has_filter( 'newfold/coming-soon/filter/portal_data', $callback )
		);
	}

	/** @covers \HostGator\Filters::configure_hosting_login */
	public function test_configure_hosting_login_enables_button(): void {
		$config = \HostGator\Filters::configure_hosting_login( array() );
		$this->assertTrue( $config['enabled'] );
	}

	/** @covers \HostGator\Filters::configure_hosting_login */
	public function test_configure_hosting_login_label_and_color(): void {
		$config = \HostGator\Filters::configure_hosting_login( array() );
		$this->assertSame( __( 'Login with HostGator', 'wp-plugin-hostgator' ), $config['label'] );
		$this->assertSame( \HostGator\Brand::BUTTON_BACKGROUND, $config['accent_color'] );
	}

	/** @covers \HostGator\Filters::configure_hosting_login */
	public function test_configure_hosting_login_url_targets_hostgator_portal(): void {
		$config = \HostGator\Filters::configure_hosting_login( array() );
		$this->assertStringContainsString(
			'hostgator.com/my-account/hosting/details/sites',
			$config['url']
		);
	}

	/** @covers \HostGator\Filters::configure_hosting_login */
	public function test_configure_hosting_login_icon_returns_snappy_svg_markup(): void {
		$config = \HostGator\Filters::configure_hosting_login( array() );
		$this->assertNotEmpty( $config['icon_svg'] );
		$this->assertStringContainsString( '<svg', $config['icon_svg'] );
		$this->assertStringContainsString( '</svg>', $config['icon_svg'] );
	}

	/** @covers \HostGator\Filters::configure_hosting_login */
	public function test_configure_hosting_login_preserves_unrelated_keys(): void {
		$config = \HostGator\Filters::configure_hosting_login( array( 'custom' => 'value' ) );
		$this->assertSame( 'value', $config['custom'] );
	}

	public function test_filter_is_registered_on_init(): void {
		\HostGator\Filters::init();
		$config = apply_filters(
			SSO_Hosting_Login::FILTER,
			array()
		);
		$this->assertTrue( ! empty( $config['enabled'] ) );
		$this->assertSame( __( 'Login with HostGator', 'wp-plugin-hostgator' ), $config['label'] );
	}
}
