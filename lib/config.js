'use strict';

module.exports.newInstance = () => {
  const config = {
    mySportsFeeds: {
      apiKey: process.env.MSF_API_KEY,
      password: process.env.MSF_API_PASSWORD,
    },
  };

  return config;
};
