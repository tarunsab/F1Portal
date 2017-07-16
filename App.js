import React from 'react';
import { 
  StyleSheet,
  Text,
  View,
  ListView,
  Dimensions
} from 'react-native';

const myjson = require('./curr_drivers.json');

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
  }

  componentDidMount() {    
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(
        myjson.MRData.StandingsTable.StandingsLists[0].DriverStandings)
    });
  }

  renderRow(standingCell) {
      return (
        <View style={styles.listElem}>

          <View style={styles.driverNameBox}>

            <Text>{standingCell.Driver.givenName + " "
              + standingCell.Driver.familyName}</Text>

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
    return (
      <View style={styles.container}>
      
        <View style={styles.header}>
          <Text style={styles.headerText}>
            F1 Portal
          </Text>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listHeaderText}>{
            myjson.MRData.StandingsTable.season + " Drivers Championship"}</Text>
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
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    alignContent: 'center'
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
    borderBottomColor: '#f1f2f6',    
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
  }
});

