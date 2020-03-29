const axios = require('axios');
const update = require('./updateData');

jest.mock('axios');

afterEach(() => {
  axios.mockClear();
});

test('testing getData... ahhhhhhh HAAALLP', async () => {
  const baseUrl = 'https://raw.githubusercontent.com';
  const cvsLink = `${baseUrl}/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/03-26-2020.csv`;

  const mockDataResponse = {
    statusText: 'OK',
    data: [
      {
        name: '03-26-2020.csv',
        download_url: cvsLink,
      },
    ],
  };

  const mockCsvData = `
    22103,St. Tammany,Louisiana,US,2020-03-28 23:05:37,30.40942847,-89.95642711,134,2,0,0,"St. Tammany, Louisiana, US"
  `;

  axios.get.mockResolvedValueOnce(mockDataResponse);

  const data = await update.getData();
  expect(data).toBe(1);
});
