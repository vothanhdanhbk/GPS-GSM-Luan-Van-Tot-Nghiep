/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, Component} from 'react';
import Admin from './Admin';
import User from './User';
import SignUpPage from './../components/Login';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform,
} from 'react-native';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPage: 'login',
    };
  }
  onLogin = value => {
    this.setState({
      selectedPage:value
    })
  };
  render() {
    let {selectedPage}=this.state
    return (
      <Fragment>
        <SafeAreaView style={styles.safeAreaView}>
          {selectedPage=="admin"&&<Admin onLogin={this.onLogin}/>}
         {selectedPage=="user" &&<User onLogin={this.onLogin}/>}
         {selectedPage=="login"&& <SignUpPage onLogin={this.onLogin} />}
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    paddingTop: Platform.OS === 'Android' ? 25 : 0,
  },
});

export default App;
