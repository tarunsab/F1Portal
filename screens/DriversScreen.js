import React from 'react';

import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation';

import {
  StyleSheet,
  Alert,
  Text,
  View,
  ListView,
  Dimensions,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';

import Toast, {DURATION} from 'react-native-easy-toast'
import {styles} from './StandingsStyles.js'

const api = 'https://f1portal.herokuapp.com';

export default class DriversScreen extends React.Component {

  static navigationOptions = {
    tabBarLabel: 'Drivers',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../images/icons/helmet.png')}
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
      driverJson: [],
      isLoading: true,
      refreshing: false,
      leadingDriverPoints: 0,
    };
  }

  componentDidMount() {

    return fetch(api + '/get_standings')
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log(responseJson),
        this.setState({
          isLoading: false,
          driverJson: responseJson,

          dataSource: this.state.dataSource.cloneWithRows(
            responseJson.driver_standings.MRData.StandingsTable
            .StandingsLists[0].DriverStandings),

          leadingDriverPoints: responseJson.driver_standings
                                .MRData.StandingsTable
                                .StandingsLists[0]
                                .DriverStandings[0]
                                .points,

        });
      })
      .catch((error) => {
        console.error(error);
      });

  }

   _onRefresh() {
    this.setState({refreshing: true});

    fetch(api + '/get_standings')
    .then((response) => response.json())
    .then((responseJson) => {
      // console.log(responseJson),
      this.setState({
        driverJson: responseJson,
        dataSource: this.state.dataSource.cloneWithRows(
          responseJson.driver_standings.MRData.StandingsTable
          .StandingsLists[0].DriverStandings),

        leadingDriverPoints: responseJson.driver_standings
                              .MRData.StandingsTable
                              .StandingsLists[0]
                              .DriverStandings[0]
                              .points,
      });
    })
    .catch((error) => {
      console.error(error);
    });

    this.refs.refresh_toast.show('Refreshed drivers standings');
    console.log("Refreshed drivers standings");
    this.setState({refreshing: false});
  }


  renderRow(standingCell, something, rowID) {

    return (
      <View style={styles.listElem}>

        <View style={styles.standingsOrder}>
          <Text style={{color: 'grey'}}>
            {parseInt(rowID, 10) + 1}
          </Text>
        </View>

        <View style={styles.standingsNameBox}>

          <Text>{standingCell.Driver.givenName + " "
            + standingCell.Driver.familyName}
          </Text>

          <Text style={{color: 'grey'}}>
            {standingCell.Constructors[0].name}</Text>

        </View>

        <View style={styles.driverPointsBox}>

          <Text>
            {standingCell.points}
          </Text>

          {(rowID !== '0') &&

            <Text style={{color: 'grey'}}>
              {'-' + (this.state.leadingDriverPoints
                - parseInt(standingCell.points))}
            </Text>

          }

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
          <Text style={styles.listHeaderText}>{
            this.state.driverJson.driver_standings.MRData.StandingsTable.season
            + " Drivers Standings"}
          </Text>
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ListView
            flex-start dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
            enableEmptySections={true}
            removeClippedSubviews={false}
            automaticallyAdjustContentInsets={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
          />
        </View>

        <Toast ref="refresh_toast"/>

      </View>
    );
  }
}
