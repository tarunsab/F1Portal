import React from 'react';

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

import {styles} from '../GlobalStyles.js'
import Tabs from 'react-native-tabs';
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
      return (
        <View style={local_styles.listElem}>

          <View style={local_styles.standingsOrder}>
            <Text> {entryData.position} </Text>
          </View>

          <View style={local_styles.standingsNameBox}>
            <Text> {entryData.name} </Text>
          </View>

          <View style={local_styles.pointsBox}>
            <Text> {entryData.time} </Text>
            <Text style={{textAlign: 'right'}}> {entryData.timedelta} </Text>
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
    var sessionCode = this.state.sessionType + this.state.sessionNum;

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
            <Tabs selected={this.state.sessionNum} //style={{backgroundColor:'#EEEEEE'}}
            selectedStyle={{color:'red'}} onSelect={el => this.changeSessionNumTabs(el)}>
            
            <Text name="1">1</Text>
            <Text name="2">2</Text>
            <Text name="3">3</Text>
            
            </Tabs>
          </View>

        }

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
          <FlatList ref="flatlist"
            data={this.state.dataSource[sessionCode].timesheet}
            renderItem={this.renderRow.bind(this)}
            keyExtractor={item => item.name}
          />
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
    flex: 1,
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