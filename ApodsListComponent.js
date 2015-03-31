'use strict';

var React = require('react-native');
var {
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} = React;

class ApodsListComponent extends React.Component {

  onPress(item) {
    return () => {
      if (this.props.onItemSelected) {
        this.props.onItemSelected(this.props.items.indexOf(item));
      }
    };
  }

  render() {
    return (
      <View style={{flex:1, backgroundColor:'#FFFFFF'}}>
        <ScrollView styles={styles.apodsScrollView}>
          {this.props.items.map((item) => {
            return (
              <TouchableOpacity onPress={this.onPress(item)}>
                <Text style={{flex:1,color:'#000000'}}>{item.title}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  apodsScrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  }
});

module.exports = ApodsListComponent;
