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
  ScrollView,
  StatusBarIOS,
} = React;
var xmldoc = require('xmldoc');

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
    StatusBarIOS.setStyle(2, false);
    if (this.state.cover) {
      StatusBarIOS.setHidden(true, 1);
    } else {
      StatusBarIOS.setHidden(false, 1);
    }

    return (
        <ScrollView horizontal={true} pagingEnabled={true} style={styles.apodPager}>
          {this.state.items.map(item => {
            return (
              <TouchableOpacity onPress={this._onPressButton} activeOpacity={1}>
                <View style={{flex:1}}>
                  <Apod item={item} cover={this.state.cover}/>
                </View>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    );
  }
});

var Apod = React.createClass({
  imageCover: function() {
    return (
      <Image
        source={{uri:this.props.item.imageUrl}}
        style={[styles.apod, {resizeMode:Image.resizeMode.cover,}]}>
      </Image>
    );
  },

  imageContain: function() {
    return (
      <Image
        source={{uri: this.props.item.imageUrl}}
        style={[styles.apod, {resizeMode:Image.resizeMode.contain,}]}>
          <View style={{ flex: 1 }} />
          <Text style={styles.apodDescription}>{this.props.item.title}</Text>
      </Image>
    );
  },

  render: function() {
    if (this.props.cover) {
      return this.imageCover();
    }
    return this.imageContain();
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
    width:375,
    height:667,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  apodDescription: {
    textAlign: 'center',
    bottom: 0,
    color: '#FFFFFF',
    paddingBottom: 5,
  },
  apodPager: {
    flex: 1,
    backgroundColor: '#000000',
  }
});

AppRegistry.registerComponent('ApodReactNative', () => ApodReactNative);
