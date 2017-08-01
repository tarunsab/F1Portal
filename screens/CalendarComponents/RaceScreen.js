import React from 'react';
import {styles} from '../GlobalStyles.js'

import {
  StackNavigator,
} from 'react-navigation';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';


export default class RaceScreen extends React.Component {

  static navigationOptions = {
    title: 'Race Title',
  };


  constructor(props) {
    super(props);
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
