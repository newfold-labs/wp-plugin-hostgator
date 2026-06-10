<?php

namespace HostGator;

/**
 * WPUnit tests for HostGator dashboard Site Preview widget (parity subset of Bluehost WidgetsWpunitTest).
 *
 * @covers \HostGator\HostGatorSitePreviewWidget
 */
class WidgetsWpunitTest extends \lucatume\WPBrowser\TestCase\WPTestCase {

	protected function setUp(): void {
		parent::setUp();
		require_once codecept_root_dir( 'inc/widgets/SitePreview.php' );
	}

	public function test_site_preview_widget_has_expected_id(): void {
		$this->assertSame( 'site_preview_widget', \HostGator\HostGatorSitePreviewWidget::ID );
	}
}
