const express = require('express');
const { initDb } = require('./database/db');
const articleRoutes = require('./routes/articles');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description: 'API pour gérer un blog simple',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Serveur de développement',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/articles', articleRoutes);

// Route d'accueil
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API Blog', docs: '/api-docs' });
});

// Initialiser la base de données et démarrer le serveur
initDb();

app.listen(PORT, () => {
  console.log(`\n🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📚 Documentation Swagger: http://localhost:${PORT}/api-docs`);
  console.log(`📝 API Articles: http://localhost:${PORT}/api/articles\n`);
});