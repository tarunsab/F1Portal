import React from 'react';
import {styles} from '../GlobalStyles.js'
import Tabs from 'react-native-tabs';
import CountDownTimer from '../OtherComponents/CountDownReact.js' 

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

          <View style={local_styles.pointsBox}>
            <View style={{flex: 1}}>

              {(this.state.sessionType !== 'race') && 
                <Text> {entryData.time} </Text>
              }

              {(this.state.sessionType === 'race') && 
                <Text> {entryData.timedelta.slice(0,7)} </Text>
              }

            </View>
            <View style={{flex: 1}}>

              {(this.state.sessionType !== 'race') && 
                <Text style={{textAlign: 'right', color: 'grey'}}> 
                  {entryData.timedelta} 
                </Text>
              }

              {(this.state.sessionType === 'race') && 
                <Text style={{textAlign: 'right', color: 'grey'}}> 
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
    var timesheet = this.state.dataSource[sessionCode].timesheet;
    if (timesheet === undefined) {
      sessionElapsed = false;
    }

    return (

      <View style={styles.container}>

        <View style={styles.tabHeader}>
          <Tabs selected={this.state.sessionType} style={{backgroundColor:'#F44336'}}
          selectedStyle={{color:'white'}} onSelect={el => this.changeSessionTabs(el)}>
          
          <Text name="fp">Practice</Text>
          <Text name="q">Qualifying</Text>
          <Text name="race">Race</Text>
          
          </Tabs>
        </View>

        {(this.state.sessionType !== 'race') &&

          <View style={styles.tabHeader}>
            <Tabs selected={this.state.sessionNum} style={{backgroundColor:'white'}}
            selectedStyle={{color:'red'}} onSelect={el => this.changeSessionNumTabs(el)}>
            
            <Text name="1">1</Text>
            <Text name="2">2</Text>
            <Text name="3">3</Text>
            
            </Tabs>
          </View>

        }

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>

          {(sessionElapsed) && 
            <FlatList ref="flatlist"
              data={timesheet}
              renderItem={this.renderRow.bind(this)}
              keyExtractor={item => item.name}
            />
          }

          {(!sessionElapsed) && 

            <View>
              <Text>
                {this.state.dataSource[sessionCode]}
              </Text>

              <CountDownTimer
                date={this.state.dataSource[sessionCode]}
                color='black'
              />
            </View>
          }
        </View>

      </View>
    );
  }
}

const local_styles = StyleSheet.create({
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