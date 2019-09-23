import React, {Component, Fragment} from 'react';
import bkLogo2 from '../../../common/img/bkLogo2.png';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  // BackHandler
} from 'react-native';

import {Icon} from 'react-native-elements';

export default class MyHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  //

  render() {
    let {isVisible, dayData, daySelected} = this.state;
    let {isAdmin} = this.props;
    return (
      <Fragment>
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Image
              style={{
                width: 30,
                height: 30,
                marginLeft: 10,
              }}
              source={bkLogo2}
            />
          </View>
          <View style={styles.headerCenter}>
            <Text style={{textAlign: 'center', color: '#black'}}>
              GSM giám sát vị trí phương tiện
            </Text>
          </View>
          <View style={[styles.headerRight, {flexDirection: 'row'}]}>
            <Text style={{marginTop: 5, fontSize: 12, color: '#black'}}>
              {!isAdmin ? 'User ' : 'Admin '}{' '}
            </Text>
            <TouchableOpacity onPress={()=> this.props.onLogin("login")}>
              <Icon name="exit-to-app" color="#black" />
            </TouchableOpacity>
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
    // backgroundColor: '#344955',
    backgroundColor: '#FF7F50',
  },
  headerLeft: {
    flex: 1,
  },
  headerCenter: {
    flex: 8,
  },
  headerRight: {
    flex: 2,
  },
});
