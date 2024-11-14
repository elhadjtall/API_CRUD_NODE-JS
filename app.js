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
app.get('/', async (req, res) => {
    try {
        const indexExists = await esClient.indices.exists({ index: "livre" });
        if (!indexExists.body) {
            await esClient.indices.create({
                index: "livre",
                body: {
                    mappings: {
                        properties: {
                            titre: { type: "text" },
                            auteur: { type: "text" },
                            genre: { type: "keyword" },
                            description: { type: "text" },
                            date_parution: { type: "date", format: "yyyy-MM-dd" },
                            isbn: { type: "keyword" }
                        }
                    }
                }
            });
            res.status(200).json({ message: "Index 'livre' créé avec succès" });
        } else {
            res.status(200).json({ message: "Index 'livre' existe déjà" });
        }
    } catch (error) {
        console.error("Erreur lors de la création de l'index:", error);
        res.status(500).json({ error: "Erreur lors de la création de l'index" });
    }    res.send('API Elasticsearch VOITURE');
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


