'use_strict';

const format = require('date-fns/format');
const Papa = require('papaparse');
const axios = require('axios');

/**
 * Store the results into the database.
 * @TODO Finish this function
 * @param {Object<string, Array<string>} data
 *        The regional area results seperated by county.
 * @returns void
 */
async function storeData(data) {
  // womp womp
}

/**
 * Filter out the results by surrounding counties FPIS numbers
 * and group them by county.
 * @param {string} csvUrl
 *        The csv data url received by CSSEGISandData.
 * @returns {Object<string, Array<string>}
 *          The regional area results seperated by county.
 */
async function filterRegions(csvUrl) {
  const csvResponse = await axios.get(csvUrl);
  const csvData = csvResponse.data;
  const results = Papa.parse(csvData).data;

  const regions = {};

  results.forEach(region => {
    const [FPIS] = region;

    if (FPIS === '22071') {
      regions.nolaResults = region;
    } else if (FPIS === '22103') {
      regions.tammanyResults = region;
    } else if (FPIS === '22051') {
      regions.jeffersonResults = region;
    } else if (FPIS === '22105') {
      regions.tangipahoaResults = region;
    } else if (FPIS === '22121') {
      regions.westBatonRougeResults = region;
    } else if (FPIS === '22033') {
      regions.eastBatonRougeResults = region;
    }
  });

  return regions;
}

/**
 * Gathers the selected the data from the CSSEGISandData reports.
 * @returns {Object<string, Array<string>}
 *          The regional area results seperated by county.
 */
async function getData() {
  let data = {};

  try {
    const reportsUrl = `https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_daily_reports`;

    const reportsResponse = await axios.get(reportsUrl, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });

    if (reportsResponse.statusText === 'OK') {
      const reports = reportsResponse.data;
      const today = format(new Date(), 'MM-dd-yyyy');
      const todaysData = reports.filter(report => report.name === `03-26-2020.csv`); // Usually has `${today}.csv`

      if (Array.isArray(todaysData) && todaysData.length) {
        const [todaysCsv] = todaysData;
        data = await filterRegions(todaysCsv.download_url);
      }
    }
  } catch (error) {
    console.log(error);
  }

  return data;
}

getData().then(data => {
  storeData(data);
});

module.exports = {
  filterRegions,
  getData,
};
