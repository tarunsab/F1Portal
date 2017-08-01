import React from 'react';
import {styles} from './GlobalStyles.js'

import RaceScreen from './CalendarComponents/RaceScreen';
import RaceCalendarListScreen from './CalendarComponents/RaceCalendarListScreen';

import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation';

import {
  Image,
} from 'react-native';

const RaceStackNavigator = StackNavigator({

  RaceCalendarListScreen: {
    screen: RaceCalendarListScreen
  },

  RaceScreen: {
    screen: RaceScreen
  },

});

export default class CalendarNavigator extends React.Component {

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
    return <RaceStackNavigator/>;
  }

}
