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
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      calendarJson: [],
      isLoading: true,
      refreshing: false,
    };

  }

  componentDidMount() {

    return fetch(api + '/get_schedule')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          calendarJson: responseJson,
          dataSource: this.state.dataSource.cloneWithRows(
            responseJson.MRData.RaceTable.Races),
        });
      })
      .catch((error) => {
        console.error(error);
      });

  }

  renderRow(standingCell, something, rowID) {

    return(
      <View style={styles.listElem}>

        <View style={styles.standingsOrder}>
            <Text style={{color: 'grey'}}>
              {standingCell.raceName}
            </Text>
          </View>
        </View>
    )
 
  }

  render() {

    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator />
        </View>
      );
    }

    return (

      <View style={styles.container}>

        <View style={styles.listHeader}>
          <Text style={styles.listHeaderText}>
            Race Calendar
          </Text>
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ListView
            flex-start dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
            enableEmptySections={true}
            removeClippedSubviews={false}
            automaticallyAdjustContentInsets={false}
          />
        </View>

      </View>

    );
  }
}
