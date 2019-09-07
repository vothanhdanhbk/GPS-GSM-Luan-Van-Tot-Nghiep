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
    };
  }
  //
  componentDidMount() {
let listDay=this.props.listDay;
    this.setState({
      listDay: listDay,
      selectDay: listDay[listDay.length-1].label,
    });
  }
  //

  // map
  onTouchMap = () => {
    this.props.onTouchMap();
    this.setState({
      isOnMap: true,
    });
  };
  // detail
  onTouchDetail = () => {
    this.props.onTouchDetail();
    this.setState({
      isOnMap: false,
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
    this.props.sendSelected(day)
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
          <View style={styles.selectOptions}>
            {/* day */}
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
                  {/* Day */}
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
          </View>
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
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  //  ==>
  selectOptions: {
    flex: 12,
    // backgroundColor: 'red',
    flexDirection: 'column',
    marginLeft:10
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
});
