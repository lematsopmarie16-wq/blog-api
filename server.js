const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARES ====================
app.use(cors());
app.use(express.json()); // Pour parser le JSON
app.use(express.urlencoded({ extended: true })); // Pour les formulaires
app.use(morgan('dev')); // Logging des requêtes

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, )));

// ==================== BASE DE DONNÉES SQLITE ====================
let db;

// Connexion à SQLite
async function connectDB() {
    try {
        db = await open({
            filename: process.env.DB_PATH || './blog.db',
            driver: sqlite3.Database
        });
        
        console.log('✅ Connecté à SQLite');
        
        // Créer la table si elle n'existe pas
        await db.exec(`
            CREATE TABLE IF NOT EXISTS articles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                author VARCHAR(100) NOT NULL,
                date DATE NOT NULL,
                category VARCHAR(100) NOT NULL,
                tags TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE INDEX IF NOT EXISTS idx_category ON articles(category);
            CREATE INDEX IF NOT EXISTS idx_author ON articles(author);
            CREATE INDEX IF NOT EXISTS idx_date ON articles(date);
        `);
        
        console.log('✅ Table "articles" et index créés');
        
        // Ajouter quelques articles de démo si la table est vide
        const count = await db.get('SELECT COUNT(*) as count FROM articles');
        if (count.count === 0) {
            await db.run(`
                INSERT INTO articles (title, content, author, date, category, tags) VALUES 
                ('Bienvenue sur mon blog', 'Ceci est mon premier article. Bienvenue à tous !', 'Admin', '2026-03-23', 'Blog', '["bienvenue", "premier"]'),
                ('Découvrir Node.js', 'Node.js est une plateforme qui permet d''exécuter JavaScript côté serveur.', 'Jean Dupont', '2026-03-22', 'Technologie', '["nodejs", "javascript"]'),
                ('Les bases de SQLite', 'SQLite est une base de données légère et facile à utiliser.', 'Marie Martin', '2026-03-21', 'Développement', '["sqlite", "base de données"]')
            `);
            console.log('✅ Articles de démo ajoutés');
        }
        
    } catch (error) {
        console.error('❌ Erreur connexion SQLite:', error.message);
        process.exit(1);
    }
}

// ==================== ROUTES DE L'API ====================

