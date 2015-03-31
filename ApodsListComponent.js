'use strict';

var React = require('react-native');
var {
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  StatusBarIOS,
} = React;
var Dimensions = require('Dimensions');

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
        <View style={styles.headerSpacer} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Recent APODS</Text>
        </View>
        <View style={styles.headerSeparator} />
        <ScrollView style={styles.apodsScrollView} contentContainerStyle={styles.apodsContent}>
          {this.props.items.map((item) => {
            var image = item.imageThumbUrl ?
              <Image
                source={{uri: item.imageThumbUrl}}
                style={styles.apodItemIcon}>
              </Image> :
              null;
            return (
              <TouchableOpacity onPress={this.onPress(item)}>
                <View style={styles.apodItemWrapper}>
                  {image}
                  <Text style={styles.apodItemText}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  // ScrollView
  apodsScrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  apodsContent: {
    justifyContent:'space-around',
    flexDirection:'row',
    flexWrap:'wrap',
  },
  // Header
  headerSpacer: {
    height: 20,
  },
  header: {
    height: 30,
    backgroundColor:'#FEFEFE',
    justifyContent:'center',
    alignItems:'center',
  },
  headerSeparator: {
    height: 1,
    backgroundColor:'#F0F0F0',
  },
  headerTitle: {
    fontWeight:'600',
  },
  // Apod Item
  apodItemWrapper: {
    margin: 5,
    width: (Dimensions.get('window').width - 20) / 2,
    alignItems:'center',
  },
  apodItemIcon: {
    width:80,
    height:80,
    borderRadius:40,
    resizeMode: Image.resizeMode.cover,
  },
  apodItemText: {
    fontSize: 12,
    color:'#000000',
    flex: 1,
    marginTop: 5,
  }

});

module.exports = ApodsListComponent;
