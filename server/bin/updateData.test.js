const axios = require('axios');
const { getData } = require('./updateData');

jest.mock('axios');
let realDate;

afterAll(() => {
  global.Date = realDate; // Reset the global Date back to default
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

  // Mock for axios's get function
  axios.get
    .mockImplementationOnce(() => Promise.resolve(mockReportsData))
    .mockImplementationOnce(() => Promise.resolve(mockCsvData));

  // Mock hack to make the Date object return 03-26-2020
  realDate = Date;
  global.Date = class extends Date {
    constructor(date) {
      if (date) {
        // eslint-disable-next-line constructor-super
        return super(date);
      }

      return new Date('2020-03-26T11:01:58.135Z');
    }
  };

  const data = await getData();

  expect(data).toStrictEqual(getDataExpected);
});
