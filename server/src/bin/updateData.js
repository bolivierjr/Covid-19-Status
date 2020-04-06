'use_strict';

import format from 'date-fns/format';
import isValid from 'date-fns/isValid';
import Papa from 'papaparse';
import axios, { AxiosResponse } from 'axios';
import mongoose from 'mongoose';
import config from '../config';
import ReportModel from '../models/report';
import Logger from '../loaders/logger';

/**
 * Store the results into the database.
 *
 * @param {object} data
 *        The regional area results seperated by county.
 * @returns {void}
 */
async function storeData(data) {
  try {
    mongoose.connect(config.dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    Logger.info('src.bin.updateData.storeData.saving.to.db');

    data.forEach(async report => {
      const [
        fpis,
        admin2,
        provinceState,
        countryRegion,
        lastUpdate,
        lat,
        long,
        confirmed,
        deaths,
        recovered,
        active,
        combinedKey,
      ] = report;

      const reportModel = new ReportModel({
        fpis: parseInt(fpis, 10),
        admin2,
        provinceState,
        countryRegion,
        lastUpdate: new Date(lastUpdate),
        lat: parseInt(lat, 10),
        long: parseInt(long, 10),
        confirmed: parseInt(confirmed, 10),
        deaths: parseInt(deaths, 10),
        recovered: parseInt(recovered, 10),
        active: parseInt(active, 10),
        combinedKey,
      });

      await reportModel.save();
      Logger.info('src.bin.updateData.storeData.successful.save.to.db');
    });
  } catch (err) {
    Logger.error(`src.bin.updateData.storeData.mongoose.failed: ${err}`);
  } finally {
    mongoose.connection.close();
  }
}

/**
 * Fetch the github repo data with axios.
 *
 * @param {string} url The url to fetch data from.
 * @returns {AxiosResponse}
 *          Response back from the http request.
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
 *
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

/**
 * Fetch the data from github's API and filter out by region
 * for today's results.
 *
 * @param {object[]} reports
 *        Data received back from github's API with all the files in a repo.
 * @returns {Promise<object[]>}
 *        The filtered data for today's update.
 */
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

/**
 * Fetch all the data from github's API and filter out by region
 * for results since 03-21-2020.
 *
 * @param {object[]} reports
 *        Data received back from github's API with all the files in a repo.
 * @returns {Promise<object[]>}
 *        The filtered data for today's update.
 */
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
 *
 * @param {string} fetchAll
 *        The node cli argument given to run this function.
 * @returns {Promise<object[]>}
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
    Logger.error(error);
  }

  return data;
}

export default { getData, storeData };
