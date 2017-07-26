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
      <Image
        style={local_styles.raceImage} 
        source={{uri: 'http://www.f1fanatic.co.uk/wp-content/uploads/2015/11/start-p1.jpg'}}>
          <View style={local_styles.raceImageView}>
            <View style={local_styles.raceNameTextView}>
              <Text style={local_styles.raceNameText}>
                {standingCell.raceName}
              </Text>
            </View>
            <View style={local_styles.raceDateTextView}>
              <Text style={local_styles.raceDateText}>
                {standingCell.date}
              </Text>
            </View>
          </View>
      </Image>
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

var local_styles = StyleSheet.create({
  raceImage: {
    width: Dimensions.get('window').width,
    height: 120,
  },
  raceImageView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: Dimensions.get('window').width,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderBottomWidth: 0.5,
    borderBottomColor: '#A0A0A0',
  },
  raceNameText: {
    paddingLeft: 15,
    paddingTop: 15,
    fontSize: 19,
    textAlign: 'left',
    color: '#404040',
  },
  raceNameTextView:{
    flex: 5,
    alignItems: 'flex-start',
  },
  raceDateText: {
    paddingRight: 15,
    paddingTop: 15,
    fontSize: 16,
    textAlign: 'right',
    color: '#606060',
  },
  raceDateTextView:{
    flex: 2,
    alignItems: 'flex-end',
  },
});
