const express = require('express');
const app = express();
const port = 3000;
const booksRouter = require('./routes/books');

// Middleware pour parser les JSON
app.use(express.json());

app.use('/livres', booksRouter);

app.use('/', (req, res) => {
    res.status(200).json({ message: 'Bienvenue sur le serveur de gestion des livres' });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});




