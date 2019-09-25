'use strict';

const request = require('superagent');
const precond = require('precond');
const moment = require('moment');

const BASE64 = 'base64';
const CURRENT = 'current';
const AUTHORIZATION = 'Authorization';

/**
 * A base class for API calls to MySportsFeeds
 * @class
 */
class ApiBase {
  /**
   * Create an instance of the MySportsFeeds base class
   * @param {Object} options - The initialization options
   * @prop {String} apiKey - MySportsFeds API Key
   * @prop {Stirng} password - MySportsFeeds password
   */
  constructor(options) {
    const apiKey = precond.checkIsString(options.apiKey);
    const password = precond.checkIsString(options.password);

    this._authHeader = _generateAuthHeader(apiKey, password);
    this._baseUrl = 'https://api.mysportsfeeds.com/v1.2/pull';
    this._leaguePath = '';
  }

  /**
   * Builds a request with the specified method and url, adding the auth
   * header required for the MySportsFeeds API
   * @param {String} method - The request method
   * @param {String} url - The URL to request
   *
   * @return {request} - The suepragent request object
   */
  _buildRequest(method, url) {
    return request(method, url)
      .set(AUTHORIZATION, this._authHeader);
  }

  /**
   * Returns a URL of the API for the given path
   * @param {String} path - The API path to get full URL of
   *
   * @return {String} - The full MySportsFeeds API URL for the given path
   */
  _apiUrl(path) {
    return `${this._baseUrl}${this._leaguePath}${path}`;
  }

  /**
   * Gets gets full schedule information
   * See [API Docs]{@link https://www.mysportsfeeds.com/data-feeds/api-docs/}
   * for more information
   * @async
   * @param {Object} [options] - The request options
   * @prop {String} [seasonName] - The season to specify ("current")
   *
   * @return {Object} - The result of the request
   */
  async fullGameSchedule(options = {}) {
    const seasonName = options.seasonName || CURRENT;
    const fullGameScheduleUrl = this._apiUrl(`/${seasonName}/full_game_schedule.json`);
    let res;
    try {
      res = await request
        .get(fullGameScheduleUrl)
        .set(AUTHORIZATION, this._authHeader);
    } catch (err) {
      console.error(err);
      return null;
    }
    return res;
  }

  /**
   * Gets daily game schedule information.
   * See [API Docs]{@link https://www.mysportsfeeds.com/data-feeds/api-docs/}
   * for more information
   * @param {Object} [options] - The request options
   * @prop {String} [seasonName] - The season to specify ("current")
   *
   * @return {Object} - The result of the request
   */
  async dailyGameSchedule(options = {}) {
    const seasonName = options.seasonName || CURRENT;
    const forDate = options.forDate || moment().format('YYYYMMDD');
    const dailyGameScheduleUrl = this._apiUrl(`${seasonName}/daily_game_schedule.json?forDate=${forDate}`);
    let res;
    try {
      res = await request
        .get(dailyGameScheduleUrl)
        .set(AUTHORIZATION, this._authHeader);
    } catch (err) {
      console.error(err);
      return null;
    }
    return res;
  }
}

/**
 * Private method to generate the MySportsFeed specific API header used for
 * authenticating requests. See the "Authentication" section on
 * {@link https://www.mysportsfeeds.com/data-feeds/api-docs/} for more
 * information.
 * @param {String} apiKey - The MSF API key
 * @param {String} password - The MSF password
 *
 * @return {String} - The "Authorization" header to use for MSF API requests
 */
function _generateAuthHeader(apiKey, password) {
  const basicAuthString = `${apiKey}:${password}`;
  const buffer = new Buffer(basicAuthString);
  const base64AuthString = buffer.toString(BASE64);
  return `Basic ${base64AuthString}`;
}


module.exports = ApiBase;
