'use strict';

import axios from 'axios';

// const API_KEY = '32573949-757e2437ffc59d9864e13675e';
// const BASE_URL = 'https://pixabay.com/api/';

export class PixabayApi {
  #API_KEY = '32573949-757e2437ffc59d9864e13675e';
  #BASE_URL = 'https://pixabay.com/api';

  query = null;
  page = 1;
  per_page = 40;

  async fetchPhotos() {
    try {
      const responce = await axios.get(
        `${this.#BASE_URL}/?key=${this.#API_KEY}&q=${
          this.query
        }&image_type=photo&orientation=horizontal&safesearch=true&page=${
          this.page
        }&per_page=${this.per_page}`
      );
      return responce;
    } catch (error) {
      throw new Error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
