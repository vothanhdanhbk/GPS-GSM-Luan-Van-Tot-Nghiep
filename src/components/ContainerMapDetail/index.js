import React, {Component, Fragment} from 'react';
import Map from './Map';
import Detail from './Detail'
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
    console.log("TCL: ContainerMapDetail -> render -> dayDetail", dayDetail)
    //   
    let {isShowMap} = this.props;
    let showMap = <Map/>;
    if (!isShowMap) showMap = <Detail/>;

    return (
      <Fragment>
        {showMap}
      </Fragment>
    );
  }
}
