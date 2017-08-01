import React from 'react';

import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation';


import StandingsScreen from './screens/StandingsScreen';
import CalendarNavigator from './screens/CalendarNavigator';

const Tabs = TabNavigator({

  Standings: {
    screen: StandingsScreen
  },

  Calendar: {
    screen: CalendarNavigator
  },

}, 

  {
    tabBarOptions: {
      activeTintColor: '#F44336',
      swipeEnabled: true,
      tabBarPosition: 'bottom',
      animationEnabled: true,
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

