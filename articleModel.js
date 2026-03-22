const { getDb } = require('../database/db');

function getAllArticles() {
  const db = getDb();
  return db.prepare('SELECT * FROM articles ORDER BY date DESC').all();
}

function getArticleById(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
}

function createArticle(article) {
  const db = getDb();
  const { title, content, author, date, category, tags } = article;
  const stmt = db.prepare(
    'INSERT INTO articles (title, content, author, date, category, tags) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const result = stmt.run(title, content, author, date, category, tags);
  return { id: result.lastInsertRowid };
}

function updateArticle(id, updates) {
  const db = getDb();
  const { title, content, category, tags } = updates;
  const stmt = db.prepare(
    'UPDATE articles SET title = ?, content = ?, category = ?, tags = ? WHERE id = ?'
  );
  stmt.run(title, content, category, tags, id);
  return { id };
}

function deleteArticle(id) {
  const db = getDb();
  const stmt = db.prepare('DELETE FROM articles WHERE id = ?');
  stmt.run(id);
  return { id };
}

function searchArticles(query) {
  const db = getDb();
  const stmt = db.prepare(
    'SELECT * FROM articles WHERE title LIKE ? OR content LIKE ? ORDER BY date DESC'
  );
  return stmt.all(`%${query}%`, `%${query}%`);
}

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  searchArticles
};