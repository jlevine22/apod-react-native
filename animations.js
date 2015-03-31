'use strict';
var React = require('react-native');
var {
  LayoutAnimation,
} = React;

var animations = {
  easeInEaseOut: {
    duration: 0.3,
    create: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.scaleXY,
    },
    update: {
      delay: 0.1,
      type: LayoutAnimation.Types.easeInEaseOut,
    },
  },
};

module.exports = animations;
