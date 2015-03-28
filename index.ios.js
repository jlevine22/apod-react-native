/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicatorIOS,
} = React;

var ApodReactNative = React.createClass({
  getInitialState: function() {
    return {
      loaded: false,
      apod: null,
      cover: true,
    };
  },

  componentDidMount: function() {
    fetch('http://apod.nasa.gov/apod.rss')
      .then((response) => response.text())
      .then((responseText) => {
        var document = new xmldoc.XmlDocument(responseText);
        return document.childNamed('channel').childrenNamed('item');
      })
      .then((items) => items.map(item => {
        var description = item.childrenNamed('description');
        var found = description[0].val.match(/href=\"([^\"]*)\"/i);
        var alt = description[0].val.match(/alt=\"([^\"]*)\"/i);
        item.url = found[1];
        item.description = alt[1];
        return item;
      }))
      .then((items) => {
        var promises = [];
        items.forEach(item => {
          promises.push(fetch(item.url)
            .then(response => response.text())
            .then(responseText => {
              var foundImageSource = responseText.match(/img src=\"([^\"]*)\"/i);
              item.imageUrl = foundImageSource && 'http://apod.nasa.gov/apod/' + foundImageSource[1];
              return item;
            })
          );
        });
        return Promise.all(promises);
      })
      .then((items) => {
        this.setState({
          loaded: true,
          apod: apod[0],
          items: items,
        });
      })
      .done();
  },

  renderLoading: function() {
    return (
      <View style={styles.container}>
        <ActivityIndicatorIOS/>
        <Text>Loading...</Text>
      </View>
    );
  },

  _onPressButton: function() {
    this.setState({
      cover: !this.state.cover,
    });
  },

  render: function() {
    if (!this.state.loaded) {
      return this.renderLoading();
    }

    return (
        <TouchableOpacity onPress={this._onPressButton}>
          <Image
            source={{ uri: this.state.items[0].imageUrl }}
            style={[styles.apod, {
              resizeMode: this.state.cover ? Image.resizeMode.cover : Image.resizeMode.contain,
            }]}>
              <View style={{ flex: 1 }} />
              <Text style={styles.apodDescription}>{this.state.items[0].description}</Text>
          </Image>
        </TouchableOpacity>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
  },
  apod: {
    flex: 1
  },
  apodDescription: {
    textAlign: 'center',
    bottom: 0,
    color: '#FFFFFF',
    paddingBottom: 5,
  }
});

AppRegistry.registerComponent('ApodReactNative', () => ApodReactNative);
