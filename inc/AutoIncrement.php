<?php
/**
 * Healthcheck to fix cases where auto-increment value is missing from tables.
 *
 * @package HostGatorWordPressPlugin
 */

namespace HostGator;

use Exception;
use wpdb;

/**
 * Functions for fixing missing AUTO_INCREMENT on WordPress tables.
 *
 * @phpstan-type ColumnInfoArray array{Field:string, Type:string, Null:string, Key:string, Default:mixed|null, Extra:string}
 */
class AutoIncrement {

	/**
	 * The WordPress database instance.
	 *
	 * @var wpdb
	 */
	private $wpdb;

	/**
	 * Constructor.
	 *
	 * @param wpdb $wpdb WordPress DB ORM.
	 */
	public function __construct(
		wpdb $wpdb
	) {
		$this->wpdb = $wpdb;
	}

	/**
	 * Add the WordPress table prefix to the table name if missing.
	 *
	 * @param string $table_name The table name, with or without `wp_` prefix.
	 */
	protected function get_prefixed_table_name( string $table_name ): string {
		return 0 === strpos( $table_name, $this->wpdb->prefix )
			? $table_name
			: $this->wpdb->prefix . $table_name;
	}

	/**
	 * Fix missing AUTO_INCREMENT on wp_options.option_id if removed accidentally.
	 *
	 * This routine checks the wp_options table and ensures that
	 * the `option_id` column is correctly set as an AUTO_INCREMENT primary key.
	 *
	 * Safe to run multiple times — it will only alter the table if needed.
	 *
	 * @param string $table_name The table name, with or without `wp_` prefix.
	 * @param string $column_name The column name to fix.
	 *
	 * @throws Exception When column info cannot be retrieved, e.g. table does not exist.
	 */
	public function fix_auto_increment(
		string $table_name,
		string $column_name
	): void {

		$wpdb = $this->wpdb;

		$prefixed_table_name = $this->get_prefixed_table_name( $table_name );

		$column_info = $this->get_column_info( $prefixed_table_name, $column_name );

		if ( ! $column_info ) {
			$error = $wpdb->last_error;
			throw new Exception( esc_html( $error ) );
		}

		if ( $this->column_info_has_autoincrement( $column_info ) ) {
			return;
		}

		try {

			$wpdb->query(
				$wpdb->prepare(
					'LOCK TABLES %i WRITE;',
					array(
						$prefixed_table_name,
					)
				)
			);

			// Step 1: Check if there are rows with id = 0.
			$zero_id_rows = $wpdb->get_results(
				$wpdb->prepare(
					'SELECT %i FROM %i WHERE %i = 0',
					array(
						$column_name,
						$prefixed_table_name,
						$column_name,
					)
				),
			);

			if ( ! empty( $zero_id_rows ) ) {
				// Find current max ID.
				$max_id = (int) $this->wpdb->get_var(
					$wpdb->prepare(
						'SELECT MAX(%i) FROM %i',
						array(
							$column_name,
							$prefixed_table_name,
						)
					)
				);

				// Increment and fix zero-id rows.
				foreach ( $zero_id_rows as $_row ) {
					++$max_id;
					$this->wpdb->query(
						$wpdb->prepare(
							'UPDATE %i SET %i = %d WHERE %i = 0 LIMIT 1',
							array(
								$prefixed_table_name,
								$column_name,
								$max_id,
								$column_name,
							)
						)
					);
				}
			}

			// Step 2: Ensure the correct primary key exists on this column.
			$this->set_correct_primary_key_column( $prefixed_table_name, $column_name );

			// Step 3: Fix the column definition — Apply AUTO_INCREMENT safely.
			$wpdb->query(
				$wpdb->prepare(
					// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
					"ALTER TABLE %i MODIFY COLUMN %i {$column_info['Type']} NOT NULL auto_increment;",
					array(
						$prefixed_table_name,
						$column_name,
					)
				)
			);
		} finally {
			$wpdb->query( 'UNLOCK TABLES;' );
		}
	}

