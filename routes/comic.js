const express = require('express');
const router = express.Router();
const axios = require('axios');

const BASE_URL = 'https://www.sankavollerei.com/comic';

// For now, just render the comic page
router.get('/', (req, res) => {
  res.render('comic', { title: 'Comic - ANIMAQU', currentPage: 'comic' });
});

router.get('/search', (req, res) => {
  const { q } = req.query;
  res.render('comic/search', { title: 'Search Comic - ANIMAQU', keyword: q, currentPage: 'comic' });
});

router.get('/detail/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const response = await axios.get(`${BASE_URL}/kiryuu/manga/${slug}`);
    if (response.data.success) {
      res.render('comic/detail', {
        title: `${response.data.title} - ANIMAQU`,
        currentPage: 'comic',
        comic: response.data
      });
    } else {
      res.status(404).render('404', { title: 'Not Found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).render('500', { title: 'Server Error' });
  }
});

router.get('/chapter/:slug', (req, res) => {
    const { slug } = req.params;
    res.render('comic/reader', { title: 'Comic Reader - ANIMAQU', currentPage: 'comic', chapterSlug: slug });
});

module.exports = router;
