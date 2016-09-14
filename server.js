var express = require('express');
var app = express();
var router = express.Router();

var elastic = require('./elasticsearch.js');
var suggestions = require('./routes/suggestions');

app.listen(4000, function () {
  console.log('Server is listening on port 4000. Ready to accept requests!');
});

app.use('/suggestions', suggestions);

elastic.checkIfIndexExists().then(function (exists) {
  if (exists) {
    return elastic.deleteIndex();
  }
}).then(function () {
  return elastic.createIndex().then(elastic.initialiseMapping).then(function () {
    //Add a few titles for the autocomplete
    //elasticsearch offers a bulk functionality as well, but this is for a different time
    var promises = [
      'Thing Explainer',
      'The Internet Is a Playground',
      'The Pragmatic Programmer',
      'The Hitchhikers Guide to the Galaxy',
      'Trial of the Clone'
    ].map(function (bookTitle) {
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
