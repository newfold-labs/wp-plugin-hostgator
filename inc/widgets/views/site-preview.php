<?php
/**
 * Site Preview Widget View
 *
 * Rendered on the WordPress dashboard Site Preview widget.
 *
 * @package HostGatorWordPressPlugin
 */

namespace HostGator;

use function NewfoldLabs\WP\Module\ComingSoon\isComingSoonActive;
use function NewfoldLabs\WP\Module\LinkTracker\Functions\build_link as buildLink;

$isComingSoon = isComingSoonActive();

// globe-alt icon - in widget handle
$svg    = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
</svg>';
$svg_64 = base64_encode( $svg );
// check-circle
$svgEnabled = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>';
// exclamation-triangle
$svgDisabled = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
</svg>';
// rocket-launch
$svgRocket = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
</svg>';
// wrench
$svgWrench = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
</svg>';
// pencil
$svgPencil = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
</svg>';
// arrow-top-right-on
$svgExternalView = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
</svg>';
$site_edit_url = buildLink(
	Filters::get_site_edit_admin_url(),
	array( 'source' => 'widget=hostgator_site_preview' )
);
?>
<style>
	#site_preview_widget h2 {
		justify-content: start;
		gap: .5rem;
	}
	#site_preview_widget h2:before {
		content: url('data:image/svg+xml;base64,<?php echo esc_attr( $svg_64 ); ?>');
		width: 24px;
		height: 24px;
	}
	#iframe-preview-wrap {
		position: relative;
		overflow: hidden;
		padding-top: 60%;
		border: 1px solid #dbd1d1;
		border-radius: 0.375rem;
	}
	#iframe-preview-label {
		width: 100%;
		position: absolute;
		top: 0;
		text-transform: uppercase;
	}
	#iframe-preview-detail {
		width: 100%;
		position: absolute;
		bottom: 0;
	}
	#iframe-wrap {
		position: relative;
	}
	#iframe-preview {
		width: 400%;
		height: 400%;
		transform: scale(0.25);
		transform-origin: top left;
		position: absolute;
		top: 20px;
		left: 0;
		right: 0;
		bottom: 0;
	}
	.iframe-preview-domain {
		font-weight: bold;
	}
	.iframe-preview-status svg {
		width: 1.5rem;
	}
	.iframe-preview-status.status-coming-soon {
		color: rgb(205 0 1);
	}
	.iframe-preview-status.status-live {
		color: rgb(0 109 18);
	}
