import React from 'react';

import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation';

import {
  RefreshControl,
  StyleSheet,
  Text,
  View,
  ListView,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';

import {styles} from './StandingsStyles.js'

const api = 'https://f1portal.herokuapp.com';

export default class CalendarScreen extends React.Component {

  static navigationOptions = {
    tabBarLabel: 'Calendar',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../images/icons/calendar.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
    tabBarPosition: 'bottom',
  };


  constructor(props) {
    super(props);
  }

  render() {

    return (

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>
            Race Calendar goes here
          </Text>
      </View>

    );
  }
}
