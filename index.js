'use strict';

require('dotenv').config();

const MySportsFeedsApi = require('./lib/my-sports-feeds-api');

const config = require('./lib/config').newInstance();

(async () => {
  const mlbApi = new MySportsFeedsApi.MLB(config.mySportsFeeds);
  const res = await mlbApi.fullGameSchedule();
  console.log(res);
})();
