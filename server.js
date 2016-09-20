var express = require('express');
var app = express();
var router = express.Router();

var elastic = require('./lib/elasticsearch.js');
var suggestions = require('./lib/routes/suggestions');

app.listen(4000, function () {
  console.log('Server is listening on port 4000. Ready to accept requests!');
  console.log(elastic)
});

app.use('/suggestions', suggestions);

elastic.checkIfIndexExists().then(function (exists) {
    if (exists) {
        return elastic.deleteIndex();
    }
}).then(function () {
    return elastic.createIndex().then(elastic.initialiseMapping).then(function () {
        var promises = [
          'Thing Explainer',
          'The Internet Is a Playground',
          'The Pragmatic Programmer',
          'The Hitchhikers Guide to the Galaxy',
          'Trial of the Clone',
          'The Witches',
          'The Palace of Versailles',
          'The People of Troy'
        ];

        promises.map(function (bookTitle) {
          return elastic.addDocument({
            title: bookTitle,
            content: bookTitle + " content",
            metadata: {
              titleLength: bookTitle.length
            }
          });
        });

        return Promise.all(promises);
    });
});

app.use(express.static("public"));
