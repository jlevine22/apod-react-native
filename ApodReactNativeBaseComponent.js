'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicatorIOS,
  ScrollView,
  StatusBarIOS,
  LayoutAnimation,
  Navigator,
} = React;
var xmldoc = require('xmldoc');
var Dimensions = require('Dimensions');
var Apod = require('./ApodComponent');
var ApodList = require('./ApodsListComponent');

var ApodReactNative = React.createClass({
  getInitialState: function() {
    return {
      loaded: false,
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
        var href = description[0].val.match(/href=\"([^\"]*)\"/i);
        item.url = href[1];
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
              item.title = title && title[1];
              item.imageUrl = foundImageSource && 'http://apod.nasa.gov/apod/' + foundImageSource[1];
              return item;
            })
          );
        });
        return Promise.all(promises);
      })
      .then(items => items.filter(item => {
        return (item.imageUrl && item.title);
      }))
      .then((items) => {
        this.setState({
          loaded: true,
          items: items,
          selectedIndex: 0,
        });
      })
      .done();
  },

  renderScene: function(route, navigator) {
    return route.renderer(route, navigator);
  },

  renderLoading: function() {
    return (
      <View style={styles.container}>
        <ActivityIndicatorIOS/>
        <Text>Loading...</Text>
      </View>
    );
  },

  render: function() {
    var self = this;
    if (!this.state.loaded) {
      return this.renderLoading();
    }

    var ROUTES = [
      {
        name: 'Apods',
        renderer: (route, navigator) => {
          return(
            <ApodList items={this.state.items} onItemSelected={(index) => {
              this.setState({ selectedIndex: index });
              navigator.jumpTo(ROUTES[1]);
            }} />
          );
        }
      },
      {
        name: 'Selected Apod',
        renderer: (route, navigator) => {
          return (<Apod item={this.state.items[this.state.selectedIndex]} />);
        },
        sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
      }
    ];

    return (
      <View style={{flex:1,backgroundColor:'#111111',}}>
        <Navigator
          renderScene={this.renderScene}
          initialRoute={ROUTES[1]}
          initialRouteStack={ROUTES}
          configureScene={route => {
            return route.sceneConfig || Navigator.SceneConfigs.FloatFromRight;
          }}
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
});

module.exports = ApodReactNative;
