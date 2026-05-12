<?php

namespace HostGator;

use ReflectionClass;
use wpdb;

/**
 * @coversDefaultClass \HostGator\AutoIncrement
 */
class AutoIncrementWPUnitTest extends \lucatume\WPBrowser\TestCase\WPTestCase {

	/** @var wpdb */
	protected $wpdb;

	/** @var string */
	protected $prefix;

	/** @var string */
	protected $charset_collate;

	protected function setUp(): void {
		parent::setUp();

		/** @var wpdb $wpdb */
		global $wpdb;

		$this->wpdb = $wpdb;

		$this->prefix          = $wpdb->prefix;
		$this->charset_collate = $wpdb->get_charset_collate();

		require_once codecept_root_dir( 'inc/AutoIncrement.php' );
	}

	protected function tearDown(): void {
		parent::tearDown();

		global $wpdb;
		$wpdb->query(
			$wpdb->prepare(
				'DROP TABLE %i',
				array(
					$this->prefix . 'test_options',
				)
			)
		);
	}

	/**
	 * Some protected methods on the AutoIncrement class are helpful in the test assertions.
	 */
	protected function get_accessible_autoincrement_class() {
		$wpdb = $this->wpdb;
		/**
		 * @mixin AutoIncrement
		 */
		return new class($wpdb) {
			/** @var wpdb */
			public $wpdb;

			public function __construct( $wpdb ) {
				$this->wpdb = $wpdb;
			}

			/**
			 * Use Reflection to access protected methods on AutoIncrement class.
			 *
			 * @param string $name       Method name.
			 * @param array  $parameters Parameters.
			 * @return mixed
			 */
			public function __call( $name, $parameters ) {
				$autoincrement = new AutoIncrement( $this->wpdb );

				$class  = new ReflectionClass( AutoIncrement::class );
				$method = $class->getMethod( $name );
				$method->setAccessible( true );

				return $method->invokeArgs( $autoincrement, $parameters );
			}
		};
	}

	/**
	 * Check if a column has AUTO_INCREMENT by table name and column name.
	 *
	 * @param string $table_name The table name, with or without ~`wp_` prefix.
	 * @param string $column_name The column name to query.
	 */
	public function has_autoincrement( string $table_name, string $column_name ): bool {
		$autoincrement = $this->get_accessible_autoincrement_class();

		$prefixed_table_name = $autoincrement->get_prefixed_table_name( $table_name );
		$column_info         = $autoincrement->get_column_info( $prefixed_table_name, $column_name );

		return $autoincrement->column_info_has_autoincrement( $column_info );
	}

