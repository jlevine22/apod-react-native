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
var getApods = require('./getApods');

var ApodReactNative = React.createClass({
  getInitialState: function() {
    return {
      loaded: false,
    };
  },

  componentDidMount: function() {
    getApods().then(apods => {
      this.setState({
        items: apods,
        loaded: true,
        selectedIndex: 0,
      }).done();
    });
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
        renderer: (route, navigator, onRef) => {
          return(
            <ApodList
              items={this.state.items}
              onItemSelected={(index) => {
                this.setState({ selectedIndex: index });
                navigator.jumpTo(ROUTES[1]);
              }}/>
          );
        },
        onWillFocus: () => {
          StatusBarIOS.setHidden(false, 1);
          StatusBarIOS.setStyle(0, true);
        },
      },
      {
        name: 'Selected Apod',
        renderer: (route, navigator, onRef) => {
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
          onWillFocus={route => {
            if (route.onWillFocus) {
              route.onWillFocus();
            }
          }}
          onDidFocus={(route) => {
            if (route.onDidFocus) {
              route.onDidFocus();
            }
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
