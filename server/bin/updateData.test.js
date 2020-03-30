const axios = require('axios');
const MockDate = require('mockdate');
const { getData } = require('./updateData');

jest.mock('axios');

afterAll(() => {
  MockDate.reset(); // Reset the Date back to default
});

test('getData returns the formatted data to put into the db', async () => {
  const mockReportsData = {
    status: 200,
    data: [
      {
        name: '03-26-2020.csv',
        download_url:
          'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/03-26-2020.csv',
      },
    ],
  };

  const mockCsvData = {
    status: 200,
    data: `22071,Orleans,Louisiana,US,2020-03-26 23:48:35,30.06971951,-89.92660315,997,46,0,0,"Orleans, Louisiana, US"\n`,
  };

  const getDataExpected = {
    nolaResults: [
      '22071',
      'Orleans',
      'Louisiana',
      'US',
      '2020-03-26 23:48:35',
      '30.06971951',
      '-89.92660315',
      '997',
      '46',
      '0',
      '0',
      'Orleans, Louisiana, US',
    ],
  };

  // Mock for Date to keep it the same day
  MockDate.set('03/26/2020');
  // Mock for axios's get function
  axios.get
    .mockImplementationOnce(() => Promise.resolve(mockReportsData))
    .mockImplementationOnce(() => Promise.resolve(mockCsvData));

  const data = await getData();

  expect(data).toStrictEqual(getDataExpected);
});
