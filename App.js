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

import {MyHeader, IconListHours, ContainerMapDetail} from './src/components';
// firebase
import {firebaseApp} from './common/FirebaseConfig';
import {dataConvertFromServer} from './common/myFunction';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowMap: true,
      listDay: [],
      fullData: [],
      // day detail
      dayDetail: [],
      selectDay: '',
    };
  }
  //

  componentDidMount() {
    //  lay tat ca cac du lieu xuong 1 lan
    firebaseApp
      .database()
      .ref('data')
      .once('value', snapshot => {
        // convert sang kieu du lieu minh mong muon
        let dataConvert = dataConvertFromServer(snapshot.val());
        let lengthFullData = dataConvert.fullData.length;
        this.setState({
          listDay: dataConvert.listDay,
          fullData: dataConvert.fullData,
          dayDetail: dataConvert.fullData[lengthFullData - 1],
          selectDay: dataConvert.listDay[lengthFullData - 1],
        });
      });
    //   lang nghe firebase voi du lieu ngay hien tai (ngay hom nay)
    // firebaseApp
    // .database()
    // .ref('data/'+getDayNow()+'/')
    // .on('value', snapshot => {
    //   console.log(snapshot.val());
    // });
  }

  //  select footer Map/Detail/...
  onTouchMap = () => {
    this.setState({
      isShowMap: true,
    });
  };
  //
  onTouchDetail = () => {
    this.setState({
      isShowMap: false,
    });
  };
  //Get selected day here
  sendSelected = day => {
    let {listDay, fullData} = this.state;
    let index = null;
    for (ind in listDay) {
      if (day.label == listDay[ind].label) index = ind;
    }
    this.setState({
      selectDay: day,
      dayDetail: fullData[index],
    });
  };

  render() {
    let {isShowMap, listDay, dayDetail, selectDay} = this.state;
    // console.log('TCL: App -> render -> dayDetail', dayDetail);
    // console.log('TCL: App -> render -> selectDay', selectDay);
    let Footer = (
      <IconListHours
        onTouchMap={this.onTouchMap}
        onTouchDetail={this.onTouchDetail}
        listDay={listDay}
        sendSelected={this.sendSelected}
      />
    );
    if (listDay[0] == null || listDay[0] == undefined) {
      Footer = (
        <Text style={{color: '#494b4c', marginHorizontal: 10}}>
          Đang kết nối với server !
        </Text>
      );
    }

    return (
      <Fragment>
        <SafeAreaView style={styles.safeAreaView}>
          <View style={styles.container}>
            <View style={styles.header}>
              <MyHeader />
            </View>

            <View style={styles.body}>
              <ContainerMapDetail 
                 isShowMap={isShowMap} 
                 dayDetail={dayDetail}
              />
            </View>
            <View style={styles.footer}>{Footer}</View>
          </View>
          {/*  */}
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

export default App;
