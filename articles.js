const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - author
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-généré de l'article
 *           example: 1
 *         title:
 *           type: string
 *           description: Titre de l'article
 *           example: "Mon premier article"
 *         content:
 *           type: string
 *           description: Contenu de l'article
 *           example: "Ceci est le contenu de mon article..."
 *         author:
 *           type: string
 *           description: Nom de l'auteur
 *           example: "Olinga Flamel"
 *         date:
 *           type: string
 *           format: date
 *           description: Date de création
 *           example: "2026-03-22"
 *         category:
 *           type: string
 *           description: Catégorie de l'article
 *           example: "Technologie"
 *         tags:
 *           type: string
 *           description: Tags séparés par des virgules
 *           example: "javascript,nodejs,api"
 *     ArticleInput:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - author
 *       properties:
 *         title:
 *           type: string
 *           description: Titre de l'article
 *           example: "Mon premier article"
 *         content:
 *           type: string
 *           description: Contenu de l'article
 *           example: "Ceci est le contenu de mon article..."
 *         author:
 *           type: string
 *           description: Nom de l'auteur
 *           example: "Olinga Flamel"
 *         category:
 *           type: string
 *           description: Catégorie de l'article
 *           example: "Technologie"
 *         tags:
 *           type: string
 *           description: Tags séparés par des virgules
 *           example: "javascript,nodejs,api"
 */

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Récupérer tous les articles
 *     description: Retourne la liste complète de tous les articles triés par date décroissante
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: Liste des articles récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', articleController.getAll);

/**
 * @swagger
 * /api/articles/search:
 *   get:
 *     summary: Rechercher des articles
 *     description: Recherche les articles dont le titre ou le contenu contient le texte spécifié
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Texte à rechercher dans le titre ou le contenu
 *         example: "javascript"
 *     responses:
 *       200:
 *         description: Résultats de la recherche
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 *       400:
 *         description: Paramètre query manquant
 *       500:
 *         description: Erreur serveur
 */
router.get('/search', articleController.search);

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Récupérer un article par son ID
 *     description: Retourne les détails d'un article spécifique
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'article
 *         example: 1
 *     responses:
 *       200:
 *         description: Détails de l'article
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', articleController.getOne);

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Créer un nouvel article
 *     description: Ajoute un nouvel article dans la base de données
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleInput'
 *           example:
 *             title: "Mon premier article"
 *             content: "Ceci est le contenu de mon premier article sur le blog"
 *             author: "Olinga Flamel"
 *             category: "Technologie"
 *             tags: "javascript,nodejs,api"
 *     responses:
 *       201:
 *         description: Article créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID du nouvel article
 *                   example: 1
 *       400:
 *         description: Données manquantes ou invalides (titre ou auteur requis)
 *       500:
 *         description: Erreur serveur
 */
router.post('/', articleController.create);

/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Modifier un article
 *     description: Met à jour les informations d'un article existant
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'article à modifier
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Nouveau titre
 *                 example: "Mon article modifié"
 *               content:
 *                 type: string
 *                 description: Nouveau contenu
 *                 example: "Ceci est le contenu modifié"
 *               category:
 *                 type: string
 *                 description: Nouvelle catégorie
 *                 example: "Informatique"
 *               tags:
 *                 type: string
 *                 description: Nouveaux tags
 *                 example: "update,express,api"
 *     responses:
 *       200:
 *         description: Article modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID de l'article modifié
 *                   example: 1
 *       404:
 *         description: Article non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', articleController.update);

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Supprimer un article
 *     description: Supprime un article de la base de données
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'article à supprimer
 *         example: 1
 *     responses:
 *       204:
 *         description: Article supprimé avec succès (aucun contenu retourné)
 *       404:
 *         description: Article non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', articleController.remove);

module.exports = router;