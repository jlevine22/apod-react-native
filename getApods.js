'use strict';

var xmldoc = require('xmldoc');

module.exports = function getApods() {
  return fetch('http://apod.nasa.gov/apod.rss')
    .then((response) => response.text())
    .then((responseText) => {
      var document = new xmldoc.XmlDocument(responseText);
      return document.childNamed('channel').childrenNamed('item');
    })
    .then((items) => items.map(item => {
      var description = item.childrenNamed('description');
      var href = description[0].val.match(/href=\"([^\"]*)\"/i);
      var thumb = description[0].val.match(/src=\"([^\"]*)\"/i);
      item.url = href[1];
      item.imageThumbUrl = thumb && thumb[1];
      return item;
    }))
    .then((items) => {
      var promises = [];
      items.forEach(item => {
        promises.push(fetch(item.url)
          .then(response => response.text())
          .then(responseText => {
            var foundImageSource = responseText.match(/img src=\"([^\"]*)\"/i);
            var title = responseText.match(/<b>(.*?)<\/b>/i);
            item.title = title && title[1].trim();
            item.imageUrl = foundImageSource && 'http://apod.nasa.gov/apod/' + foundImageSource[1];
            return item;
          })
        );
      });
      return Promise.all(promises);
    })
    .then(items => items.filter(item => {
      return (item.imageUrl && item.title);
    }));
}
