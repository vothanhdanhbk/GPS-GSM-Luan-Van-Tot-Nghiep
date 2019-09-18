import React, {Component, Fragment} from 'react';
import Map from './Map';
import Detail from './Detail'
import {convertDataDetail,convertDataToTimeList} from "./../../../common/myFunction"

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StatusBar,
} from 'react-native';
export default class ContainerMapDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let {dayDetail}=this.props;

      let data =convertDataToTimeList(convertDataDetail(dayDetail))
      // console.log("TCL: ContainerMapDetail -> render -> data", data)

    
    //   
    let {isShowMap} = this.props;
    let showMap = <Map data={data}/>;
    if (!isShowMap) showMap = <Detail data={data}/>;

    return (
      <Fragment>
        {showMap}
      </Fragment>
    );
  }
}
