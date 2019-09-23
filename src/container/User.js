/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform,
} from 'react-native';

import {MyHeader, IconListHours, ContainerMapDetail} from '../components';
import MapUser from './../components/ContainerMapUser/MapUser';
// firebase
// import {firebaseApp} from '../../common/FirebaseConfig';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  //

  // componentDidMount() {
  //   //   lang nghe firebase voi du lieu ngay hien tai (ngay hom nay)
  //   firebaseApp
  //     .database()
  //     .ref('adminSet')
  //     .on('value', snapshot => {
  //       if (snapshot.val().location != '') {
  //         alert(snapshot.val().location);
  //         alert(snapshot.val().message);
  //       }
  //     });
  // }
  //
  // onSent = (inputAdressValue, inputMessageValue) => {
  //   firebaseApp
  //     .database()
  //     .ref('adminSet')
  //     .set({
  //       location: inputAdressValue,
  //       message: inputMessageValue,
  //     });
  // };

  render() {
    return (
      <Fragment>
        {/* <SafeAreaView style={styles.safeAreaView}> */}
        <View style={styles.container}>
          <View style={styles.header}>
            <MyHeader isAdmin={false} onLogin={()=>this.props.onLogin("login")}/>
          </View>

          <View style={styles.body}>
            <MapUser isAdmin={false}/>
          </View>
          {/* <View style={styles.footer}><Text>Footer</Text></View> */}
        </View>
        {/*  */}
        {/* </SafeAreaView> */}
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  // safeAreaView: {
  //   flex: 1,
  //   paddingTop: Platform.OS === 'Android' ? 25 : 0,
  // },
  container: {
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  // header
  header: {
    flex: 2,
    backgroundColor: '#c9a959',
  },
  // body : map || detail information
  body: {
    flex: 28,
    width: '100%',
    height: '100%',
  },
  // Show menu
  footer: {
    flex: 2,
    backgroundColor: '#B2A198',
  },
});

export default User;
