import React, {Component, Fragment} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {Icon} from 'react-native-elements';

export default class MyHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  //

  render() {
    let {isVisible,dayData,daySelected} = this.state;
    return (
      <Fragment>
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
        
          </View>
          <View style={styles.headerCenter}>
            <Text style={{textAlign: 'center', color: '#e5ddeb'}}>
              GSM giám sát vị trí của thiết bị
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Icon name="exit-to-app" color="#e5ddeb" />
          </View>
        </View>
        {/*  */}

      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#344955',
  },
  headerLeft: {
    flex: 2,
  },
  headerCenter: {
    flex: 8,
  },
  headerRight: {
    flex: 2,
  },
});
