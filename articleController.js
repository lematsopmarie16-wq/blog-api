const articleModel = require('../models/articleModel');

async function getAll(req, res) {
  try {
    const articles = await articleModel.getAllArticles();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getOne(req, res) {
  try {
    const article = await articleModel.getArticleById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const { title, content, author, category, tags } = req.body;
    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required' });
    }
    const date = new Date().toISOString().split('T')[0];
    const newArticle = await articleModel.createArticle({ title, content, author, date, category, tags });
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const { title, content, category, tags } = req.body;
    const updated = await articleModel.updateArticle(req.params.id, { title, content, category, tags });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    await articleModel.deleteArticle(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function search(req, res) {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Query parameter is required' });
    const articles = await articleModel.searchArticles(query);
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAll, getOne, create, update, remove, search };