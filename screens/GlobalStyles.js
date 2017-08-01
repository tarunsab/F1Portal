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
    // backgroundColor: 'blue',
    paddingTop: 25,
    paddingBottom: 20,
    flexDirection: 'row',
    alignContent: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#EEEEEE',
  },
  headerText:{
    color: '#F44336',
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