	/**
	 * Get the column definition use `SHOW COLUMNS FROM ... LIKE ...`.
	 *
	 * @see https://dev.mysql.com/doc/refman/8.4/en/show-columns.html
	 *
	 * @param string $prefixed_table_name The table name, with ~`wp_` prefix.
	 * @param string $column_name The column name to query.
	 *
	 * @return ?ColumnInfoArray
	 */
	protected function get_column_info( string $prefixed_table_name, string $column_name ): ?array {
		$wpdb = $this->wpdb;
		return $wpdb->get_row(
			$wpdb->prepare(
				'SHOW COLUMNS FROM %i LIKE %s',
				array(
					$prefixed_table_name,
					$column_name,
				)
			),
			ARRAY_A
		);
	}

	/**
	 * Check the column info to see if it has AUTO_INCREMENT.
	 *
	 * @param array $column_info The column info from a `SHOW COLUMNS...` query.
	 */
	protected function column_info_has_autoincrement( array $column_info ): bool {
		return stripos( $column_info['Extra'], 'auto_increment' ) !== false;
	}

	/**
	 * Check is there an existing primary key for the correct column, if there is another remove it, set the column
	 * to be the table's PRIMARY key.
	 *
	 * @param string $prefixed_table_name The table to check/modify.
	 * @param string $column_name The column that should be the primary key.
	 *
	 * @throws Exception When there is a database error.
	 */
	protected function set_correct_primary_key_column( string $prefixed_table_name, string $column_name ): void {

		$existing_primary_key = $this->get_primary_key_column_name( $prefixed_table_name );

		if ( $existing_primary_key === $column_name ) {
			return;
		}

		if ( ! is_null( $existing_primary_key ) ) {
			$this->drop_primary_key( $prefixed_table_name );
		}

		$wpdb = $this->wpdb;

		// Add a primary key on this column.
		$wpdb->query(
			$wpdb->prepare(
				'ALTER TABLE %i ADD PRIMARY KEY (%i)',
				array( $prefixed_table_name, $column_name )
			)
		);

		$error = $this->wpdb->last_error;
		if ( $error ) {
			throw new Exception( esc_html( $error ) );
		}
	}

	/**
	 * Remove the primary key.
	 *
	 * @param string $prefixed_table_name The table to modify.
	 */
	protected function drop_primary_key( string $prefixed_table_name ): void {

		$wpdb = $this->wpdb;

		$wpdb->query(
			$wpdb->prepare(
				'ALTER TABLE %i DROP PRIMARY KEY;',
				array( $prefixed_table_name )
			)
		);
	}

	/**
	 * Run `SHOW KEYS...` query to determine if/name of the table's primary key.
	 *
	 * @see https://dev.mysql.com/doc/refman/8.4/en/show-index.html
	 *
	 * @param string $prefixed_table_name The table to check.
	 *
	 * @return ?string Null if there is no primary key.
	 *
	 * @throws Exception When there is a database error (e.g. invalid table name).
	 */
	protected function get_primary_key_column_name( string $prefixed_table_name ): ?string {
		$wpdb = $this->wpdb;

		/**
		 * Query for an index named "PRIMARY".
		 *
		 * @var array<array{"Table":string,"Non_unique":"0"|"1","Key_name":string,"Seq_in_index":numeric-string,"Column_name":string,"Collation":"A"|"D"|null,"Cardinality":numeric-string,"Sub_part":numeric|null,"Packed":null,"Null":"YES"|string,"Index_type":string,"Comment":string,"Index_comment":string,"Ignored":string}> $existing_primary_key
		 */
		$existing_primary_key = $wpdb->get_results(
			$wpdb->prepare(
				"SHOW KEYS FROM %i WHERE Key_name = 'PRIMARY'",
				array( $prefixed_table_name )
			),
			ARRAY_A
		);

		$error = $this->wpdb->last_error;
		if ( $error ) {
			throw new Exception( esc_html( $error ) );
		}

		/**
		 * There can only be one primary key on a table so this array should have zero or one values.
		 *
		 * @var array{0?:string} $primary_key_columns
		 */
		$primary_key_columns = wp_list_pluck( $existing_primary_key, 'Column_name' );

		return isset( $primary_key_columns[0] ) ? $primary_key_columns[0] : null;
	}
}
