import React from 'react';

import {
  StackNavigator,
} from 'react-navigation';

import {
  WebView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {styles} from '../GlobalStyles.js'
import Tabs from 'react-native-tabs';
var raceName;
var raceJSON;

export default class RaceScreen extends React.Component {
  
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.race_name,
  });
  
  
  constructor(props) {
    super(props);
    
    raceName = this.props.navigation.state.params.race_name;
    raceJSON = this.props.navigation.state.params.race_json;
    
    this.state = {
      dataSource: [],
      calendarJson: [],
      isLoading: true,
      refreshing: false,
      sessionType: 'fp',
      sessionNum: '1',
    };
    
  }
  
  changeSessionTabs(event) {
    var nextPage = event.props.name;
    this.setState({sessionType: nextPage});
  }
  changeSessionNumTabs(event) {
    var nextPage = event.props.name;
    this.setState({sessionNum: nextPage});
  }
  
  render() {
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

      </View>
    );
  }
}

var local_styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
