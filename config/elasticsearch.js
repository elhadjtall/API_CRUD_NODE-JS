const { Client } = require('@elastic/elasticsearch');

const client = new Client({ node: 'http://localhost:9200' });

// Vérifier la connexion à Elasticsearch
client.ping({}, (error) => {
    if (error) {
        console.error('Elasticsearch cluster is down!');
    } else {
        console.log('Connected to Elasticsearch');
    }
});

module.exports = client;