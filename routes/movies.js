const express = require('express');
const router = express.Router();
const animeApi = require('../services/animeApi');

router.get('/', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const moviesData = await animeApi.getMovieList(page);
    console.log(moviesData);

    res.render('movie-list', {
      title: 'Anime Movies - ANIMAQU',
      description: 'Daftar film anime subtitle Indonesia',
      animeList: moviesData.animeList,
      pagination: moviesData.pagination,
      currentPage: 'movies'
    });
  } catch (error) {
    console.error('Movie list page error:', error.message);
    console.error('Error details:', error);
    res.status(500).render('error', {
      title: 'Terjadi Kesalahan - ANIMAQU',
      error: {
        status: 500,
        message: 'Tidak dapat memuat daftar film anime'
      }
    });
  }
});

router.get('/:year/:month/:slug', async (req, res) => {
  try {
    const { year, month, slug } = req.params;

    const movieData = await animeApi.getMovieDetails(year, month, slug);
    var movie = movieData.data.stream_url;
    movie = movie.split('/')[3];
    //https://www.mp4upload.com/embed-iwzh09efokfj.html
    movie = `https://www.mp4upload.com/embed-${movie}.html`;

    movieData.data.stream_url = movie;
    res.render('movie-player', {
      title: `${movieData?.data.title || slug} - ANIMAQU`,
      description: `Film anime ${movieData?.data.title || slug}`,
      anime: movieData.data,
      stream: movieData.data.stream_url,
      currentPage: 'movies'
    });
  } catch (error) {
    console.error('Movie detail page error:', error);
    res.render('error', {
      title: 'Terjadi Kesalahan - ANIMAQU',
      error: {
        status: 500,
        message: 'Tidak dapat memuat data film anime'
      }
    });
  }
});

module.exports = router;