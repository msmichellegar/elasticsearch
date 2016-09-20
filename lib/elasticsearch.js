var elasticsearch = require('elasticsearch');

var elasticClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'info'
});

var indexName = "randomindex";

module.exports = {

    deleteIndex: function() {
        return elasticClient.indices.delete({
          index: indexName
        });
    },

    createIndex: function() {
        return elasticClient.indices.create({
          index: indexName
        });
    },

    checkIfIndexExists: function() {
        return elasticClient.indices.exists({
          index: indexName
        });
    },

    initialiseMapping: function() {
        return elasticClient.indices.putMapping({
            index: indexName,
            type: "document",
            body: {
                properties: {
                    title: { type: "string" },
                    content: { type: "string" },
                    suggest: {
                        type: "completion",
                        analyzer: "simple",
                        search_analyzer: "simple",
                        payloads: true
                    }
                }
            }
        });
    },

    addDocument: function(document) {
        return elasticClient.index({
            index: indexName,
            type: "document",
            body: {
                title: document.title,
                content: document.content,
                suggest: {
                    input: document.title.split(" "),
                    output: document.title,
                    payload: document.metadata || {}
                }
            }
        });
    },

    getSuggestions: function getSuggestions(input) {
        return elasticClient.suggest({
            index: indexName,
            type: "document",
            body: {
                docsuggest: {
                    text: input,
                    completion: {
                        field: "suggest",
                        fuzzy: true
                    }
                }
            }
        });
    }

}
