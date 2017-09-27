import React from 'react';

import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation';

import {
  StyleSheet,
  Text,
  View,
  ListView,
  ActivityIndicator,
  Image,
  RefreshControl,
  Dimensions,
} from 'react-native';

import Toast from 'react-native-easy-toast'
import Tabs from 'react-native-tabs';
import {styles} from '../GlobalStyles.js'

const api = 'https://f1portal.herokuapp.com';

export default class AllStandings extends React.Component {

  static navigationOptions = {

    tabBarLabel: 'Standings',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../../images/icons/standings.png')}
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

  updateDriverStandings(dataJson) {
    //console.log(dataJson),
    this.setState({
        isLoading: false,
        standingsJson: dataJson,
        dataSource: this.state.dataSource.cloneWithRows(
          dataJson.driver_standings.MRData.StandingsTable
          .StandingsLists[0].DriverStandings),

        leadingPoints: dataJson.driver_standings
                              .MRData.StandingsTable
                              .StandingsLists[0]
                              .DriverStandings[0]
                              .points,
      });
  }

  updateConstructorsStandings(dataJson) {
    //console.log(dataJson),
    this.setState({
        isLoading: false,
        standingsJson: dataJson,
        dataSource: this.state.dataSource.cloneWithRows(
          dataJson.constructor_standings.MRData.StandingsTable
          .StandingsLists[0].ConstructorStandings),

        leadingPoints: dataJson.constructor_standings
                                  .MRData.StandingsTable
                                  .StandingsLists[0]
                                  .ConstructorStandings[0]
                                  .points,
      });
  }

  componentDidMount() {

    return fetch(api + '/get_standings')
      .then((response) => response.json())
      .then((responseJson) => {
        this.updateDriverStandings(responseJson);
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

      if (this.state.page === 'drivers') {
        this.updateDriverStandings(responseJson);
      } else {
        this.updateConstructorsStandings(responseJson);
      }

    })
    .catch((error) => {
      console.error(error);
    });

    this.refs.refresh_toast.show('Refreshed championship standings');
    console.log("Refreshed championship standings");
    this.setState({refreshing: false});
  }

  changeTabs(event){
    var responseJson = this.state.standingsJson;
    var nextPage = event.props.name;

    switch (nextPage) {

      case 'drivers':
        this.updateDriverStandings(responseJson);
        break

      case 'constructors':
        this.updateConstructorsStandings(responseJson);
        break

      default:
        console.log("Undefined tab switch")

    }

    this.setState({page: nextPage});

  }

  renderHeader() {
    return(
      <View style={local_styles.header}>

          <View style={local_styles.standingsOrder}>
            <Text style={local_styles.headerText}>
              #
            </Text>
          </View>

          {
            ((this.state.page === 'drivers') &&
              <View style={local_styles.standingsNameBox}>
                <Text style={local_styles.headerText}>
                  Driver
                </Text>
              </View>
            )
          }

          {
            ((this.state.page === 'constructors') &&
              <View style={local_styles.standingsNameBox}>
                <Text style={local_styles.headerText}>
                  Constructor
                </Text>
              </View>
            )
          }

          <View style={local_styles.pointsBox}>
            <Text style={local_styles.headerText}>
              Points
            </Text>
          </View>

        </View>
    )
  }

  renderRow(standingCell, something, rowID) {

    return (
      <View style={local_styles.listElem}>

        <View style={local_styles.standingsOrder}>
          <Text style={{color: 'grey'}}>
            {parseInt(rowID, 10) + 1}
          </Text>
        </View>

        {

          ((this.state.page === 'drivers') &&

            <View style={local_styles.standingsNameBox}>
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
              
            <View style={local_styles.standingsNameBox}>
              <Text>
                {standingCell.Constructor.name}
              </Text>
            </View>
          )

        }

        <View style={local_styles.pointsBox}>

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

        <View style={styles.header}>
          <Text style={styles.headerText}>
            {"Championship Standings"}
          </Text>
        </View>

        <View style={styles.tabHeader}>
          <Tabs selected={this.state.page} style={{backgroundColor:'#F44336'}}
                selectedStyle={{color:'white'}} onSelect={el => this.changeTabs(el)}>
              <Text name="drivers">Drivers</Text>
              <Text name="constructors">Constructors</Text>
          </Tabs>
        </View>

        {this.renderHeader()}

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

const local_styles = StyleSheet.create({
  header:{
    width: Dimensions.get('window').width,
    paddingLeft: 30,
    paddingRight: 30,
    flexDirection: 'row',
    backgroundColor: 'rgb(63, 63, 63)',
    alignItems: 'flex-start',
  },
  headerText:{
    color: '#E0E0E0',
  },
  listElem:{
    width: Dimensions.get('window').width,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 30,
    paddingRight: 30,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    alignItems: 'flex-start'
  },
  pointsBox:{
    flex: 1,
    alignItems: 'flex-end'
  },
  standingsNameBox:{
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'column'
  },
  standingsOrder:{
    alignItems: 'flex-start',
    minWidth: 25,
  },
});
