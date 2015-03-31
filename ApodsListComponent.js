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
        <ScrollView style={styles.apodsScrollView} contentContainerStyle={styles.apodsContent}>
          {this.props.items.map((item) => {
            var image = item.imageThumbUrl ?
              <Image
                source={{uri: item.imageThumbUrl}}
                style={{
                  width:80,
                  height:80,
                  borderRadius:40,
                  resizeMode: Image.resizeMode.stretch,}}>
              </Image> :
              null;
            return (
              <TouchableOpacity onPress={this.onPress(item)}>
                <View style={{margin:5,width:(Dimensions.get('window').width-20)/2,alignItems:'center',}}>
                  {image}
                  <Text style={{flex:1,color:'#000000'}}>{item.title}</Text>
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
  apodsScrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  apodsContent: {
    justifyContent:'space-around',
    flexDirection:'row',
    flexWrap:'wrap',
  }
});

module.exports = ApodsListComponent;