</style>
<div class="nfd-root nfd-widget nfd-widget-site-preview">

	<div id="iframe-preview-wrap">
		<div
			id="iframe-preview-label"
			class="nfd-flex nfd-justify-center nfd-items-center nfd-p-1 nfd-bg-gray-200 nfd-border-b nfd-border-[#dbd1d1] nfd-z-10"
		>
			<p class="nfd-font-bold"><?php esc_html_e( 'Site Preview', 'wp-plugin-hostgator' ); ?></p>
		</div>
		<div class="iframe-wrap">
			<iframe
				id="iframe-preview"
				title="<?php esc_attr_e( 'Site Preview', 'wp-plugin-hostgator' ); ?>"
				class="nfd-basis-full nfd-relative"
				src="<?php echo esc_url( get_bloginfo( 'url' ) . '?preview=coming_soon' ); ?>"
				scrolling="no"
				name="iframe-preview"
				sandbox="allow-scripts allow-same-origin"
				seamless
			></iframe>
		</div>
		<div
			id="iframe-preview-detail"
			class="nfd-flex nfd-justify-between nfd-items-center nfd-p-1 nfd-px-6 nfd-bg-gray-200 nfd-border-t nfd-border-[#dbd1d1] nfd-z-10"
		>
			<span class="iframe-preview-domain nfd-font-semibold">
				<?php
					$parseUrl = wp_parse_url( get_bloginfo( 'url' ) );
					echo esc_html( $parseUrl['host'] );
				?>
			</span>
			<span class="iframe-preview-status nfd-flex nfd-flex-row nfd-items-center nfd-gap-2 nfd-font-semibold
				<?php echo esc_attr( $isComingSoon ? 'status-coming-soon' : 'status-live' ); ?>
			">
				<?php
					echo $isComingSoon ?
					wp_kses( $svgDisabled, KSES_ALLOWED_SVG_TAGS ) :
					wp_kses( $svgEnabled, KSES_ALLOWED_SVG_TAGS );
				?>
				<span>
					<?php
						echo $isComingSoon ?
						esc_html__( 'Not Live', 'wp-plugin-hostgator' ) :
						esc_html__( 'Live', 'wp-plugin-hostgator' );
					?>
				</span>
			</span>
		</div>
	</div>

	<p
		class="site-preview-widget-body nfd-text-center nfd-mt-4"
		data-coming-soon="<?php echo esc_attr( $isComingSoon ? 'true' : 'false' ); ?>"
	>
		<?php
			echo $isComingSoon ?
			esc_html__( 'Your website is currently displaying a "Coming Soon" page.', 'wp-plugin-hostgator' ) :
			esc_html__( 'Your website is live to the world!', 'wp-plugin-hostgator' );
		?>
	</p>

	<div class="site-preview-widget-buttons nfd-flex nfd-gap-2 nfd-justify-between nfd-items-center nfd-text-center nfd-mt-4 nfd-mb-4">
		<a
			class="nfd-button nfd-button--secondary"
			data-test-id="<?php echo esc_attr( $isComingSoon ? 'nfd-preview-site' : 'nfd-view-site' ); ?>"
			href="<?php echo esc_url( buildLink( get_bloginfo( 'url' ), array( 'source' => 'widget=hostgator_site_preview' ) ) ); ?>"
			id="nfd-view-site"
			target="_blank"
		>
			<?php echo wp_kses( $svgExternalView, KSES_ALLOWED_SVG_TAGS ); ?>
			<?php
				$isComingSoon ?
				esc_html_e( 'Preview Site', 'wp-plugin-hostgator' ) :
				esc_html_e( 'View Site', 'wp-plugin-hostgator' );
			?>
		</a>
		<a
			class="nfd-button nfd-button--secondary"
			data-test-id="nfd-edit-site"
			href="<?php echo esc_url( $site_edit_url ); ?>"
			id="nfd-edit-site"
		>
			<?php echo wp_kses( $svgPencil, KSES_ALLOWED_SVG_TAGS ); ?>
			<?php esc_html_e( 'Edit Site', 'wp-plugin-hostgator' ); ?>
		</a>
		<?php if ( $isComingSoon ) : ?>
			<a
				class="nfd-button nfd-button--upsell nfd-grow"
				data-test-id="nfd-coming-soon-disable"
				href="#"
				id="nfd-coming-soon-disable"
			>
				<?php echo wp_kses( $svgRocket, KSES_ALLOWED_SVG_TAGS ); ?>
				<?php esc_html_e( 'Launch Site', 'wp-plugin-hostgator' ); ?>
			</a>
		<?php else : ?>
			<a
				class="nfd-button nfd-button--secondary nfd-grow nfd-text-balance"
				data-test-id="nfd-coming-soon-enable"
				href="#"
				id="nfd-coming-soon-enable"
			>
				<?php echo wp_kses( $svgWrench, KSES_ALLOWED_SVG_TAGS ); ?>
				<?php esc_html_e( 'Enable Coming Soon', 'wp-plugin-hostgator' ); ?>
			</a>
		<?php endif; ?>
		</div>
</div>
<script>
document.addEventListener( 'DOMContentLoaded', initSitePreviewButtonHandlers, false );
function initSitePreviewButtonHandlers(){
	const enable_button = document.getElementById( 'nfd-coming-soon-enable' );
	if ( enable_button ) {
		enable_button.addEventListener( 'click', function( e ) {
			e.preventDefault();
			if ( e.target.hasAttribute( 'disabled' ) ) {
				return;
			}
			e.target.setAttribute( 'disabled', '' );
			window.NewfoldRuntime.comingSoon.enable().then( () => {
				window.location.reload();
			});
		});
	}

	const disable_button = document.getElementById( 'nfd-coming-soon-disable' );
	if ( disable_button ) {
		disable_button.addEventListener( 'click', function( e ) {
			e.preventDefault();
			if ( e.target.hasAttribute( 'disabled' ) ) {
				return;
			}
			e.target.setAttribute( 'disabled', '' );
			window.NewfoldRuntime.comingSoon.disable().then( () => {
				window.location.reload();
			});
		});
	}
};
</script>
