import React, {Component} from 'react';
import {StyleSheet, Text, View,TouchableOpacity} from 'react-native';
import Timeline from 'react-native-timeline-flatlist';
import {convertDistantV} from '../../../../common/myFunction';
import { Icon  } from 'react-native-elements'
const otoX=0.000057;
const motoX=0.000017;
const truckX=0.00017

export default class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [{},{}],
      totalDistant:0,
      dataX:null,
      iconSelected:2,
      xangX:motoX,
      isShowPopUp:true
    };
  }
  componentWillMount(){
    let {data} = this.props;
//     console.log('TCL: Detail -> render -> data', data);

    let count=1

    //  co duoc khoan cach roi
    let dataConvert2 = convertDistantV(data);
    // dua khoan cach vao description
    let totalDistant=0;
    for (let i in dataConvert2) {
      if (dataConvert2[i].title == 'Dừng') {
        dataConvert2[i].title = `Dừng (${count})`;
        count++;
      }
      if (dataConvert2[i].title == "Di chuyển") {
        dataConvert2[i].description=`* Thời gian di chuyển : ${dataConvert2[i].timeMove}
* Vận tốc trung bình : ${dataConvert2[i].vanToc} (km/h)
* Quãng đường đi được : ${dataConvert2[i].khoanCach} (m)`;
        totalDistant+=Number(dataConvert2[i].khoanCach);
      }
    }
    this.setState({
      data:dataConvert2,
      totalDistant:totalDistant
    })
  }

  componentWillReceiveProps(nextProps){
    if(nextProps && nextProps.data != undefined){
      let {data} = nextProps;
      //     console.log('TCL: Detail -> render -> data', data);
          let count=1
          //  co duoc khoan cach roi
          let dataConvert2 = convertDistantV(data);
          // dua khoan cach vao description
          let totalDistant=0;
          for (let i in dataConvert2) {
            if (dataConvert2[i].title == 'Dừng') {
              dataConvert2[i].title = `Dừng (${count})`;
              count++;
            }
            if (dataConvert2[i].title == "Di chuyển") {
              dataConvert2[i].description=`* Thời gian di chuyển : ${dataConvert2[i].timeMove}
* Vận tốc trung bình : ${dataConvert2[i].vanToc} (km/h)
* Quãng đường đi được : ${dataConvert2[i].khoanCach} (m)`;
              totalDistant+=Number(dataConvert2[i].khoanCach);
            }
          }
          this.setState({
            data:dataConvert2,
            totalDistant:totalDistant,
            isShowPopUp:true
          })
    }
  }
// set icon
setIcon=(iconSelected,xangX)=>{
  this.setState({
    iconSelected:iconSelected,
    xangX:xangX
  })
}
//  close popup
closePopUp=()=>{
  this.setState({
    isShowPopUp:false
  })
}
  render() {
    let {data,totalDistant} =this.state

    //  show popUp
    let {isShowPopUp}=this.state
    let showPopUp=null
    if(isShowPopUp){
      showPopUp=        <View style={styles.popUp}>
      <Text>{`Tổng quảng đường đi được : ${totalDistant} (m)`}</Text>
      <Text>{`Lượng xăng thụ khoảng :${(totalDistant*this.state.xangX).toFixed(1)} (Lit)`}</Text>
      <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
      <TouchableOpacity onPress={()=>this.setIcon(1,otoX)} style={{marginLeft:"25%"}}>
      <Icon name='directions-car'  
        containerStyle={[styles.icon,this.state.iconSelected==1?{borderWidth:2}:{}]} 
        iconStyle={[this.state.iconSelected==1?{color:"#FAEBD7"}:{color:"#FAEBD7"}]}
        /></TouchableOpacity>
        <TouchableOpacity onPress={()=>this.setIcon(2,motoX)}>
      <Icon name='motorcycle' 
        containerStyle={[styles.icon,this.state.iconSelected==2?{borderWidth:2}:{}]} 
        iconStyle={[this.state.iconSelected==2?{color:"#FAEBD7"}:{color:"#FAEBD7"}]} 
        /></TouchableOpacity>
       <TouchableOpacity onPress={()=>this.setIcon(3,truckX)}> 
      <Icon name='truck' type='font-awesome' 
        iconStyle ={[{ transform: [{ rotateY: "180deg" }]},[this.state.iconSelected==3?{color:"#FAEBD7"}:{color:"#FAEBD7"}]]} 
        containerStyle={[styles.icon,this.state.iconSelected==3?{borderWidth:2}:{}]}
        /></TouchableOpacity>
        <View style={styles.close}>
        <TouchableOpacity onPress={()=>this.closePopUp()}>
          <Icon name='close'></Icon>
        </TouchableOpacity>
        </View>
      </View>
    </View>
    }else{
      showPopUp=null
    }

    return (
      <View style={styles.container}>
        
        <Timeline
          style={styles.list}
          data={data}
          separator={true}
          circleColor="rgb(45,156,219)"
          lineColor="rgb(45,156,219)"
          timeContainerStyle={{minWidth: 52, marginTop: 0}}
          timeStyle={{
            textAlign: 'center',
            backgroundColor: '#ff9797',
            color: 'white',
            borderRadius: 13,
          }}
          descriptionStyle={{color: '#6495ED'}}
          innerCircle={'dot'}
        />
        {showPopUp}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position:"relative",
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 20,
  },
  list: {
    flex: 1,
    marginTop: 5,
  },
  popUp:{
    position:"absolute",
    bottom:-20,
    left:1,
    width:"98%",
    // height:30,
    backgroundColor:"#008000e6",
    padding:5,
    fontSize:5,
  },
  icon:{
    marginLeft:20,
    // borderWidth:2,
    borderColor:"#FAEBD7",
    padding:2,
    marginTop:2
  },
  close:{
    position:"absolute",
    top:-40,
    right:0
  }

});
