const express = require('express');
const router = express.Router();
const animeApi = require('../services/animeApi');

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const comicData = await animeApi.getComicList(page);
        res.render('comic', {
            title: 'Daftar Komik',
            description: 'Daftar komik terbaru dengan subtitle Indonesia',
            comics: comicData || [],
            pagination: comicData.pagination || { current_page: page, last_visible_page: 1 },
            currentPage: 'comic'
        });
    } catch (error) {
        console.error('Comic list page error:', error);
        res.render('error', {
            title: 'Terjadi Kesalahan',
            error: {
                status: 500,
                message: 'Tidak dapat memuat data komik'
            }
        });
    }
});

router.get('/list', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const comicData = await animeApi.getComicList(page);
        res.render('comic-list', {
            title: 'Daftar Komik',
            description: 'Daftar komik terbaru dengan subtitle Indonesia',
            comics: comicData || [],
            pagination: comicData.pagination || { current_page: page, last_visible_page: 1 },
            currentPage: 'comic'
        });
    } catch (error) {
        console.error('Comic list page error:', error);
        res.render('error', {
            title: 'Terjadi Kesalahan',
            error: {
                status: 500,
                message: 'Tidak dapat memuat data komik'
            }
        });
    }
});

router.get('/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
        const comicDetail = await animeApi.getComicDetail(slug);
        res.render('comic-detail', {
            title: comicDetail.title,
            description: `Baca komik ${comicDetail.title} subtitle Indonesia`,
            comic: comicDetail,
            currentPage: 'comic'
        });
    } catch (error) {
        console.error('Comic detail page error:', error);
        res.render('error', {
            title: 'Terjadi Kesalahan',
            error: {
                status: 500,
                message: 'Tidak dapat memuat detail komik'
            }
        });
    }
});

module.exports = router;