import React from 'react';

import {
  StyleSheet,
} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header:{
    backgroundColor: '#F5F5F5',
    // backgroundColor: '#E53935',
    paddingTop: 25,
    height: 60,
    flexDirection: 'row',
    alignContent: 'center',
  },
 tabHeader:{
    backgroundColor: '#F5F5F5',
    paddingTop: 32,
    paddingBottom: 19,
    flexDirection: 'row',
    alignContent: 'center',
    // alignSelf: 'flex-start',
    // borderBottomWidth: 1.5,
    // borderBottomColor: '#EEEEEE',
  },
  headerText:{
    color: '#F44336',
    // color: 'white',
    textAlign: 'center',
    fontWeight: 'normal',
    flex: 1,
    fontSize: 20,
  },
  icon: {
    width: 25,
    height: 25,
  },
});
