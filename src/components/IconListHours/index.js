import React, {Component, Fragment} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StatusBar,
  Picker,
} from 'react-native';

import {Icon} from 'react-native-elements';
import ModalSelector from 'react-native-modal-selector';

export default class IconListHours extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOnMap: true,
      isVisible: false,

      listDay: [],
      selectDay: '',
      selected:2
    };
  }
  //
  componentDidMount() {
    let listDay = this.props.listDay;
    this.setState({
      listDay: listDay,
      selectDay: listDay[listDay.length - 1].label,
    });
  }
  //

  // map
  onTouchMap = () => {
    this.props.choose(2);
    this.setState({
      selected: 2,
    });
  };
  // detail
  onTouchDetail = () => {
    this.props.choose(3);
    this.setState({
      selected: 3,
    });
  };
  // detail
  onTouchLocation = () => {
    this.props.choose(1);
    this.setState({
      selected: 1,
    });
  };
  //  option Day
  //
  onPressDay = () => {
    this.setState({
      isVisible: true,
    });
  };
  //
  onModalClose = () => {
    this.setState({
      isVisible: false,
    });
  };
  //get day here

  onChangSelectModal = day => {
    this.props.sendSelected(day);
    this.setState({selectDay: day.label});
  };
  // option hours
  // get hours here
  // getHours = itemValue => {
  //   this.setState({selectHours: itemValue});

  // };
  //
  render() {
    let {isOnMap, hoursData, listDay, isVisible, selectDay} = this.state;
    return (
      <Fragment>
        <View style={styles.listHoursContainer}>
          <View style={{flexDirection: 'row',position:"relative"}}>
            <Text>Ngày giám sát :</Text>
            <TouchableOpacity onPress={this.onPressDay}>
              <View
                style={{
                  flex: 1,
                  paddingLeft: 20,
                  marginLeft:3,
                  width: 150,
                  borderRadius: 5,
                  backgroundColor: '#c7c7bede',
                }}>
                <Text style={{color: 'blue'}}>{selectDay}</Text>
                <Icon
                  name="arrow-drop-down"
                  color="#5b5e5c"
                  containerStyle={{marginTop: -20, marginLeft: 80}}
                />
              </View>
            </TouchableOpacity>
            {this.state.selected==1&&(<View style={{
              position:"absolute",
              top:0,
              left:-10,
              width:"120%",
              height:20,
              backgroundColor:"#d6ceceb5"
            }}></View>)}
          </View>
          <View style={{flexDirection: 'row',marginTop:6,paddingLeft:"12%"}}>
            <TouchableOpacity onPress={this.onTouchLocation}>
              <Icon
                name="location-searching"
                color={this.state.selected==1?"green":"#5b5e5c"}
                containerStyle={[{paddingHorizontal:25},this.state.selected==1?styles.borderIcon:{}]}
                iconStyle={{fontSize: 28}}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onTouchMap}>
              <Icon
                name="map"
                color={this.state.selected==2?"green":"#5b5e5c"}
                iconStyle={{fontSize: 28}}
                containerStyle={[{marginLeft:30,paddingHorizontal:25},,this.state.selected==2?styles.borderIcon:{}]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onTouchDetail}>
              <Icon
                name="list"
                color={this.state.selected==3?"green":"#5b5e5c"}
                iconStyle={{fontSize: 28}}
                containerStyle={[{marginLeft:30,paddingHorizontal:25},,this.state.selected==3?styles.borderIcon:{}]}
              />
            </TouchableOpacity>
          </View>
          {/* <View style={styles.selectOptions}>
            <View style={styles.day}>
              <View style={styles.selectLeft}>
                <Text style={{fontSize: 12, marginTop: 5}}>
                  Ngày quan sát :
                </Text>
              </View>
              <View
                style={[
                  styles.selectRight,
                  {marginLeft: 17, marginTop: 4, flexDirection: 'row'},
                ]}>
                <View style={{flex: 8}}>
                  <View style={{flex: 1, fontWeight: '800'}}>
                    <TouchableOpacity onPress={this.onPressDay}>
                      <Text>{selectDay}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{flex: 2, marginRight: 32}}>
                  <TouchableOpacity onPress={this.onPressDay}>
                    <Icon name="arrow-drop-down" color="#5b5e5c" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.map}>
            <TouchableOpacity onPress={this.onTouchMap}>
              <Text style={!isOnMap ? {color: '#676e69'} : {}}>Map</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.detail}>
            <TouchableOpacity onPress={this.onTouchDetail}>
              <Text style={isOnMap ? {color: '#676e69'} : {}}>Detail</Text>
            </TouchableOpacity>
          </View> */}
        </View>
        {/* modal */}
        <ModalSelector
          data={listDay}
          visible={isVisible}
          onModalClose={this.onModalClose}
          onChange={day => this.onChangSelectModal(day)}
          optionContainerStyle={{width: '60%'}}
          overlayStyle={{alignItems: 'center'}}
          cancelContainerStyle={{width: '60%', marginLeft: '20%'}}
        />
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  listHoursContainer: {
    // flexDirection: 'row',
    width: '100%',
    height: '100%',
    // alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  //  ==>
  selectOptions: {
    flex: 12,
    // backgroundColor: 'red',
    flexDirection: 'column',
    marginLeft: 10,
  },
  day: {
    // backgroundColor: 'blue',
    marginBottom: 5,
    flexDirection: 'row',
  },
  // hours: {
  //   flexDirection: 'row',
  // },
  selectLeft: {
    flex: 5,
    // backgroundColor: 'green',
  },
  selectRight: {
    flex: 8,
    flexDirection: 'row',
  },
  // <==
  map: {
    flex: 2,
    marginLeft: 5,
  },
  detail: {
    flex: 2,
  },
  borderIcon:{
    backgroundColor:"#66666685",
    borderWidth:1,
    borderColor:"#8e7d7d96"

  }
});
