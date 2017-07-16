import React from 'react';
import { StyleSheet, Text, View, ListView} from 'react-native';

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
      dataSource: this.state.dataSource.cloneWithRows(myjson.MRData.StandingsTable.StandingsLists[0].DriverStandings)
    });
  }

  renderRow(standingCell) {
      return (
        <View style={styles.listElem}>
          <Text>{standingCell.Driver.familyName}</Text>
          <Text>{standingCell.points}</Text>
        </View>
      )
  }

  renderSectionHeader() {
    return (
      <View style={styles.listHeader}>
          <Text style={styles.listHeaderText}>{myjson.MRData.StandingsTable.season}</Text>
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


        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
         <ListView                     
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
            renderHeader={this.renderSectionHeader.bind(this)}
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
    backgroundColor: '#F44336',
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: 'row'
  },
  listHeaderText:{
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'normal',
    flex: 1,
    fontSize: 20,
  },
  listElem:{
    backgroundColor: '#F44336',
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: 'row'
  }
});

