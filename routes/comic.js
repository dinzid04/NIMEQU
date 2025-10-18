const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('comic', {
    title: 'Comic - ANIMAQU',
    description: 'Baca komik, manga, dan manhwa subtitle Indonesia',
    currentPage: 'comic'
  });
});

module.exports = router;