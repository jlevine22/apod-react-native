'use strict';

var React = require('react-native');
var {
  Image,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  LayoutAnimation,
  StatusBarIOS,
} = React;
var animations = require('./animations');

var Apod = React.createClass({

  getInitialState: function() {
    return {
      cover: true
    };
  },

  touches: 0,

  decrementTouches: function() {
    this.touches--;
  },

  onPress: function() {
    this.touches++;
    setTimeout(this.decrementTouches, 250);
    if (this.touches == 2) {
      LayoutAnimation.configureNext(animations.easeInEaseOut);
      this.setState({
        cover: !this.state.cover,
      });
    }
  },

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

          <View style={{flex:1}} />
          <Text style={styles.apodDescription}>{this.props.item.title}</Text>
      </Image>
    );
  },

  render: function() {
    var image;
    if (this.state.cover) {
      image = this.imageCover();
    } else {
      image = this.imageContain();
    }

    StatusBarIOS.setStyle(2, false);
    if (this.state.cover) {
      StatusBarIOS.setHidden(true, 1);
    } else {
      StatusBarIOS.setHidden(false, 1);
    }

    return (
      <TouchableOpacity onPress={this.onPress} activeOpacity={1}>
        {image}
      </TouchableOpacity>
    );
  }
});

var styles = StyleSheet.create({
  apod: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  apodDescription: {
    textAlign: 'center',
    bottom: 0,
    color: '#FFFFFF',
    paddingBottom: 5,
  },
});

module.exports = Apod;
