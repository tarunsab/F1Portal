import React, {
    Component,
} from 'react';

import {
    StyleSheet,
    View,
    Text,
    Image,
} from 'react-native';

const styles = StyleSheet.create({
  cardItemTimeRemainTxt: {
    color: '#ee394b',
    textAlign: 'left',
  },
  text: {
    color: 'black',
    // color: 'white',
    // textShadowColor: 'black',
    // textShadowOffset: {width: 1, height: 1},
    // textShadowRadius: 3,
    fontSize: 13,
    // textAlign: 'left',
    alignSelf: 'flex-start',

  },
  container: {
    flexDirection: 'row',
  },
  defaultTime: {
    paddingHorizontal: 3,
    backgroundColor: 'rgba(85, 85, 85, 1)',
    marginHorizontal: 3,
    borderRadius: 2,
  },
  defaultColon: {
  }
});

class CountDown extends Component {
  static displayName = 'Simple countDown';
  static defaultProps = {
    date: new Date(),
    days: {
      plural: 'Days',
      singular: 'Day',
    },
    hours: ':',
    mins: ':',
    segs: ':',
    onEnd: () => {},

    containerStyle: styles.container,
    daysStyle: styles.defaultTime,
    hoursStyle: styles.defaultTime,
    minsStyle: styles.defaultTime,
    secsStyle: styles.defaultTime,
    firstColonStyle: styles.defaultColon,
    secondColonStyle: styles.defaultColon,

  };
  state = {
    days: 0,
    hours: 0,
    min: 0,
    sec: 0,
  };
  componentDidMount() {
    this.interval = setInterval(()=> {
      const date = this.getDateData(this.props.date);
      if (date) {
        this.setState(date);
      } else {
        this.stop();
        this.props.onEnd();
      }
    }, 1000);
  }
  componentWillMount() {
    const date = this.getDateData(this.props.date);
    if (date) {
      this.setState(date);
    }

  }
  componentWillUnmount() {
    this.stop();
  }
  getDateData(endDate) {
    let diff = (Date.parse(new Date(endDate)) - Date.parse(new Date)) / 1000;

    if (diff <= 0) {
      return false;
    }

    const timeLeft = {
      years: 0,
      days: 0,
      hours: 0,
      min: 0,
      sec: 0,
      millisec: 0,
    };

    if (diff >= (365.25 * 86400)) {
      timeLeft.years = Math.floor(diff / (365.25 * 86400));
      diff -= timeLeft.years * 365.25 * 86400;
    }
    if (diff >= 86400) {
      timeLeft.days = Math.floor(diff / 86400);
      diff -= timeLeft.days * 86400;
    }
    if (diff >= 3600) {
      timeLeft.hours = Math.floor(diff / 3600);
      diff -= timeLeft.hours * 3600;
    }
    if (diff >= 60) {
      timeLeft.min = Math.floor(diff / 60);
      diff -= timeLeft.min * 60;
    }
    timeLeft.sec = diff;
    return timeLeft;
  }
  render() {
    const countDown = this.state;
    let days;
    if (countDown.days === 1) {
      days = this.props.days.singular;
    } else {
      days = this.props.days.plural;
    }
    return (
       <View style={styles.container}>
         <Text style={styles.text}>{
           this.leadingZeros(countDown.days)    + "D: " 
           + this.leadingZeros(countDown.hours) + "H: "
           + this.leadingZeros(countDown.min)   + "M: "
         }</Text>
         <View style={{width: 1, paddingRight:40}}>
          <Text style={styles.text}>
           {this.leadingZeros(countDown.sec) + "S"}
          </Text> 
         </View>
       </View>
    
    );
  }
  stop() {
    clearInterval(this.interval);
  }
  leadingZeros(num, length = null) {

    let length_ = length;
    let num_ = num;
    if (length_ === null) {
      length_ = 2;
    }
    num_ = String(num_);
    while (num_.length < length_) {
      num_ = '0' + num_;
    }
    return num_;
  }
};

export default CountDown;