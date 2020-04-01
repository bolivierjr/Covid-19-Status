'use_strict';

import format from 'date-fns/format';
import isValid from 'date-fns/isValid';
import Papa from 'papaparse';
import axios from 'axios';
// import AxiosResponse fro 'axios'
/**
 * Store the results into the database.
 * @TODO Finish this function
 * @param {Object<string, string[]>} data
 *        The regional area results seperated by county.
 * @returns {void}
 */
async function storeData(data) {
  // womp womp
}

/**
 * Fetch the data with axios.
 * @param {string} url
 *        The url to fetch data from.
 * @returns Promise<AxiosResponse>
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
 * @returns {Promise<string[]>}
 *          The regional area results seperated by county.
 */
async function filterRegions(csvUrl) {
  let reports = [];
  const csvResponse = await fetch(csvUrl);

  if (csvResponse.status === 200) {
    const csvData = csvResponse.data;
    const results = Papa.parse(csvData).data;

    // Parishes of Orleans, Tangipahoa, St. Tammany, Jefferson,
    // West Baton Rouge, and East Baton Rouge
    const regionsFPIS = ['22071', '22103', '22105', '22121', '22033'];

    reports = results.filter(region => {
      const [FPIS] = region;
      return regionsFPIS.includes(FPIS);
    });
  }

  return reports;
}

async function fetchUpdatedData(reports) {
  let data = [];
  const today = format(new Date(), 'MM-dd-yyyy');
  const todaysData = reports.filter(report => report.name === `${today}.csv`);

  if (Array.isArray(todaysData) && todaysData.length) {
    const [todaysCsv] = todaysData;
    data = await filterRegions(todaysCsv.download_url);
  }

  return data;
}

async function fetchAllData(reports) {
  let data = [];

  // eslint-disable-next-line arrow-body-style
  const allReports = reports.filter(report => {
    // Find all reports that match a dated csv file (i.e. 03-26-2020.csv)
    // and newer than 03-21-2020 (That's when they started listing by counties)
    return report.name.slice(0, -4) > '03-21-2020' && isValid(new Date(report.name.slice(0, -4)));
  });

  if (Array.isArray(allReports) && allReports.length) {
    const tasks = allReports.map(csvInfo => filterRegions(csvInfo.download_url));
    const results = await Promise.allSettled(tasks);

    results.forEach(result => {
      const { value } = result;
      data = [...data, ...value];
    });
  }

  return data;
}

/**
 * Gathers the selected data from the CSSEGISandData reports.
 * @returns {Promise<Object<string, string[]>}
 *          The regional area results seperated by county.
 */
async function getData(fetchAll) {
  let data = [];

  try {
    const reportsUrl = `https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_daily_reports`;
    const reportsResponse = await fetch(reportsUrl);

    if (reportsResponse.status === 200) {
      const reports = reportsResponse.data;

      if (fetchAll === '--fetchAll') {
        data = await fetchAllData(reports);
      } else {
        data = await fetchUpdatedData(reports);
      }
    }
  } catch (error) {
    console.log(error);
  }

  return data;
}

const [arg] = process.argv.slice(2);
if (arg && arg !== '--fetchAll') {
  console.log('Incorrect argument. Optional Args: --fetchAll');
  process.exit(1);
}

getData(arg).then(data => {
  console.log(data);
  storeData(data);
});

export default getData;
