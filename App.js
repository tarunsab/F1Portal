import React from 'react';

import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation';


import AllStandings from './screens/Standings/AllStandings';
import CalendarNavigator from './screens/Calendar/CalendarNavigator.js';

const Tabs = TabNavigator({

  Standings: {
    screen: AllStandings
  },

  Calendar: {
    screen: CalendarNavigator
  },

}, {
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

