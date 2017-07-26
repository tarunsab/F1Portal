import React from 'react';

import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation';


import StandingsScreen from './screens/StandingsScreen';
import CalendarScreen from './screens/CalendarScreen';

const Tabs = TabNavigator({

  Standings: {
    screen: StandingsScreen
  },

  Calendar: {
    screen: CalendarScreen
  },

}, 

  {
    tabBarOptions: {
      activeTintColor: '#F44336',
      swipeEnabled: true,
      tabBarPosition: 'bottom',
    },

    tabBarPosition: 'bottom',

});

export default class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <Tabs/>;
  }

}

