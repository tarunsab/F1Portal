import React from 'react';
import {styles} from '../GlobalStyles.js'

import {
  StackNavigator,
} from 'react-navigation';

import {
  WebView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

var raceName;
var raceJSON;
var jsCode = `
  document.querySelector('#resultsarchive-col-right').style.backgroundColor = 'red';
`;

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
    };

  }

  render() {
    return (
      <View style={styles.container}>
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
