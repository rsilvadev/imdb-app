import { API_URL } from './constants';
import { getQueryParams } from './functions';

var ApiUtils = {
  checkStatus: function(response) {
    if (response.ok) {
      return response;
    }

    return response.json().then((data) => {
      let message = data.error.message || response.statusText;
      throw new Error(message);
    });
  }
};

class Services {
  static async makeRequest(url, method = 'GET', body = null) {
    const headers = {
      'Accept': 'application/json'
    };

    const parameters = { method, headers };

    if (body !== null) {
      parameters.body = body;
    }

    const fetchUrl = fetch(url, parameters);

    return fetchUrl
      .then(ApiUtils.checkStatus)
      .then((response) => {
        return response.json();
      });
  }

  static async getMovies(url=null, params) {
    if(!url) {
      url = `${API_URL}movies/${getQueryParams(params)}`;
    }

    return this.makeRequest(url);
  }

  static async getMovieDetail(id) {
    return this.makeRequest(
      `${API_URL}movies/${id}/`
    );
  }
}

export default Services;

export const handleFailedRequest = (error) => {
  console.log(error);
  
  return
}