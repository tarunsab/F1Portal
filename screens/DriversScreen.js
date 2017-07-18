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
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';

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
    };
  }

  componentDidMount() {    

    return fetch(api + '/get_drivers')
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log(responseJson),
        this.setState({
          isLoading: false,
          driverJson: responseJson,
          dataSource: this.state.dataSource.cloneWithRows(
            responseJson.MRData.StandingsTable
            .StandingsLists[0].DriverStandings),
        });
      })
      .catch((error) => {
        //console.error(error);
      });

  }

  renderRow(standingCell, something, rowID) {
      return (
        <View style={styles.listElem}>

          <View style={styles.driverOrder}>
            <Text style={{color: 'grey'}}>
              {parseInt(rowID, 10) + 1}
            </Text>
          </View>

          <View style={styles.driverNameBox}>

            <Text>{standingCell.Driver.givenName + " "
              + standingCell.Driver.familyName}
            </Text>

            <Text style={{color: 'grey'}}>
              {standingCell.Constructors[0].name}</Text>

          </View>

          <View style={styles.driverPointsBox}>
            <Text style={{color: 'red'}}>
              {standingCell.points}</Text>
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
            F1 Portal
          </Text>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listHeaderText}>{
            this.state.driverJson.MRData.StandingsTable.season + " Drivers Championship"}</Text>
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ListView
            flex-start dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
            enableEmptySections={true}
          />
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header:{
    backgroundColor: '#F44336',
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: 'row'
  },
  headerText:{
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'normal',
    flex: 1,
    fontSize: 20,
  },
  listHeader:{
    backgroundColor: '#F5F5F5',
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignContent: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#EEEEEE',    
  },
  listHeaderText:{
    color: '#F44336',
    textAlign: 'center',
    fontWeight: 'normal',
    flex: 1,
    fontSize: 20,
  },
  listElem:{
    width: Dimensions.get('window').width,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 30,
    paddingRight: 30,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',    
    alignItems: 'flex-start'
  },
  driverPointsBox:{
    flex: 1,
    alignItems: 'flex-end'
  },
  driverNameBox:{
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'column'
  },
  driverOrder:{
    alignItems: 'flex-start',
    minWidth: 25,
  },
  icon: {
    width: 26,
    height: 26,
  },
});


