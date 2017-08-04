import React from 'react';

import {
  StackNavigator,
} from 'react-navigation';

import {
  WebView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {styles} from '../GlobalStyles.js'
import Tabs from 'react-native-tabs';
var raceName;
var raceJSON;

export default class RaceScreen extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.race_name,
  });


  constructor(props) {
    super(props);

    raceName = this.props.navigation.state.params.race_name;
    raceJSON = this.props.navigation.state.params.race_json;
    
    this.state = {
      dataSource: [],
      calendarJson: [],
      isLoading: true,
      refreshing: false,
      page: 'practice',
    };

  }

  changeTabs(event) {
    var nextPage = event.props.name;
    this.setState({page: nextPage});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.tabHeader}>
          <Tabs selected={this.state.page} style={{backgroundColor:'white'}}
                selectedStyle={{color:'red'}} onSelect={el => this.changeTabs(el)}>

              <Text name="practice">Practice</Text>
              <Text name="qualifying">Qualifying</Text>
              <Text name="race">Race</Text>

          </Tabs>
        </View>
      </View>
    );
  }
}

var local_styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
