// Little bit of sugar around the Fetch API
const fetcherFactory = (
  baseUrl = '/',
  urlSuffix = '',
  fetchOptions = {},
) => path =>
  fetch(baseUrl + path + urlSuffix, fetchOptions).then(res => res.json());

export const hnApi = fetcherFactory('https://hacker-news.firebaseio.com/v0/', '.json');
