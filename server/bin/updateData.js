'use_strict';

const format = require('date-fns/format');
const Papa = require('papaparse');
const axios = require('axios');

/**
 * Store the results into the database.
 * @todo Finish this function
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
 * @param {string} csvData
 *        The csv data received by CSSEGISandData.
 * @returns {Object<string, Array<string>}
 *          The regional area results seperated by county.
 */
async function filterRegions(csvData) {
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
    const reportsUrl = `
      https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_daily_reports
    `;

    const reportsResponse = await axios.get(reportsUrl, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });

    if (reportsResponse.statusText === 'OK') {
      const today = format(new Date(), 'MM-dd-yyyy');
      const reports = await reportsResponse.data;
      const todaysData = reports.filter(report => report.name === `03-27-2020.csv`);

      if (Array.isArray(todaysData) && todaysData.length) {
        const [todaysCsv] = todaysData;
        const csvResponse = await axios.get(todaysCsv.download_url);
        const csvData = await csvResponse.data;
        data = await filterRegions(csvData);
      }
    }
  } catch (error) {
    console.log(error);
  }

  return data;
}

getData().then(data => {
  console.log(data);
  storeData(data);
});

module.exports = {
  filterRegions,
  getData,
};
