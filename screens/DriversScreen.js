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
import Tabs from 'react-native-tabs';
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
      standingsJson: [],
      isLoading: true,
      refreshing: false,
      leadingPoints: 0,
      page:'drivers'
    };
  }  

  componentDidMount() {

    return fetch(api + '/get_standings')
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log(responseJson),
        this.setState({
          isLoading: false,
          standingsJson: responseJson,
          dataSource: this.state.dataSource.cloneWithRows(
            responseJson.driver_standings.MRData.StandingsTable
            .StandingsLists[0].DriverStandings),

          leadingPoints: responseJson.driver_standings
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
    this.setState({
      refreshing: true,
    });

    fetch(api + '/get_standings')
    .then((response) => response.json())
    .then((responseJson) => {
      // console.log(responseJson),

      {

      if (this.state.page === 'drivers') {
        this.setState({
          isLoading: false,
          standingsJson: responseJson,
          dataSource: this.state.dataSource.cloneWithRows(
            responseJson.driver_standings.MRData.StandingsTable
            .StandingsLists[0].DriverStandings),

          leadingPoints: responseJson.driver_standings
                                .MRData.StandingsTable
                                .StandingsLists[0]
                                .DriverStandings[0]
                                .points,
        });
      } else {
        this.setState({
          isLoading: false,
          standingsJson: responseJson,
          dataSource: this.state.dataSource.cloneWithRows(
            responseJson.constructor_standings.MRData.StandingsTable
            .StandingsLists[0].ConstructorStandings),

          leadingPoints: responseJson.constructor_standings
                                    .MRData.StandingsTable
                                    .StandingsLists[0]
                                    .ConstructorStandings[0]
                                    .points,
        });
      }

      }
    })
    .catch((error) => {
      console.error(error);
    });

    this.refs.refresh_toast.show('Refreshed championship standings');
    console.log("Refreshed championship standings");
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

        {

          ((this.state.page === 'drivers') &&

          <View style={styles.standingsNameBox}>
            <Text>
              {
                standingCell.Driver.givenName + " "
                + standingCell.Driver.familyName
              }
            </Text>

            <Text style={{color: 'grey'}}>
              {standingCell.Constructors[0].name}
            </Text>
          </View>
          )

        }
        {

          ((this.state.page === 'constructors') &&
              
          <View style={styles.standingsNameBox}>
            <Text>
              {standingCell.Constructor.name}
            </Text>
          </View>
          )

        }

        <View style={styles.pointsBox}>

          <Text>
            {standingCell.points}
          </Text>

          {(rowID !== '0') &&

            <Text style={{color: 'grey'}}>
              {'-' + (this.state.leadingPoints
                - parseInt(standingCell.points))}
            </Text>

          }

        </View>

      </View>
    )
  }

  updateStandings(event){
    var responseJson = this.state.standingsJson;
    var nextPage = event.props.name;

    switch (nextPage) {

      case 'drivers':
        this.setState({
          page:'drivers',
          dataSource: this.state.dataSource.cloneWithRows(
            responseJson.driver_standings.MRData.StandingsTable
            .StandingsLists[0].DriverStandings),

          leadingPoints: responseJson.driver_standings
                                .MRData.StandingsTable
                                .StandingsLists[0]
                                .DriverStandings[0]
                                .points,
        });
        break

      case 'constructors':
        this.setState({
          page:'constructors',
          dataSource: this.state.dataSource.cloneWithRows(
                responseJson.constructor_standings.MRData.StandingsTable
                .StandingsLists[0].ConstructorStandings),

          leadingPoints: responseJson.constructor_standings
                                  .MRData.StandingsTable
                                  .StandingsLists[0]
                                  .ConstructorStandings[0]
                                  .points,
        });
        break

      default:
        console.log("Undefined tab switch")

    }

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
            this.state.standingsJson.driver_standings.MRData.StandingsTable.season
            + " Championship Standings"}
          </Text>
        </View>

        <View style={styles.listHeader}>
          <Tabs selected={this.state.page} style={{backgroundColor:'white'}}
                selectedStyle={{color:'red'}} onSelect={el => this.updateStandings(el)}>
              <Text name="drivers">Drivers</Text>
              <Text name="constructors">Constructors</Text>
          </Tabs>
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
