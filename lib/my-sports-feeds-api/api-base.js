'use strict';

const querystring = require('querystring');
const request = require('superagent');
const precond = require('precond');
const moment = require('moment');

const BASE64 = 'base64';
const CURRENT = 'current';
const AUTHORIZATION = 'Authorization';
const GET = 'GET';
const API_VERSION = 'v2.1';

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
    this._baseUrl = `https://api.mysportsfeeds.com/${API_VERSION}/pull`;
    this._leaguePath = '';
  }

  /**
   * Builds a request with the specified method and url, adding the auth
   * header required for the MySportsFeeds API
   * @private
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
   * @private
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
   * @prop {String} [season] - The season to specify ("current")
   *
   * @return {Object} - The result of the request
   */
  async seasonGames(options = {}) {
    const seasonName = options.seasonName || CURRENT;
    delete options.seasonName;

    let path = `/${seasonName}/games.json`;
    if (Object.keys(options).length !== 0) {
      path += `?${querystring.stringify(options)}`;
    }

    const seasonGamesUrl = this._apiUrl(path);
    let res;
    try {
      res = await this._buildRequest(GET, seasonGamesUrl);
    } catch (err) {
      console.error(err);
      return null;
    }
    return res.body;
  }

  /**
   * Gets daily game schedule information.
   * See [API Docs]{@link https://www.mysportsfeeds.com/data-feeds/api-docs/}
   * for more information
   * @param {Object} [options] - The request options
   * @prop {String} [season] - The season to specify ("current")
   *
   * @return {Object} - The result of the request
   */
  async dailyGames(options = {}) {
    const season = options.season || CURRENT;
    delete options.season;

    const date = options.date || moment().format('YYYYMMDD');
    delete options.date;

    let path = `/${season}/date/${date}/games.json`;
    if (Object.keys(options).length !== 0) {
      path += `?${querystring.stringify(options)}`;
    }
    const dailyGamesUrl = this._apiUrl(path);
    let res;
    try {
      res = await this._buildRequest(GET, dailyGamesUrl);
    } catch (err) {
      console.error(err);
      return null;
    }
    return res.body;
  }

  /**
   * Gets seasonal player gamelog data.
   * See [API Docs]{@link https://www.mysportsfeeds.com/data-feeds/api-docs/}
   * for more information
   * @param {Object} options - The request options
   * @prop {String} game - The game
   * @prop {String} [seasonName] - The season to specify ("current")
   *
   * @return {Object} - The result of the request
   */
  async seasonalPlayerGamelogs(options = {}) {
    const season = options.season || CURRENT;
    delete options.season;

    precond.checkIsString(options.game, '"options.game" is a required parameter');

    let path = `/${season}/player_gamelogs.json`;
    if (Object.keys(options).length !== 0) {
      path += `?${querystring.stringify(options)}`;
    }
    const seasonalPlayerGamelogsUrl = this._apiUrl(path);
    let res;
    try {
      res = await this._buildRequest(GET, seasonalPlayerGamelogsUrl);
    } catch (err) {
      console.error(err);
      return null;
    }
    return res.body;
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
