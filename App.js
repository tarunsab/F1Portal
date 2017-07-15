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
        <View>
          <Text>{standingCell.Driver.familyName}</Text>
        </View>
      )
  }

  renderSectionHeader() {
    return (
      <View>
          <Text>{myjson.MRData.StandingsTable.season}</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',}}>
       <ListView                     
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          renderHeader={this.renderSectionHeader.bind(this)}
          enableEmptySections={true}
        />
      </View>
    );
  }
}



