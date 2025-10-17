const express = require('express');
const router = express.Router();
const manhwaApi = require('../services/manhwaApi');

router.get('/', async (req, res) => {
  try {
    const recommendations = require('../apiResponse/v1_manhwa-recommendation.json');
    const newManhwa = require('../apiResponse/v1_manhwa-new.json');
    const popularManhwa = require('../apiResponse/v1_manhwa-popular.json');
    const topManhwa = require('../apiResponse/v1_manhwa-top.json');

    res.render('manhwa/index', {
      title: 'Manhwa - ANIMAQU',
      description: 'Baca manhwa, manhua, dan manga subtitle Indonesia',
      recommendations: recommendations?.data || [],
      newManhwa: newManhwa?.data || [],
      popularManhwa: popularManhwa?.data || [],
      topManhwa: topManhwa?.data || [],
      currentPage: 'manhwa'
    });
  } catch (error) {
    console.error('Manhwa home page error:', error);
    res.status(500).render('error', {
      title: 'Terjadi Kesalahan - ANIMAQU',
      error: {
        status: 500,
        message: 'Tidak dapat memuat halaman manhwa'
      }
    });
  }
});

router.get('/detail/:manhwaId', async (req, res) => {
  try {
    const manhwaId = req.params.manhwaId;
    const manhwaData = require('../apiResponse/v1_manhwa-detail.json');

    res.render('manhwa/detail', {
      title: `${manhwaData?.data.title || 'Detail Manhwa'} - ANIMAQU`,
      description: `Baca manhwa ${manhwaData?.data.title || ''} subtitle Indonesia`,
      manhwa: manhwaData?.data,
      currentPage: 'manhwa'
    });
  } catch (error) {
    console.error('Manhwa detail page error:', error);
    res.status(500).render('error', {
      title: 'Terjadi Kesalahan - ANIMAQU',
      error: {
        status: 500,
        message: 'Tidak dapat memuat detail manhwa'
      }
    });
  }
});

router.get('/chapter/:chapterId', async (req, res) => {
  try {
    const chapterId = req.params.chapterId;
    const chapterData = require('../apiResponse/v1_chapter.json');

    res.render('manhwa/reader', {
      title: `${chapterData?.data.title || 'Baca Chapter'} - ANIMAQU`,
      description: `Baca chapter ${chapterData?.data.title || ''} subtitle Indonesia`,
      chapter: chapterData?.data,
      currentPage: 'manhwa'
    });
  } catch (error) {
    console.error('Manhwa reader page error:', error);
    res.status(500).render('error', {
      title: 'Terjadi Kesalahan - ANIMAQU',
      error: {
        status: 500,
        message: 'Tidak dapat memuat chapter'
      }
    });
  }
});

router.get('/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    let searchResults = null;

    if (query) {
      searchResults = await manhwaApi.searchManhwa(query);
    }

    res.render('manhwa/search', {
      title: `Pencarian: ${query} - ANIMAQU`,
      description: `Hasil pencarian untuk ${query}`,
      query,
      results: searchResults?.data || [],
      currentPage: 'manhwa'
    });
  } catch (error) {
    console.error('Manhwa search page error:', error);
    res.status(500).render('error', {
      title: 'Terjadi Kesalahan - ANIMAQU',
      error: {
        status: 500,
        message: 'Tidak dapat melakukan pencarian manhwa'
      }
    });
  }
});

router.get('/genres', async (req, res) => {
  try {
    const genresData = await manhwaApi.getGenres();

    res.render('manhwa/genres', {
      title: 'Genre Manhwa - ANIMAQU',
      description: 'Jelajahi manhwa berdasarkan genre',
      genres: genresData?.data || [],
      currentPage: 'manhwa'
    });
  } catch (error) {
    console.error('Manhwa genres page error:', error);
    res.status(500).render('error', {
      title: 'Terjadi Kesalahan - ANIMAQU',
      error: {
        status: 500,
        message: 'Tidak dapat memuat daftar genre'
      }
    });
  }
});

router.get('/genre/:genreId', async (req, res) => {
  try {
    const genreId = req.params.genreId;
    const genreData = await manhwaApi.getManhwaByGenre(genreId);

    res.render('manhwa/genre-detail', {
      title: `Genre: ${genreData?.data.name || genreId} - ANIMAQU`,
      description: `Daftar manhwa dengan genre ${genreData?.data.name || ''}`,
      genre: genreData?.data,
      currentPage: 'manhwa'
    });
  } catch (error) {
    console.error('Manhwa genre detail page error:', error);
    res.status(500).render('error', {
      title: 'Terjadi Kesalahan - ANIMAQU',
      error: {
        status: 500,
        message: 'Tidak dapat memuat data genre'
      }
    });
  }
});

module.exports = router;