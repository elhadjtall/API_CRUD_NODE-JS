const express = require('express');
const { Client } = require('@elastic/elasticsearch');
const app = express();
const port = 3000;

// Configurer Elasticsearch client
const client = new Client({ node: 'http://localhost:9200' });

// Middleware pour parser les JSON
app.use(express.json());

// Vérifier la connexion à Elasticsearch
client.ping({}, (error) => {
    if (error) {
        console.error('Elasticsearch cluster is down!');
    } else {
        console.log('Connected to Elasticsearch');
    }
});

// Routes CRUD
app.get('/', async (req, res) => {
    try {
        const indexExists = await client.indices.exists({ index: "livre" });
        if (!indexExists) {
            await client.indices.create({
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
    }
});

// Route pour ajouter un nouveau livre
app.post("/livre", async (req, res) => {
    const { titre, auteur, genre, description, date_parution, isbn } = req.body;

    try {
        const response = await client.index({
            index: "livre",
            body: {
                titre,
                auteur,
                genre,
                description,
                date_parution,
                isbn
            }
        });
        res.status(201).json({ message: "Livre ajouté avec succès", response });
    } catch (error) {
        console.error("Erreur lors de l'ajout du livre:", error);
        res.status(500).json({ error: "Erreur lors de l'ajout du livre" });
    }
});

// Route pour récupérer un livre par son ISBN
app.get("/livre/:isbn", async (req, res) => {
    const { isbn } = req.params;

    try {
        const result = await client.search({
            index: "livre",
            body: {
                query: {
                    match: { isbn }
                }
            }
        });
        console.log(result);
        if (result.hits.hits.length > 0) {
            res.status(200).json(result.hits.hits[0]._source);
        } else {
            res.status(404).json({ message: "Livre non trouvé" });
        }
    } catch (error) {
        console.error("Erreur lors de la récupération du livre:", error);
        res.status(500).json({ error: "Erreur lors de la récupération du livre" });
    }
});

// Route pour récupérer tous les livres
app.get("/livres", async (req, res) => {
    try {
        const result = await client.search({
            index: "livre",
            body: {
                query: {
                    match_all: {} // Récupère tous les documents de l'index
                }
            }
        });
        const livres = result.hits.hits.map(hit => hit._source); // Extrait les données des livres
        res.status(200).json(livres);
    } catch (error) {
        console.error("Erreur lors de la récupération des livres:", error);
        res.status(500).json({ error: "Erreur lors de la récupération des livres" });
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});




