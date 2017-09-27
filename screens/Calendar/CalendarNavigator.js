import React from 'react';
import {styles} from '../GlobalStyles.js'

import CalendarRaceDetails from './screens/CalendarRaceDetails';
import CalendarRaceList from './screens/CalendarRaceList';

import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation';

import {
  Image,
} from 'react-native';

const RaceStackNavigator = StackNavigator({

  RaceCalendarListScreen: {
    screen: CalendarRaceList
  },

  RaceScreen: {
    screen: CalendarRaceDetails,
  }
},{
    navigationOptions: {
      headerStyle: styles.header,
      headerTitleStyle: styles.headerText,
    },
});

export default class CalendarNavigator extends React.Component {

  static navigationOptions = {
    tabBarLabel: 'Calendar',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../../images/icons/calendar.png')}
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
