import React from 'react';
import {styles} from '../GlobalStyles.js'
import Tabs from 'react-native-tabs';
import CountDownTimer from '../OtherComponents/CountDownReact.js' 
import dateFormat from 'dateformat';

import {
  StackNavigator,
} from 'react-navigation';

import {
  WebView,
  StyleSheet,
  Text,
  FlatList,
  View,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

var raceName;
var raceJSON;
const api = 'https://f1portal.herokuapp.com';

export default class RaceScreen extends React.Component {
  
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.race_name,
  });
  
  
  constructor(props) {
    super(props);
    
    raceName = this.props.navigation.state.params.race_name;
    raceJSON = this.props.navigation.state.params.race_json;

    this.state = {
      isLoading: true,
      dataSource: [],
      sessionType: 'fp',
      sessionNum: '1',
    };
    
  }

  componentDidMount() {
    return fetch(api + '/get_results/' + raceJSON.season 
    + '/' + raceJSON.Circuit.Location.country)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataSource: responseJson,
          sessionType: responseJson['latestSessionType'],
          sessionNum: responseJson['latestSessionNum'],
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  changeSessionTabs(event) {
    var nextPage = event.props.name;
    this.setState({sessionType: nextPage});
  }

  changeSessionNumTabs(event) {
    var nextPage = event.props.name;
    this.setState({sessionNum: nextPage});
  }

  renderHeader() {
    return (
     <View style={local_styles.header}>

          <View style={local_styles.standingsOrder}>
            <Text style={local_styles.headerText}> #</Text>
          </View>

          <View style={local_styles.standingsNameBox}>
            <Text style={local_styles.headerText}> Driver</Text>
          </View>

          <View style={[local_styles.pointsBox, {flex: 0.8}]}>

            <View style={{flex: 1}}>
              <Text style={local_styles.headerText}> Time</Text>
            </View> 

            <View style={{flex: 1, paddingLeft: 10}}>

              {(this.state.sessionType !== 'race') && 
                <Text style={local_styles.headerText}> Diff</Text>
              }

              {(this.state.sessionType === 'race') && 
                <Text style={local_styles.headerText}>Points</Text>
              }

            </View>

          </View>
      </View>
    )
  }

  renderRow(data) {
      var entryData = data.item;
      var entryBackground;

      if ((parseInt(entryData.position) % 2) === 0) {
        entryBackground = 'white'
      } else {
        entryBackground = 'rgb(248,248,248)'
      }

      return (
        <View style={[local_styles.listElem, {backgroundColor: entryBackground,
           height: 55}]}>

          <View style={local_styles.standingsOrder}>
            <Text> {entryData.position} </Text>
          </View>

          <View style={local_styles.standingsNameBox}>
            <Text> {entryData.name} </Text>
          </View>

          <View style={[local_styles.pointsBox, {flex: 0.8}]}>
            <View style={{flex: 1}}>

              {(this.state.sessionType !== 'race') && 
                <Text> {entryData.time} </Text>
              }

              {(this.state.sessionType === 'race') && 
                <Text> {entryData.timedelta.slice(0,7)} </Text>
              }

            </View>
            <View style={{flex: 1, paddingLeft: 10}}>

              {(this.state.sessionType !== 'race') && 
                <Text style={{color: 'grey'}}> 
                  {entryData.timedelta} 
                </Text>
              }

              {(this.state.sessionType === 'race') && 
                <Text style={{color: 'grey'}}> 
                  {entryData.pointsGained} 
                </Text>
              }

            </View>
          </View>

        </View>

      );
  }
  
  render() {

    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator />
        </View>
      );
    }

    //e.g. converting sessionType "fp" and sessionNum "3" to sessionCode "fp3"
    var sessionCode = this.state.sessionType 
    if (sessionCode !== 'race') {
      sessionCode += this.state.sessionNum;
    }

    var sessionElapsed = true;
    var raceDatePaddingTop = 70;
    var timesheet = this.state.dataSource[sessionCode].timesheet;
    if (timesheet === undefined) {
      sessionElapsed = false;
      var raceDate = new Date(this.state.dataSource[sessionCode]);

      //Compensating for missing session number picker tab e.g. 1,2 or 3 for fp/q
      //in the race tab
      if (sessionCode === 'race') {
        raceDatePaddingTop += 52.5;
      }
    }


    return (

      <View style={styles.container}>

        <View style={styles.tabHeader}>
          <Tabs selected={this.state.sessionType} style={{backgroundColor:'white'}}
          selectedStyle={{color:'red'}} onSelect={el => this.changeSessionTabs(el)}>
          
          <Text name="fp">Practice</Text>
          <Text name="q">Qualifying</Text>
          <Text name="race">Race</Text>
          
          </Tabs>
        </View>

        {(this.state.sessionType !== 'race') &&

          <View style={styles.tabHeader}>
            <Tabs selected={this.state.sessionNum} style={{backgroundColor:'#F44336'}}
            selectedStyle={{color:'white'}} onSelect={el => this.changeSessionNumTabs(el)}>
            
            <Text name="1">1</Text>
            <Text name="2">2</Text>
            <Text name="3">3</Text>
            
            </Tabs>
          </View>

        }

        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: 'white'}}>

          {(sessionElapsed) &&
            <View>
              {this.renderHeader()}
              <FlatList ref="flatlist"
                data={timesheet}
                renderItem={this.renderRow.bind(this)}
                keyExtractor={item => item.name}
              />
            </View>
          }

          {(!sessionElapsed) && 

            <View style={{flexDirection: 'column'}}>

              <View style={{paddingTop: raceDatePaddingTop, paddingBottom: 70}}>
                <Text style={{fontSize: 20}}>
                  {dateFormat(raceDate, "dddd mmmm dS h:MMTT")}                  
                </Text>
              </View>

              <View style={{backgroundColor: '#F44336', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', padding: 15, 
              width: 250, height: 75}}>
                  <CountDownTimer
                    date={this.state.dataSource[sessionCode]}
                    color='white'
                    fontSize='20'
                    shadow='true'
                    height="40"
                    width="200"
                    showSeconds='true'
                  />
              </View>
            </View>
          }
        </View>

      </View>
    );
  }
}

const local_styles = StyleSheet.create({
  header:{
    width: Dimensions.get('window').width,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1.5,
    backgroundColor: 'rgb(63, 63, 63)',
    alignItems: 'flex-start',
  },
  headerText:{
    color: '#E0E0E0',
  },
  listElem:{
    width: Dimensions.get('window').width,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    alignItems: 'flex-start'
  },
  pointsBox:{
    flex: 0.63,
    alignItems: 'flex-end',
    flexDirection: 'row'
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