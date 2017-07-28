import React from 'react';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import {styles} from './GlobalStyles.js'
var dateFormat = require('dateformat');

import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation';

import {
  RefreshControl,
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Image,
  ActivityIndicator,
  TouchableHighlight,
} from 'react-native';

const api = 'https://f1portal.herokuapp.com';
const today = new Date();

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
      dataSource: [],
      calendarJson: [],
      isLoading: true,
      refreshing: false,
    };

  }

  onNavigatorEvent(event) {
    if(event.id == 'tabSelected'){
          console.log('it is clicked')
    }
  }

  componentDidMount() {

    return fetch(api + '/get_schedule')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          calendarJson: responseJson,
          dataSource: responseJson.MRData.RaceTable.Races,
        });
      })
      .catch((error) => {
        console.error(error);
      });

  }

  raceInfoClick(raceInfo){
    console.log("Clicked on " + raceInfo.raceName);
  }

  scrollToLatest(){
    console.log("Scrollest to latest race");
    this.refs.flatlist.scrollToIndex({index: 10, animated: true});
  }

  renderRow(data) {

    var standingCell = data.item;
    var imageURL = standingCell.Circuit.imageURL;
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
      <TouchableHighlight onPress={() => this.raceInfoClick(standingCell)}>
        <Image
          style={local_styles.raceImage} 
          source={
            {uri: imageURL}
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
                  {dateFormat(raceDate, "mmmm dS")}
                </Text>
              </View>
            </View>
        </Image>
      </TouchableHighlight>
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
            Race Calendar
          </Text>
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <FlatList ref="flatlist"
            data={this.state.dataSource}
            renderItem={this.renderRow.bind(this)}
            getItemLayout={this.getItemLayout}
            keyExtractor={item => item.raceName}
          />
        </View>

        <ActionButton
         buttonColor="#FAFAFA"
         onPress={() => this.scrollToLatest()}
         icon={<Icon name="calendar-check-o" size={30} color="red" />}>
         >
        </ActionButton>
      </View>

    );
  }

  getItemLayout = (data, index) => (
    { length: 170, offset: 170 * index, index }
  )
}

var local_styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  raceImage: {
    width: Dimensions.get('window').width,
    height: 170,
  },
  elapsedRaceImageView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: Dimensions.get('window').width,
    backgroundColor: 'rgba(255,255,255,0.75)',
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
    textAlign: 'left',
    color: '#404040',
  },
  raceCircuitText: {
    paddingLeft: 15,
    fontSize: 12,
    textAlign: 'left',
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
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  raceDateTextView:{
    flex: 3,
    alignItems: 'flex-end',
  },


});
