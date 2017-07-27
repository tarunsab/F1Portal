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

    var today = new Date();
    var raceDate = new Date(standingCell.date);
    var imgStyle;
    if (raceDate < today) {
      imgStyle = local_styles.elapsedRaceImageView;
      raceNameTextStyle = local_styles.elapsedRaceNameText;
      raceCircuitTextStyle = local_styles.elapsedRaceCircuitText;
      raceDateTextStyle = local_styles.elapsedRaceDateText;
    } else {
      imgStyle = local_styles.raceImageView;
      raceNameTextStyle = local_styles.raceNameText;
      raceCircuitTextStyle = local_styles.raceCircuitText;
      raceDateTextStyle = local_styles.raceDateText;
    }

    return(
      <Image
        style={local_styles.raceImage} 
        source={
          {uri: 'http://www.f1fanatic.co.uk/wp-content/uploads/2015/11/start-p1.jpg'}
        }>

          <View style={imgStyle}>

            <View style={local_styles.raceNameTextView}>
              <Text style={raceNameTextStyle}>
                {standingCell.raceName}
              </Text>
              <Text style={raceCircuitTextStyle}>
                {standingCell.Circuit.circuitName}
              </Text>
            </View>
            <View style={local_styles.raceDateTextView}>
              <Text style={raceDateTextStyle}>
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
    height: 170,
  },
  elapsedRaceImageView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: Dimensions.get('window').width,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderBottomWidth: 5,
    borderBottomColor: 'white',
  },
  raceImageView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: Dimensions.get('window').width,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderBottomWidth: 5,
    borderBottomColor: 'white',
  },
  elapsedRaceCircuitText: {
    paddingLeft: 15,
    fontSize: 12,
    // fontWeight: 'bold',
    textAlign: 'left',
    color: '#404040',
    // color: 'white',
    // textShadowColor: 'black',
    // textShadowOffset: {width: 1, height: 1},
    // textShadowRadius: 3,
  },
  raceCircuitText: {
    paddingLeft: 15,
    fontSize: 12,
    // fontWeight: 'bold',
    textAlign: 'left',
    // color: '#404040',
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  elapsedRaceNameText: {
    paddingLeft: 15,
    paddingTop: 15,
    fontSize: 19,
    fontWeight: '500',
    textAlign: 'left',
    color: '#404040',
  },
  raceNameText: {
    paddingLeft: 15,
    paddingTop: 15,
    fontSize: 19,
    fontWeight: '500',
    textAlign: 'left',
    // color: '#404040',
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  raceNameTextView:{
    flex: 5,
    alignItems: 'flex-start',
  },
  elapsedRaceDateText: {
    paddingRight: 15,
    paddingTop: 15,
    fontSize: 16,
    textAlign: 'right',
    color: '#606060',
  },
  raceDateText: {
    paddingRight: 15,
    paddingTop: 15,
    fontSize: 16,
    textAlign: 'right',
    // color: '#606060',
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  raceDateTextView:{
    flex: 2,
    alignItems: 'flex-end',
  },


});
