import React from 'react';
import {StyleSheet, Dimensions, Text,View,Image} from 'react-native';

import MapView, {Marker, Polyline, ProviderPropType} from 'react-native-maps';
import flagPinkImg from './assets/car.png';
import {COnvertToPolyline} from "../../../../common/myFunction"
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
    };
  }
// componentDidMount(){
//     let {data} = this.props;
//     let count=1
//     console.log('TCL: Map -> componentDidMount -> data', data);
//     let result1 = [];
//     for (let i in data) {
//       //  xu ly dy chuyen
//       if (data[i].title == 'Di chuyển') {
//         let dataCOnvertToPolyline = COnvertToPolyline(
//           data[i].detail,
//           data,
//           i
//         );
//         result1.push(
//           <Polyline
//             coordinates={dataCOnvertToPolyline}
//             strokeColor="#3748b8"
//             strokeWidth={4}
//             key={i}
//           />,
//         );
//       }
//       //  xu ly dung
//       if (data[i].title == "Dừng") {
//         result1.push(
//           <Marker
//           coordinate={{latitude: data[i].detail[0].lat, longitude: data[i].detail[0].long}}
//           title={data[i].time}
//           description={data[i].description}
//           // image={flagPinkImg}
//           key={i}
//         >
//           <View style={styles.icon}>
//             <Text style={styles.text}>
//               {count}
//             </Text>
//             <Image style={styles.img} source={flagPinkImg}/>
//           </View>
//         </Marker>
//         )
//         count++
//       }
// // khong hien mat ket noi

//     }
//     this.setState({
//       lineMap: result1,
//     });
//   }
  //


  render() {
    // let {lineMap} = this.state;
    let {data} = this.props;
    let count=1
    console.log('TCL: Map -> componentDidMount -> data', data);
    let result1 = [];
    for (let i in data) {
      //  xu ly dy chuyen
      if (data[i].title == 'Di chuyển') {
        let dataCOnvertToPolyline = COnvertToPolyline(
          data[i].detail,
          data,
          i
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
      if (data[i].title == "Dừng") {
        result1.push(
          <Marker
          coordinate={{latitude: data[i].detail[0].lat, longitude: data[i].detail[0].long}}
          title={data[i].time}
          description={data[i].description}
          // image={flagPinkImg}
          key={i}
        >
          <View style={styles.icon}>
            <Text style={styles.text}>
              {count}
            </Text>
            <Image style={styles.img} source={flagPinkImg}/>
          </View>
        </Marker>
        )
        count++
      }
// khong hien mat ket noi

    }
    return (
      // <Text>null</Text>
      <MapView
        provider={this.props.provider}
        style={styles.container}
        initialRegion={this.state.region}
        // mapType={"hybrid"}
        mapType={'standard'}>
        {result1}
      </MapView>
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
  icon:{
    // backgroundColor: "#550bbc",
    padding: 0,
    // borderRadius: 5,
  },
  text:{
    color: "red",
    fontWeight: "bold"
  },
  img:{
    width:15,
    height:15
  }
});

export default Map;

