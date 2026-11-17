<?php
/**
 * Plugin Name: CI - Log slow outbound HTTP requests
 * Description: Diagnostic only. Logs every outbound WordPress HTTP request that takes longer than 2 seconds
 *              (or fails) to debug.log so CI can identify which host stalls wp-login.php / wp-cron.php.
 *
 * @package HostGatorWordPressPlugin
 */

// phpcs:disable

add_filter(
	'pre_http_request',
	function ( $preempt, $args, $url ) {
		$GLOBALS['nfd_ci_http_start'][ $url ] = microtime( true );
		return $preempt;
	},
	1,
	3
);

add_action(
	'http_api_debug',
	function ( $response, $context, $class, $args, $url ) {
		$start   = $GLOBALS['nfd_ci_http_start'][ $url ] ?? null;
		$elapsed = $start ? microtime( true ) - $start : -1;
		$failed  = is_wp_error( $response );
		if ( $failed || $elapsed > 2 ) {
			error_log(
				sprintf(
					'[ci-http] %.2fs %s %s timeout=%s %s',
					$elapsed,
					$args['method'] ?? 'GET',
					$url,
					$args['timeout'] ?? '?',
					$failed ? 'ERROR: ' . $response->get_error_message() : 'HTTP ' . wp_remote_retrieve_response_code( $response )
				)
			);
		}
	},
	10,
	5
);
