import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  AsyncStorage,
  ToastAndroid,
  ImageBackground,
  BackHandler,
} from 'react-native';
// import {
//   StackNavigator,
// } from 'react-navigation';

const background = require('./background.png');
const lockIcon = require('./ic_lock.png');
const userIcon = require('./ic_user.png');
const bkLogo = require('../../../common/img/bkLogo.png');
// admin
const userAdmin = 'admin';
const passAdmin = 'admin';
const userUser = 'user';
const passUser = 'user';

export default class SignUpPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: '',
      password: '',
      //   confirmPassword: '',
    };
  }
  componentWillMount() {
    // console.log('componentWillMount');
  }
  _onPressLogin(event) {
    let {userName, password} = this.state;
    if (userName == userAdmin && password == passAdmin) {
      this.props.onLogin('admin');
    } else if (userName == userUser && password == passUser) {
      this.props.onLogin('user');
    } else {
      alert('Thông tin đăng nhập không chính xác .');
    }
  }
  //   static navigationOptions = {
  //     title: 'Sign Up',
  //      header: null,
  //   };
  render() {
    //  var { navigate } = this.props.navigation;
    return (
      <ImageBackground
        style={[styles.container, styles.background]}
        source={background}>
        <View style={styles.container} />

        <View style={styles.wrapper}>
          <View style={styles.inputWrap}>
            <View style={styles.iconWrap}>
              <Image
                source={userIcon}
                resizeMode="contain"
                style={styles.icon}
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Username"
              onChangeText={userName => this.setState({userName})}
              underlineColorAndroid="transparent"
            />
          </View>

          <View style={styles.inputWrap}>
            <View style={styles.iconWrap}>
              <Image
                source={lockIcon}
                resizeMode="contain"
                style={styles.icon}
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={password => this.setState({password})}
              underlineColorAndroid="transparent"
            />
          </View>

          {/* <View style={styles.inputWrap}>
            <View style={styles.iconWrap}>
              <Image
                source={lockIcon}
                resizeMode="contain"
                style={styles.icon}
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={true}
              onChangeText={confirmPassword => this.setState({confirmPassword})}
              underlineColorAndroid="transparent"
            />
          </View> */}

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={this._onPressLogin.bind(this)}
            keyboardShouldPersistTaps={true}>
            <View style={styles.button}>
              <Text style={styles.buttonText}> Đăng nhập</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => BackHandler.exitApp()}>
            <View>
              <Text style={styles.forgotPasswordText}>Thoát</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* logo bach khoa here */}
        <Image
          source={bkLogo}
          // resizeMode="contain"
          style={{
            position: 'absolute',
            top: '10%',
            left: '34%',
            width: 125,
            height:125
          }}
        />
        <View style={styles.container} />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: null,
    height: null,
  },
  wrapper: {
    paddingHorizontal: 15,
  },
  inputWrap: {
    flexDirection: 'row',
    marginVertical: 5,
    height: 36,
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: '#FFF',
  },
  iconWrap: {
    paddingHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d73352',
  },
  icon: {
    width: 20,
    height: 20,
  },
  button: {
    backgroundColor: '#d73352',
    paddingVertical: 8,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  forgotPasswordText: {
    color: '#FFFFFF',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

module.exports = SignUpPage;
