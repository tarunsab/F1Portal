import React from 'react';

import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation';


import DriversScreen from './screens/DriversScreen';
import ConstructorsScreen from './screens/ConstructorsScreen';

const Tabs = TabNavigator({

  DriversStandings: {
    screen: DriversScreen
  },

  ConstructorsStandings: {
    screen: ConstructorsScreen
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

