'use strict';

const ApiBase = require('./api-base');

/**
 * A class for making calls to the MLB API of MySportsFeeds. Will be able to use
 * the exact methods from the base class unless there is some MLB specific
 * difference such as using "innings" instead of "halves" etc.
 * @class
 */
class MlbApi extends ApiBase {
  /**
   * Creates a new instance of the MlbApi class
   * @param {Object} options - The constructor options
   */
  constructor(options) {
    super(options);

    this._leaguePath = '/mlb';
  }
}

module.exports = MlbApi;
