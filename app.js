const express = require('express');
const { Client } = require('@elastic/elasticsearch');
const app = express();
const port = 3000;

// Configurer Elasticsearch client
const esClient = new Client({ node: 'http://localhost:9200' });

// Middleware pour parser les JSON
app.use(express.json());

// Vérifier la connexion à Elasticsearch
esClient.ping({}, (error) => {
    if (error) {
        console.error('Elasticsearch cluster is down!');
    } else {
        console.log('Connected to Elasticsearch');
    }
});

// Routes CRUD
app.get('/', (req, res) => {
    res.send('API Elasticsearch CRUD');
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
