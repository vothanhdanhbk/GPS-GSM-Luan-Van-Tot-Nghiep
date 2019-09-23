import React from 'react';
import {firebaseApp} from '../../../../common/FirebaseConfig';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import MapView, {Marker, Polyline, ProviderPropType} from 'react-native-maps';
import {
  getDataGo,
  getDayNow,
  convertDeg,
} from './../../../../common/myFunction';
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
        start_location: {lat: 76.661599, lng: 105.710462},
        end_location: {lat: 76.661599, lng: 105.710462},
        pointInfor: {latitude: 76.661599, longitude: 105.710462},
        start_address: '',
        end_address: '',
        distance: '',
        duration: '',
      },
      isShowPopUp: false,
      iconSelected: 2,
      xangX: motoX,
      isTogleButtonSearch: false,
      inputAdressValue: '',
      inputMessageValue: '',
      //
      adminSetState: {
        location: '',
        message: '',
      },
      newLocaionState: ['', ''],
      isCheckedComplete:false
    };
  }
  componentDidMount() {
    // find your origin and destination point coordinates and pass it to our method.
    // I am using Bursa,TR -> Istanbul,TR for this example
    // this.getDirections(
    //   ' 10.804366049999999, 106.63990885',
    //   ' 10.804466049999999,106.64990885',
    // );
    // this.getDirections(
    //   '34-nhat-chi-mai-quan-tan-binh-hcm',
    //   'dai-hoc-bach-khoa-hcm-quan-10',
    // );
    //   lang nghe firebase voi du lieu ngay hien tai (ngay hom nay)

    firebaseApp
      .database()
      .ref('data/' + getDayNow())
      .on('value', snapshot => {
        // console.log(
        //   'TCL: MapUser -> componentDidMount -> snapshot.val(xxxxxxx)',
        //   snapshot.val(),
        // );
        let dataServer = snapshot.val();
        let arrayDataServer = [];
        Object.keys(dataServer).forEach(key => {
          arrayDataServer.push(key);
        });
        // console.log(
        //   'TCL: MapUser -> componentDidMount -> arrayDataServer',
        //   arrayDataServer,
        // );
        let adminSet = dataServer.adminSet;
        let newLocaion = [
          dataServer[arrayDataServer[arrayDataServer.length - 2]].locations[0],
          dataServer[arrayDataServer[arrayDataServer.length - 2]].locations[1],
        ];
        // console.log(
        //   'TCL: MapUser -> componentDidMount -> newLocaion',
        //   newLocaion,
        // );
        //  co duoc yeu cau cua admin va vi tri moi nhat cua car roi gio xu ly thoi
        let {adminSetState, newLocaionState} = this.state;
        if (
          newLocaionState[0] != newLocaion[0] ||
          newLocaionState[1] != newLocaion[1]
        ) {
          this.setState({
            newLocaionState: newLocaion,
          });
        }
        if (
          adminSetState.location != adminSet.location ||
          (adminSetState.location == adminSet.location &&
            adminSetState.message != adminSet.message)
        ) {
          this.setState({
            adminSetState: adminSet,
          });
          if (adminSet.location != '') {
            this.getDirections(
              convertDeg(newLocaion[0]) + ',' + convertDeg(newLocaion[1]),
              adminSet.location.replace(/ /g, '-'),
            );
            // console.log(
            //   'TCL: MapUser -> componentDidMount -> newLocaion[0]+',
            //   '+newLocaion[1]',
            //   convertDeg(newLocaion[0]) + ',' + convertDeg(newLocaion[1]),
            // );
            // console.log(
            //   'TCL: MapUser -> componentDidMount -> adminSet.location',
            //   adminSet.location.replace(/ /g, '-'),
            // );
          }else{
            this.setState({
              region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              },
              lineMap: '',
              dataGo: {
                pointWay: [],
                start_location: {lat: 76.661599, lng: 105.710462},
                end_location: {lat: 76.661599, lng: 105.710462},
                pointInfor: {latitude: 76.661599, longitude: 105.710462},
                start_address: '',
                end_address: '',
                distance: '',
                duration: '',
              },
            })
          }
        }
      });
    // lang nghe admin yeu cau
    // firebaseApp
    //   .database()
    //   .ref('data/' + getDayNow() + '/adminSet')
    //   .on('value', snapshot => {
    //     if (snapshot.val().location != '') {
    //       // alert(snapshot.val().location);
    //       console.log(
    //         'TCL: MapUser -> componentDidMount -> snapshot.val().location',
    //         snapshot.val().location,
    //       );
    //       // alert(snapshot.val().message);
    //       console.log(
    //         'TCL: MapUser -> componentDidMount -> snapshot.val().message',
    //         snapshot.val().message,
    //       );
    //     }
    //   });
  }

  async getDirections(startLoc, destinationLoc) {
    try {
      let resp = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=AIzaSyDhPujSPGQEPULDAKE1z8HYsScYlq1F4ZA`,
      );
      let respJson = await resp.json();
      if (respJson.status != 'NOT_FOUND') {
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
      } else {
        alert('không tìm thấy địa chỉ trên trên bản đồ');
      }
    } catch (error) {
      this.props.onSent('', '');
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
  // button search
  togleButtomSearch = () => {
    this.setState({
      isTogleButtonSearch: !this.state.isTogleButtonSearch,
      inputAdressValue: '',
      inputMessageValue: '',
    });
  };

  chechShowPopUp = (isShowPopUp, dataGo, quangduong) => {
    let result = null;
    if (isShowPopUp) {
      result = (
        <View style={[styles.popUp]}>
          <Text style={[styles.pupUpText, {paddingTop: 3}]}>
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
            <Text style={{color: '#d41919d6'}}>
              {this.state.adminSetState.message}
            </Text>
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
  //  input adresss
  onChangeInputAdressValue = text => {
    this.setState({
      inputAdressValue: text,
    });
  };
  //  input adresss
  onChangeInputMessageValue = text => {
    this.setState({
      inputMessageValue: text,
    });
  };
  // sendt
  onSent = () => {
    let {inputMessageValue, inputAdressValue} = this.state;
    if (inputAdressValue == '') {
      alert('Vui lòng nhập địa chỉ cần đến .');
    } else {
      // alert(inputAdressValue+" --- "+inputMessageValue)
      this.sentDataToFireBase(inputAdressValue, inputMessageValue);
      this.onCancel();
    }
  };
  // clear
  clearLocation = () => {
    this.sentDataToFireBase('', '');
    this.onCancel();
  };
  checkComplete=()=>{
    this.clearLocation();
    this.setState({
      isCheckedComplete:true
    })
  }
  //  gui data len fireBase
  sentDataToFireBase = (inputAdressValue, inputMessageValue) => {
    firebaseApp
      .database()
      .ref('data/' + getDayNow() + '/adminSet')
      .set({
        location: inputAdressValue,
        message: inputMessageValue,
      });
  };
  // cancel
  onCancel = () => {
    this.setState({
      isTogleButtonSearch: false,
      inputAdressValue: '',
      inputMessageValue: '',
    });
  };
  //
  render() {
    let {dataGo, isShowPopUp, isTogleButtonSearch} = this.state;
    let {isAdmin}=this.props

    // console.log('TCL: MapUser -> render -> dataGo', dataGo);
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
              latitude: convertDeg(this.state.newLocaionState[0]),
              longitude:convertDeg(this.state.newLocaionState[1]),
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
        {/* input search location */}
        {isTogleButtonSearch && (
          <View style={styles.search}>
            <View style={styles.iputAdress}>
              <Text>Nhập địa chỉ cần đến :</Text>
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 5,
                  marginTop: 3,
                }}>
                <TextInput
                  style={{
                    height: 30,
                    borderColor: 'gray',
                    borderWidth: 1,
                    padding: 0,
                  }}
                  placeholder={'Nhập địa chỉ'}
                  onChangeText={text => this.onChangeInputAdressValue(text)}
                  value={this.state.inputAdressValue}
                />
              </View>
            </View>
            <View>
              <Text>Nhập lời nhắn :</Text>
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 5,
                  marginTop: 3,
                }}>
                <TextInput
                  style={{
                    height: 80,
                    borderColor: 'gray',
                    borderWidth: 1,
                    padding: 0,
                  }}
                  placeholder={'Nhập lời nhắn tại đây'}
                  multiline={true}
                  onChangeText={text => this.onChangeInputMessageValue(text)}
                  value={this.state.inputMessageValue}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  marginVertical: 10,
                }}>
                <Button
                  title="Hủy"
                  containerStyle={{width: 80}}
                  buttonStyle={{
                    backgroundColor: 'red',
                    padding: 3,
                  }}
                  onPress={this.onCancel}
                />
                <Button
                  title="Gửi"
                  containerStyle={{width: 80}}
                  buttonStyle={{
                    backgroundColor: 'green',
                    padding: 3,
                    marginLeft: 148,
                    width: 80,
                    marginTop: 2,
                  }}
                  onPress={this.onSent}
                />
              </View>
              <TouchableOpacity onPress={this.clearLocation}>
                <Text style={{color: 'red', textDecorationLine: 'underline'}}>
                  Xóa điểm hiện tại trên bản đồ
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.buttonSearch}>
          <TouchableOpacity onPress={() => this.togleButtomSearch()}>
            {isAdmin&&(<Icon
              name={!isTogleButtonSearch ? 'add-circle' : 'remove-circle'}
              size={36}
              color="white"
            />)}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.checkComplete()}>
          {!isAdmin&&this.state.isCheckedComplete&&(  <Icon
              name="check"
              size={36}
              color="yellow"
            />)}
          {!isAdmin&&!this.state.isCheckedComplete&&(  <Icon
              name="check"
              size={36}
              color="white"
            />)}
            </TouchableOpacity>
        </View>
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
    top: -90,
    right: 0,
  },
  search: {
    backgroundColor: '#dee1e6',
    width: '90%',
    // height: 50,
    position: 'absolute',
    top: 20,
    left: 18,
    borderWidth: 0.5,
    padding: 5,
  },
  // iputAdress:{marginBottom:5},
  buttonSearch: {
    backgroundColor: '#1f2ee2c4',
    width: 45,
    position: 'absolute',
    bottom: '25%',
    right: 20,
    padding: 2,
    borderRadius: 5,
  },
});

export default MapUser;
