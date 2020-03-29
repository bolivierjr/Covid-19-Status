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
 * Fetch the data with axios.
 * @param {string} url
 *        The url to fetch data from.
 * @returns {Array} Response
 */
async function fetch(url) {
  const response = await axios.get(url, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  });

  return response;
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
  const regions = {};
  const csvResponse = await fetch(csvUrl);

  if (csvResponse.status === 200) {
    const csvData = csvResponse.data;
    const results = Papa.parse(csvData).data;

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
  }

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
    const reportsResponse = await fetch(reportsUrl);

    if (reportsResponse.status === 200) {
      const reports = reportsResponse.data;
      const today = format(new Date(), 'MM-dd-yyyy');
      const todaysData = reports.filter(report => report.name === `03-25-2020.csv`); // Usually has `${today}.csv`

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
  console.log(data);
  storeData(data);
});
