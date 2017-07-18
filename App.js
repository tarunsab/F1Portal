import React from 'react';

import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation';


import DriversScreen from './DriversScreen';
import ConstructorsScreen from './ConstructorsScreen';

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
    activeTintColor: '#e91e63',
    swipeEnabled: true,
  },

});

export default class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <Tabs/>;
  }

}

