export const getQueryParams = (obj) => {
  return `?${Object.entries(obj)
    .filter(item => ![null, undefined, ''].includes(item[1]))
    .map(item => item.join('=')).join('&')}`
}

export const getQueryObj = (locationSearch) => {
  let params = {};

  locationSearch.replace('?', '').split('&').forEach(item => {
    let item_split = item.split('=');

    if(item_split[1]) {
      params[item_split[0]] = item_split[1];
    }
  })

  return params;
}
