const express = require('express');
const Book = require('../models/book');
const router = express.Router();

// Initialiser l'index si nécessaire
router.get('/creation-index', async (req, res) => {
    try {
        const result = await Book.createIndex();
        res.status(200).json({ message: result ? "Index 'book' créé" : "Index 'book' existe déjà" });
    } catch (error) {
        console.error("Erreur lors de l'initialisation de l'index:", error);
        res.status(500).json({ error: "Erreur lors de l'initialisation de l'index" });
    }
});

// Ajouter un livre
router.post('/', async (req, res) => {
    const { titre, auteur, genre, description, date_parution, isbn } = req.body;
    try {
        const response = await Book.add({ titre, auteur, genre, description, date_parution, isbn });
        res.status(201).json({ message: 'Book ajouté avec succès', response });
    } catch (error) {
        console.error('Erreur lors de l\'ajout du livre:', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout du livre' });
    }
});

// Récupérer tous les livres
router.get('/', async (req, res) => {
    try {
        const result = await Book.findAll();
        const books = result.hits.hits.map(hit => hit._source);
        res.status(200).json(books);
    } catch (error) {
        console.error('Erreur lors de la récupération des livres:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des livres' });
    }
});

// Récupérer un livre par ISBN
router.get('/:isbn', async (req, res) => {
    const { isbn } = req.params;
    try {
        const result = await Book.findByISBN(isbn);
        if (result.hits.hits.length > 0) {
            res.status(200).json(result.hits.hits[0]._source);
        } else {
            res.status(404).json({ message: 'Livre non trouvé' });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du livre:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du livre' });
    }
});



module.exports = router;