	protected function create_broken_table( string $unprefixed_test_table_name ): void {
		$prefixed_test_table_name = $this->prefix . $unprefixed_test_table_name;

		$create_broken_table = <<<SQL
CREATE TABLE `{$prefixed_test_table_name}` (
  `option_id` bigint unsigned NOT NULL,
  `option_name` varchar(191) DEFAULT '',
  `option_value` longtext NOT NULL,
  `autoload` varchar(20) NOT NULL DEFAULT 'yes',
  KEY `autoload` (`autoload`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 $this->charset_collate
SQL;

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $create_broken_table );
	}

	protected function create_table_with_primary_key( string $unprefixed_test_table_name ): void {
		$prefixed_test_table_name = $this->prefix . $unprefixed_test_table_name;

		$create_broken_table = <<<SQL
CREATE TABLE `{$prefixed_test_table_name}` (
  `option_id` bigint unsigned NOT NULL,
  `option_id_primary` bigint unsigned NOT NULL,
  `option_name` varchar(191) DEFAULT '',
  `option_value` longtext NOT NULL,
  `autoload` varchar(20) NOT NULL DEFAULT 'yes',
  KEY `autoload` (`autoload`),
  PRIMARY KEY (`option_id_primary`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 $this->charset_collate
SQL;

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $create_broken_table );
	}

	/**
	 * Test the happy path that a table without auto-increment is fixed.
	 */
	public function test_add_missing_autoincrement(): void {
		$unprefixed_test_table_name = 'test_options';

		$this->create_broken_table( $unprefixed_test_table_name );

		$sut = new AutoIncrement( $this->wpdb );

		$this->assertFalse( $this->has_autoincrement( $unprefixed_test_table_name, 'option_id' ) );

		$sut->fix_auto_increment( $unprefixed_test_table_name, 'option_id' );

		$this->assertTrue( $this->has_autoincrement( $unprefixed_test_table_name, 'option_id' ) );
	}

	/**
	 * Test the entries sharing the same id 0 are give unique ids before the primary key is added.
	 */
	public function test_update_id_of_entries(): void {
		$unprefixed_test_table_name = 'test_options';
		$this->create_broken_table( $unprefixed_test_table_name );

		/** @var wpdb $wpdb */
		$wpdb = $this->wpdb;
		for ( $i = 1; $i <= 10; $i++ ) {
			$wpdb->query(
				$wpdb->prepare(
					"INSERT INTO %i VALUES (0, %s, 'value', true)",
					array(
						$this->prefix . $unprefixed_test_table_name,
						"key{$i}",
					)
				)
			);
		}

		$sut = new AutoIncrement( $this->wpdb );
		$sut->fix_auto_increment( $unprefixed_test_table_name, 'option_id' );

		$result = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM %i',
				array(
					$this->prefix . $unprefixed_test_table_name,
				)
			),
			ARRAY_A
		);

		$this->assertCount( 10, $result );

		$ids = wp_list_pluck( $result, 'option_id' );
		$this->assertCount( 10, array_unique( $ids ) );

		$wpdb->query(
			$wpdb->prepare(
				'INSERT INTO %i (`option_name`, `option_value`) VALUES (%s, %s) ',
				array(
					$this->prefix . $unprefixed_test_table_name,
					'new_key',
					'new_value',
				)
			)
		);

		$new_row = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM %i WHERE `option_name` = %s',
				array(
					$this->prefix . $unprefixed_test_table_name,
					'new_key',
				)
			),
			ARRAY_A
		);

		$this->assertNotEmpty( $new_row );
		$this->assertEquals( '11', $new_row[0]['option_id'] );

		$create_table = $wpdb->get_row(
			$wpdb->prepare(
				'SHOW CREATE TABLE %i',
				array(
					$this->prefix . $unprefixed_test_table_name,
				)
			),
			ARRAY_A
		);

		$this->assertStringContainsString( 'AUTO_INCREMENT=12', $create_table['Create Table'] );
	}

	/**
	 * Confirm a primary key on another column is removed first.
	 */
	public function test_removes_other_primary_key(): void {
		$unprefixed_test_table_name = 'test_options';
		$this->create_table_with_primary_key( $unprefixed_test_table_name );

		$sut = new AutoIncrement( $this->wpdb );

		$sut->fix_auto_increment( $unprefixed_test_table_name, 'option_id' );

		$autoincrement = $this->get_accessible_autoincrement_class();
		$this->assertEquals( 'option_id', $autoincrement->get_primary_key_column_name( $this->wpdb->prefix . $unprefixed_test_table_name ) );
	}

	/**
	 * Check does the existence of an index already on the column to be made primary key matter.
	 */
	public function test_sets_primary_key_when_index_exists(): void {
		$unprefixed_test_table_name = 'test_options';
		$this->create_table_with_primary_key( $unprefixed_test_table_name );

		$prefixed_test_table_name = $this->prefix . $unprefixed_test_table_name;

		$wpdb = $this->wpdb;
		$wpdb->query(
			$wpdb->prepare(
				'ALTER TABLE %i ADD INDEX `option_id_index` (`option_id`)',
				array(
					$prefixed_test_table_name,
				)
			)
		);

		$sut = new AutoIncrement( $this->wpdb );

		$sut->fix_auto_increment( $unprefixed_test_table_name, 'option_id' );

		$autoincrement = $this->get_accessible_autoincrement_class();
		$this->assertEquals( 'option_id', $autoincrement->get_primary_key_column_name( $this->wpdb->prefix . $unprefixed_test_table_name ) );
	}
}
