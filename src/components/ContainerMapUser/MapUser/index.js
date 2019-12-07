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
  Picker,
} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import MapView, {Marker, Polyline, ProviderPropType} from 'react-native-maps';
import {
  getDataGo,
  getDayNow,
  convertDeg,
  convertLichSu
} from './../../../../common/myFunction';
import finish from './assets/car.png';
import flag from './assets/flag-blue.png';
import flagP from './assets/flag-pink.png';
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
      vtri:{lat:10.804366049999999,long:106.63990885},
      isTogleButtonSearch:false,
      sdt:"",
      lichSu:{},
      ngay_chon:"",
      valueLichSu:{
        list:null,
        data:null
      },
      name:""
    };
    this.listUser=[];

  }
  componentDidMount() {
    firebaseApp
    .database()
    .ref('rifd/vtri')
    .on('value', snapshot => {
      this.setState({
        vtri:snapshot.val(),
      });
    });
    firebaseApp
    .database()
    .ref('rifd/user')
    .once('value', snapshot => {
      this.listUser=snapshot.val();
    });
  }
  // button search
  togleButtomSearch = () => {
    this.setState({
      isTogleButtonSearch: !this.state.isTogleButtonSearch,
 
      
    });
  };
  // cancel
  onCancel = () => {
    this.setState({
      isTogleButtonSearch: false,
      sdt: '',
      ngay_chon:"",
      valueLichSu:{
        list:null,
        data:null
      }
    });
  };
  //Ok
  onOk=()=>{
    let {sdt}=this.state;
    let listUser=this.listUser
    if(sdt !=""){
      let check=false;
      for(let i in listUser){
        if(sdt == listUser[i].sdt){
         // alert(listUser[i].id) // co duoc id roi ; gio get data
          firebaseApp
          .database()
          .ref('rifd/lichSu/'+listUser[i].id)
          .once('value', snapshot => {
            let valueLichSu=convertLichSu(snapshot.val());
            ngay_chon=valueLichSu.list!=null&&valueLichSu.list!=undefined?valueLichSu.list[0]:""
            this.setState({
              valueLichSu:valueLichSu,
              ngay_chon:ngay_chon,
              name:listUser[i].name
            })//=snapshot.val();
          });

          check=true
        }
      }
      if(!check) alert("Số điện thoại không chính xác")
    }else{
      alert("Xin nhập số điện thoại")
    }
  }
  //
  showSelecte=(list)=>{
    if(list !=null){
      let kq=[]
      for(let i in list){
        kq.push(<Picker.Item label={list[i]} value={list[i]} key={i} />)
      }
      return<View>
        <Text>Chọn ngày:</Text>
        <Picker
        selectedValue={this.state.ngay_chon}
        style={{height: 50, width: 300}}
        onValueChange={(itemValue, itemIndex) =>{
          this.setState({ngay_chon: itemValue})

        }
        }>
        {kq}
      </Picker>
    </View>
    }
  }
  showPointMap=(ngay_chon,data,list)=>{
    let showMaker=[]
    if(ngay_chon!=""){
      for(let i in list){
        if(list[i]==ngay_chon){
          //hien thi list Maket
          for(let k in data[i]){
              showMaker.push(     
                  <Marker
                  key={k}
                    coordinate={{
                      latitude: data[i][k].vtri.lat,
                      longitude: data[i][k].vtri.long,
                    }}
                    title={this.state.name}
                    description={data[i][k].isGoUp?"Lên xe":"Xuống xe"}
                    // image={finish}
                  >
                    <Image
                      style={{width: 20, height: 20, opacity: 0.8}}
                      source={data[i][k].isGoUp?flag:flagP}
                    />
           <Text style={styles.text}>{data[i][k].time}</Text>

                  </Marker>
              )
          }
        }
      }
    }
    return showMaker
  }
  render() {
    let { vtri, isTogleButtonSearch,ngay_chon,valueLichSu,name} = this.state;
    let {isAdmin} = this.props;
    return (
      // <Text>null</Text>
      <View style={styles.wapper}>
        <MapView
          provider={this.props.provider}
          style={styles.container}
          initialRegion={this.state.region}
          mapType={'standard'}>

         {/* hien thi vi tri hien tai */}
          <Marker
            coordinate={{
              latitude: convertDeg(vtri.lat),
              longitude: convertDeg(vtri.long),
            }}
            title={"Xe buyt"}
            // description={"description"}
            // image={finish}
          >
            <Image
              style={{width: 20, height: 20, opacity: 0.8}}
              source={finish}
            />
          </Marker>
            {this.showPointMap(ngay_chon,valueLichSu.data,valueLichSu.list)}
        </MapView>
        {isTogleButtonSearch && (
          <View style={styles.search}>
            <View style={styles.iputAdress}>
        <Text>Nhập số điện thoại của phụ huynh :</Text>
        <Text style={{color:"red"}}>{this.state.name}</Text>
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
                  placeholder={'Nhập số điện thoại'}
                  onChangeText={text => this.setState({sdt:text})}
                  value={this.state.sdt}
                />
              </View>
            </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  marginVertical: 10,
                }}>

                <Button
                  title="Tìm"
                  containerStyle={{width: 80}}
                  buttonStyle={{
                    backgroundColor: 'green',
                    padding: 3,
                   
                  }}
                  onPress={this.onOk}
                />
                  <Button
                  title="Hủy"
                  containerStyle={{width: 80}}
                  buttonStyle={{
                    backgroundColor: 'red',
                    padding: 3, 
                    marginLeft:5
                  }}
                  onPress={this.onCancel}
                />
                
                
            </View>
            {this.showSelecte(valueLichSu.list)}

          </View>
        )}

        <View style={styles.buttonSearch}>
          <TouchableOpacity onPress={() => this.togleButtomSearch()}>
            {isAdmin && (
              <Icon
                name={!isTogleButtonSearch ? 'add-circle' : 'remove-circle'}
                size={36}
                color="white"
              />
            )}
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
  buttonControl:{
    position: 'absolute',
    bottom: '35%',
    right: 20,

  },
  buttonText:{
    width: 45,
    paddingVertical:4,
    backgroundColor: '#ffa451de',
    borderRadius:4,
    textAlign:"center",
  }
});

export default MapUser;
