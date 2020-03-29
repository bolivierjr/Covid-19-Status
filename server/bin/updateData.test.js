const axios = require('axios');
const getData = require('./updateData');

jest.mock('axios');

afterEach(() => {
  axios.mockReset();
});

test('testing getData... ahhhhhhh HAAALLP', async () => {
  const mockResponse1 = [
    {
      name: '03-25-2020.csv',
      download_url:
        'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/03-25-2020.csv',
    },
  ];

  const mockResponse2 = `22103,St. Tammany,Louisiana,US,2020-03-28 23:05:37,30.40942847,-89.95642711,134,2,0,0,"St. Tammany, Louisiana, US\n"`;

  axios.get
    .mockResolvedValueOnce({ statusText: 'OK', data: mockResponse1 })
    .mockResolvedValueOnce({ data: mockResponse2 });

  const data = await getData.getData();
  expect(data).toBe(1);
});
