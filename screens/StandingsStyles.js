import React from 'react';

import {
  StyleSheet,
  Dimensions,
} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listHeader:{
    backgroundColor: '#F5F5F5',
    paddingTop: 25,
    paddingBottom: 20,
    flexDirection: 'row',
    alignContent: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#EEEEEE',
  },
  listHeaderText:{
    color: '#F44336',
    textAlign: 'center',
    fontWeight: 'normal',
    flex: 1,
    fontSize: 20,
  },
  listElem:{
    width: Dimensions.get('window').width,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 30,
    paddingRight: 30,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    alignItems: 'flex-start'
  },
  pointsBox:{
    flex: 1,
    alignItems: 'flex-end'
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
  icon: {
    width: 25,
    height: 25,
  },
});
