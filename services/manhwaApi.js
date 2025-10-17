const axios = require('axios');

class ManhwaApiService {
  constructor() {
    this.baseUrl = 'https://mnhwa-api.vercel.app/api';
  }

  async makeRequest(endpoint, params = {}) {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      console.log(`Making Manhwa API request to: ${url}`);

      const response = await axios.get(url, {
        params,
        timeout: 15000,
        headers: {
          'User-Agent': 'ANIMAQU/1.0'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Manhwa API request failed for ${endpoint}:`, error.message);
      return null;
    }
  }

  async getNewManhwa() {
    return await this.makeRequest('/manhwa-new');
  }

  async getPopularManhwa() {
    return await this.makeRequest('/manhwa-popular');
  }

  async getTopManhwa() {
    return await this.makeRequest('/manhwa-top');
  }

  async getOngoingManhwa() {
    return await this.makeRequest('/manhwa-ongoing');
  }

  async getRecommendation() {
    return await this.makeRequest('/manhwa-recommendation');
  }

  async getManhwaDetail(manhwaId) {
    return await this.makeRequest(`/manhwa-detail/${manhwaId}`);
  }

  async getChapter(chapterId) {
    return await this.makeRequest(`/chapter/${chapterId}`);
  }

  async getGenres() {
    return await this.makeRequest('/genres');
  }

  async getManhwaByGenre(genreId) {
    return await this.makeRequest(`/genre/${genreId}`);
  }

  async searchManhwa(query) {
    return await this.makeRequest(`/search/${query}`);
  }
}

module.exports = new ManhwaApiService();