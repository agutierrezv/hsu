/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name : ['hsu-api'],
  /**
   * Your New Relic license key.
   */
  license_key : process.env.NEW_RELIC_LICENSE_KEY || '04ec8cf29d2ed10795603a654453a7cbaaa0e188',
  logging : {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level : 'trace'
    //level : 'info'
  }
};