// Route d'accueil - Redirige vers le frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 1. CRÉER UN ARTICLE - POST /api/articles
app.post('/api/articles', async (req, res) => {
    try {
        console.log('📝 Création article - Données reçues:', req.body);
        
        const { title, content, author, date, category, tags } = req.body;
        
        // Validation basique
        if (!title || !content || !author || !date || !category) {
            return res.status(400).json({ 
                error: 'Champs manquants: title, content, author, date, category sont requis' 
            });
        }
        
        // Convertir le tableau tags en chaîne JSON
        const tagsString = tags && tags.length > 0 ? JSON.stringify(tags) : '[]';
        
        // Insérer dans la base de données
        const result = await db.run(
            `INSERT INTO articles (title, content, author, date, category, tags) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [title, content, author, date, category, tagsString]
        );
        
        res.status(201).json({
            message: 'Article créé avec succès',
            id: result.lastID
        });
        
    } catch (error) {
        console.error('❌ Erreur création article:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

// 2. LIRE TOUS LES ARTICLES - GET /api/articles
app.get('/api/articles', async (req, res) => {
    try {
        const { category, author } = req.query;
        
        let sql = 'SELECT * FROM articles WHERE 1=1';
        let params = [];
        
        // Ajouter les filtres si présents
        if (category && category !== '') {
            sql += ' AND category = ?';
            params.push(category);
        }
        if (author && author !== '') {
            sql += ' AND author LIKE ?';
            params.push(`%${author}%`);
        }
        
        sql += ' ORDER BY date DESC';
        
        const articles = await db.all(sql, params);
        
        // Transformer les tags JSON pour chaque article
        const articlesFormatted = articles.map(article => ({
            ...article,
            tags: article.tags ? JSON.parse(article.tags) : []
        }));
        
        res.status(200).json(articlesFormatted);
        
    } catch (error) {
        console.error('❌ Erreur lecture articles:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

// 3. LIRE UN ARTICLE PAR ID - GET /api/articles/:id
app.get('/api/articles/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID invalide' });
        }
        
        const article = await db.get(
            'SELECT * FROM articles WHERE id = ?',
            [id]
        );
        
        if (!article) {
            return res.status(404).json({ error: 'Article non trouvé' });
        }
        
        article.tags = article.tags ? JSON.parse(article.tags) : [];
        
        res.status(200).json(article);
        
    } catch (error) {
        console.error('❌ Erreur lecture article:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

// 4. MODIFIER UN ARTICLE - PUT /api/articles/:id
app.put('/api/articles/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID invalide' });
        }
        
        const { title, content, author, date, category, tags } = req.body;
        
        // Vérifier si l'article existe
        const existing = await db.get(
            'SELECT * FROM articles WHERE id = ?',
            [id]
        );
        
        if (!existing) {
            return res.status(404).json({ error: 'Article non trouvé' });
        }
        
        // Construire la requête de mise à jour dynamiquement
        let updates = [];
        let params = [];
        
        if (title !== undefined) {
            updates.push('title = ?');
            params.push(title);
        }
        if (content !== undefined) {
            updates.push('content = ?');
            params.push(content);
        }
        if (author !== undefined) {
            updates.push('author = ?');
            params.push(author);
        }
        if (date !== undefined) {
            updates.push('date = ?');
            params.push(date);
        }
        if (category !== undefined) {
            updates.push('category = ?');
            params.push(category);
        }
        if (tags !== undefined) {
            updates.push('tags = ?');
            params.push(JSON.stringify(tags));
        }
        
        if (updates.length === 0) {
            return res.status(400).json({ error: 'Aucune donnée à modifier' });
        }
        
        params.push(id);
        await db.run(
            `UPDATE articles SET ${updates.join(', ')} WHERE id = ?`,
            params
        );
        
        res.status(200).json({ message: 'Article modifié avec succès' });
        
    } catch (error) {
        console.error('❌ Erreur modification article:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

// 5. SUPPRIMER UN ARTICLE - DELETE /api/articles/:id
app.delete('/api/articles/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID invalide' });
        }
        
        const result = await db.run(
            'DELETE FROM articles WHERE id = ?',
            [id]
        );
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Article non trouvé' });
        }
        
        res.status(200).json({ message: 'Article supprimé avec succès' });
        
    } catch (error) {
        console.error('❌ Erreur suppression article:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

// 6. RECHERCHER DES ARTICLES - GET /api/articles/search?query=texte
app.get('/api/articles/search', async (req, res) => {
    try {
        const query = req.query.query;
        
        if (!query || query.trim() === '') {
            return res.status(400).json({ error: 'Le paramètre query est requis' });
        }
        
        const articles = await db.all(
            `SELECT * FROM articles 
             WHERE title LIKE ? OR content LIKE ? OR author LIKE ? OR category LIKE ?
             ORDER BY date DESC`,
            [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
        );
        
        const articlesFormatted = articles.map(article => ({
            ...article,
            tags: article.tags ? JSON.parse(article.tags) : []
        }));
        
        res.status(200).json(articlesFormatted);
        
    } catch (error) {
        console.error('❌ Erreur recherche:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

// 7. ROUTE POUR RÉCUPÉRER LES STATISTIQUES - GET /api/stats
app.get('/api/stats', async (req, res) => {
    try {
        const total = await db.get('SELECT COUNT(*) as total FROM articles');
        const categories = await db.all(
            'SELECT category, COUNT(*) as count FROM articles GROUP BY category ORDER BY count DESC'
        );
        const authors = await db.all(
            'SELECT author, COUNT(*) as count FROM articles GROUP BY author ORDER BY count DESC LIMIT 5'
        );
        
        res.status(200).json({
            total: total.total,
            categories,
            authors
        });
    } catch (error) {
        console.error('❌ Erreur stats:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

// ==================== MIDDLEWARE D'ERREUR GLOBAL ====================
app.use((err, req, res, next) => {
    console.error('❌ Erreur non capturée:', err);
    
    if (err.code === 'SQLITE_CONSTRAINT') {
        return res.status(409).json({ error: 'Violation de contrainte SQLite' });
    }
    
    res.status(500).json({ 
        error: process.env.NODE_ENV === 'production' 
            ? 'Erreur interne du serveur' 
            : err.message 
    });
});

// ==================== GESTION DE L'ARRÊT PROPRE ====================
process.on('SIGINT', async () => {
    console.log('\n🛑 Arrêt du serveur...');
    if (db) {
        await db.close();
        console.log('✅ Connexion SQLite fermée');
    }
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Arrêt du serveur...');
    if (db) {
        await db.close();
        console.log('✅ Connexion SQLite fermée');
    }
    process.exit(0);
});

// ==================== DÉMARRAGE DU SERVEUR ====================
async function start() {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`
╔══════════════════════════════════════════════════════════╗
║                    🚀 SERVEUR DÉMARRÉ                     ║
╠══════════════════════════════════════════════════════════╣
║  📍 Frontend: http://localhost:${PORT}                    ║
║  🔌 API: http://localhost:${PORT}/api/articles            ║
║  💾 Base de données: SQLite (${process.env.DB_PATH || './blog.db'}) ║
║  ✅ Statut: Prêt à recevoir les requêtes                  ║
╚══════════════════════════════════════════════════════════╝
        `);
    });
}

// Lancer l'application
start();
