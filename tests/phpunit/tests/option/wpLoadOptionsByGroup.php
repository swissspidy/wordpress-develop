<?php
/**
 * Test wp_load_options_by_group().
 *
 * @group option
 *
 * @covers ::wp_load_options_by_group
 */
class Tests_Option_PrimeOptionsByGroup extends WP_UnitTestCase {

	/**
	 * Tests that wp_load_options_by_group() only loads options in the specified group.
	 *
	 * @ticket 58962
	 */
	public function test_wp_load_options_by_group() {
		global $new_allowed_options;

		// Create some options to load.
		$new_allowed_options = array(
			'group1' => array(
				'option1',
				'option2',
			),
			'group2' => array(
				'option3',
			),
		);

		$options_to_load = array(
			'option1',
			'option2',
			'option3',
		);

		/*
		 * Set values for the options,
		 * clear the cache for the options,
		 * check options are not in cache initially.
		 */
		foreach ( $options_to_load as $option ) {
			update_option( $option, "value_$option", false );
			wp_cache_delete( $option, 'options' );
			$this->assertFalse( wp_cache_get( $option, 'options' ), "$option was not deleted from the cache." );
		}

		// Call the wp_load_options_by_group function to load the options.
		wp_load_options_by_group( 'group1' );

		// Check that options are now in the cache.
		$this->assertSame( get_option( 'option1' ), wp_cache_get( 'option1', 'options' ), 'option1 was not loaded.' );
		$this->assertSame( get_option( 'option2' ), wp_cache_get( 'option2', 'options' ), 'option2 was not loaded.' );

		// Make sure option3 is still not in cache.
		$this->assertFalse( wp_cache_get( 'option3', 'options' ), 'option3 was not deleted from the cache.' );
	}

	/**
	 * Tests wp_load_options_by_group() with a nonexistent option group.
	 *
	 * @ticket 58962
	 */
	public function test_wp_load_options_by_group_with_nonexistent_group() {
		// Make sure options are not in cache or database initially.
		$this->assertFalse( wp_cache_get( 'option1', 'options' ), 'option1 was not deleted from the cache.' );
		$this->assertFalse( wp_cache_get( 'option2', 'options' ), 'option2 was not deleted from the cache.' );

		// Call the wp_load_options_by_group function with a nonexistent group.
		wp_load_options_by_group( 'nonexistent_group' );

		// Check that options are still not in the cache or database.
		$this->assertFalse( wp_cache_get( 'option1', 'options' ), 'option1 was not deleted from the cache.' );
		$this->assertFalse( wp_cache_get( 'option2', 'options' ), 'option2 was not deleted from the cache.' );
	}
}
