import React from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Icon} from 'react-native-elements';
import MapView, {Marker, Polyline, ProviderPropType} from 'react-native-maps';
import {getDataGo} from './../../../../common/myFunction';
import car from './assets/car.png';
import finish from './assets/finish.png';
const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 10.804366049999999;
const LONGITUDE = 106.63990885;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const otoX = 0.057;
const motoX = 0.017;
const truckX = 0.17;
class MapUser extends React.Component {
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
      dataGo: {
        pointWay: [],
        start_location: {lat: LATITUDE, lng: LONGITUDE},
        end_location: {lat: LATITUDE, lng: LONGITUDE},
        pointInfor: {latitude: LATITUDE, longitude: LONGITUDE},
        start_address: '',
        end_address: '',
        distance: '',
        duration: '',
      },
      isShowPopUp: false,
      iconSelected: 2,
      xangX: motoX,
    };
  }
  componentDidMount() {
    // find your origin and destination point coordinates and pass it to our method.
    // I am using Bursa,TR -> Istanbul,TR for this example
    this.getDirections(
      ' 10.804366049999999, 106.63990885',
      ' 10.804466049999999,106.64990885',
    );
    // this.getDirections(
    //   '34-nhat-chi-mai-quan-tan-binh-hcm',
    //   'dai-hoc-bach-khoa-hcm-quan-10',
    // );
  }

  async getDirections(startLoc, destinationLoc) {
    try {
      let resp = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=AIzaSyDhPujSPGQEPULDAKE1z8HYsScYlq1F4ZA`,
      );
      let respJson = await resp.json();
      // console.log("TCL: MapUser -> getDirections -> respJson", respJson.routes[0].legs[0])
      let dataGo = getDataGo(respJson.routes[0].legs[0]);
      // console.log("TCL: MapUser -> getDirections -> dataGo", dataGo)
      this.setState({
        region: {
          latitude: dataGo.pointWay[0].latitude,
          longitude: dataGo.pointWay[0].longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        dataGo: dataGo,
      });
    } catch (error) {
      alert(error);
      return error;
    }
  }
  //
  showInfor = () => {
    this.setState({
      isShowPopUp: !this.state.isShowPopUp,
    });
  };
  //
  // set icon
  setIcon = (iconSelected, xangX) => {
    this.setState({
      iconSelected: iconSelected,
      xangX: xangX,
    });
  };
  //  close popup
  closePopUp = () => {
    this.setState({
      isShowPopUp: false,
    });
  };
  //

  chechShowPopUp = (isShowPopUp, dataGo, quangduong) => {
    let result = null;
    if (isShowPopUp) {
      result = (
        <View style={[styles.popUp]}>
          <Text style={[styles.pupUpText,{paddingTop:3}]}>
            Quãng đường đi:
            <Text style={{color: '#d41919d6'}}>
               {dataGo.distance} {`             `}
            </Text>
            Thời gian đi:
            <Text style={{color: '#d41919d6'}}> {dataGo.duration}</Text>
          </Text>
          <Text style={styles.pupUpText}>
            Lượng xăng tiêu thụ :
            <Text style={{color: '#d41919d6'}}>
               {(quangduong * this.state.xangX).toFixed(1)} (lit)
            </Text>
          </Text>
          <Text style={styles.pupUpText}>
            Vị trí cần đến :{' '}
            <Text style={{color: '#d41919d6'}}>{dataGo.end_address}</Text>
          </Text>
          <Text style={styles.pupUpText}>
            Lời nhắn :{' '}
            <Text style={{color: '#d41919d6'}}>Đến nơi xin gọi điện vào số :0963226771 để biết thêm thong tin .</Text>
          </Text>

          <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
            <TouchableOpacity
              onPress={() => this.setIcon(1, otoX)}
              style={{marginLeft: '25%'}}>
              <Icon
                name="directions-car"
                containerStyle={[
                  styles.icon,
                  this.state.iconSelected == 1 ? {borderWidth: 2} : {},
                ]}
                iconStyle={[
                  this.state.iconSelected == 1
                    ? {color: '#3f6eb7'}
                    : {color: '#6b6666'},
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setIcon(2, motoX)}>
              <Icon
                name="motorcycle"
                containerStyle={[
                  styles.icon,
                  this.state.iconSelected == 2 ? {borderWidth: 2} : {},
                ]}
                iconStyle={[
                  this.state.iconSelected == 2
                    ? {color: '#3f6eb7'}
                    : {color: '#6b6666'},
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setIcon(3, truckX)}>
              <Icon
                name="truck"
                type="font-awesome"
                iconStyle={[
                  {transform: [{rotateY: '180deg'}]},
                  [
                    this.state.iconSelected == 3
                      ? {color: '#3f6eb7'}
                      : {color: '#6b6666'},
                  ],
                ]}
                containerStyle={[
                  styles.icon,
                  this.state.iconSelected == 3 ? {borderWidth: 2} : {},
                ]}
              />
            </TouchableOpacity>
            <View style={styles.close}>
              <TouchableOpacity onPress={() => this.closePopUp()}>
                <Icon name="close"></Icon>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
    return result;
  };

  //
  render() {
    let {dataGo, isShowPopUp} = this.state;
    console.log('TCL: MapUser -> render -> dataGo', dataGo);
    let quangduong =
      dataGo.distance[0] + dataGo.distance[1] + dataGo.distance[2] + '';
    quangduong = Number(quangduong);
    let showPopUp = this.chechShowPopUp(isShowPopUp, dataGo, quangduong);

    return (
      // <Text>null</Text>
      <View style={styles.wapper}>
        <MapView
          provider={this.props.provider}
          style={styles.container}
          initialRegion={this.state.region}
          mapType={'standard'}>
          {/*  duong di */}
          <Polyline
            coordinates={dataGo.pointWay}
            strokeColor="#0e3ec7d6"
            strokeWidth={4}
          />
          {/* hien thi diem Ket thuc */}
          <Marker
            coordinate={{
              latitude: dataGo.end_location.lat,
              longitude: dataGo.end_location.lng,
            }}
            title={dataGo.end_address}
            // description={"description"}
            // image={finish}
          >
            <Image
              style={{width: 35, height: 35, opacity: 0.8}}
              source={finish}
            />
          </Marker>
          {/* hien thi diem bat dau */}
          <Marker
            coordinate={{
              latitude: dataGo.start_location.lat,
              longitude: dataGo.start_location.lng,
            }}
            title={dataGo.start_address}
            image={car}></Marker>
          {/* hien thi thong tin */}
          <Marker
            coordinate={{
              latitude: dataGo.pointInfor.latitude,
              longitude: dataGo.pointInfor.longitude,
            }}
            // title={`Quãng đường sẽ đi: ${dataGo.distance}`}
            // description={`Thời gian ước tính : ${dataGo.duration}`}
            onPress={this.showInfor}>
            <Text style={styles.text}>[...]</Text>
          </Marker>
        </MapView>
        {showPopUp}
      </View>
    );
  }
}

MapUser.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  wapper: {
    flex: 1,
    position: 'relative',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  text: {
    backgroundColor: '#22e416ad',
    color: '#d41919d6',
    padding: 3,
    borderWidth: 2,
    borderColor: '#2c2f2ca1',
    borderRadius: 5,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  popUp: {
    backgroundColor: '#22e416ad',
    position: 'absolute',
    bottom: 0,
    left: '5%',
    width: '90%',
  },
  pupUpText: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 1,
  },
  icon: {
    marginLeft: 20,
    // borderWidth:2,
    borderColor: '#6483b3',
    padding: 2,
  },
  close: {
    position: 'absolute',
    top: -100,
    right: 0,
  },
});

export default MapUser;
