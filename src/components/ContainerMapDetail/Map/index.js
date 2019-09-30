import React, {Component, Fragment} from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';

import MapView, {Marker, Polyline, ProviderPropType} from 'react-native-maps';
import flagPinkImg from './assets/car.png';
import {COnvertToPolyline, getPosition} from '../../../../common/myFunction';
const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 10.804366049999999;
const LONGITUDE = 106.63990885;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      lineMap: '',
      isDateTimePickerVisible: false,
      // search
      timeSelecteValue: 0,
      isShowLocationSearch: false,
      date: '  _____',
    };
  }

  showDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: true});
  };

  hideDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: false});
  };

  handleDatePicked = date => {
    // alert("A date has been picked: "+(date.getHours()*60+date.getMinutes()));
    this.setState({
      isDateTimePickerVisible: false,
      timeSelecteValue: date.getHours() * 60 + date.getMinutes(),
      date: date.getHours() + ':' + date.getMinutes(),
      isShowLocationSearch: true,
    });
    setTimeout(() => {
      this.setState({
        timeSelecteValue: 0,
        isShowLocationSearch: false,
        date: '  _____',
      });
    }, 120000);
  };

  render() {
    // let {lineMap} = this.state;
    let {data} = this.props;
    let count = 1;
    // console.log('TCL: Map -> reder -> xxxxxxx', data);
    let result1 = [];
    for (let i in data) {
      //  xu ly dy chuyen
      if (data[i].title == 'Di chuyển') {
        const dataCOnvertToPolyline = COnvertToPolyline(
          data[i].detail,
          data,
          i,
        );
        result1.push(
          <Polyline
            coordinates={dataCOnvertToPolyline}
            strokeColor="#3748b8"
            strokeWidth={4}
            key={i}
          />,
        );
      }
      //  xu ly dung
      if (data[i].title == 'Dừng') {
        result1.push(
          <Marker
            coordinate={{
              latitude: data[i].detail[0].lat,
              longitude: data[i].detail[0].long,
            }}
            title={data[i].time}
            description={data[i].description}
            // image={flagPinkImg}
            key={i}
            // onPress={this.getLocationFromMap}
          >
            <View style={styles.icon}>
              <Text style={styles.text}>{count}</Text>
              <Image style={styles.img} source={flagPinkImg} />
            </View>
          </Marker>,
        );
        count++;
      }
    }
    // xu ly hien vi tri khi da cos timeSelecteValue
    let {timeSelecteValue, isShowLocationSearch} = this.state;
    let showLocal = [];
    if (isShowLocationSearch) {
      let position = getPosition(timeSelecteValue, data);
      // console.log('TCL: Map -> render -> position', position);
      showLocal.push(
        <Marker
          coordinate={position.position}
          title={`${this.state.date} ==> ${position.title}`}
          description={position.description}>
          <View style={{
            width:12,
            height:12,
            borderRadius:12,
            backgroundColor:"red"
            }}>

          </View>
        </Marker>,
      );
    }

    return (
      // <Text>null</Text>
      <View style={{flex: 1, position: 'relative'}}>
        <MapView
          provider={this.props.provider}
          style={styles.container}
          initialRegion={this.state.region}
          // mapType={"hybrid"}
          mapType={'standard'}>
          {result1}
          {showLocal}
        </MapView>
        <View
          style={{
            position: 'absolute',
            top: 150,
            right: 20,
            // backgroundColor: 'blue',
          }}>
          {/* nut tim thoi gian */}
          <TouchableOpacity onPress={this.showDateTimePicker}>
            <Icon
              name="search"
              containerStyle={{
                margin: 5,
                borderWidth: 1,
                borderRadius: 5,
              }}
            />
          </TouchableOpacity>
          <Text style={{fontSize: 10, color: '#FA8072'}}>
            {`  ${this.state.date}`}
            {/* (date.getHours()*60+date.getMinutes()) */}
          </Text>
        </View>
        {/* modal selected time */}
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          mode={'time'}
          timePickerModeAndroid={'spinner'}
          is24Hour={true}
        />
      </View>
    );
  }
}

Map.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  icon: {
    // backgroundColor: "#550bbc",
    padding: 0,
    // borderRadius: 5,
  },
  text: {
    color: 'red',
    fontWeight: 'bold',
  },
  img: {
    width: 15,
    height: 15,
  },
});

export default Map;
