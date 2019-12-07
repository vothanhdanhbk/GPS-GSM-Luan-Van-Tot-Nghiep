/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, Component} from 'react';
import Admin from './Admin';
import User from './User';
import SignUpPage from './../components/Login';
import {firebaseApp} from '../../common/FirebaseConfig'

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform,
} from 'react-native';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPage: 'admin',
      
    };
    this.reconnect=true;
    this.listUser=[];
    this.vtri={};
  }
  componentDidMount() {
    this._handleWebSocketSetup()
    // doc list user
    firebaseApp
    .database()
    .ref('rifd/user')
    .once('value', snapshot => {
      this.listUser=snapshot.val();
    });

  }
  componentWillUnmount () {
		this.reconnect = false
		this.ws.close()
  }
  _handleWebSocketSetup = () => {
    const ws = new WebSocket("wss://connect.websocket.in/v2/999?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImQ4ZjBkNjQ1NDA5ZDY4ZjlmZWFjMzRlNDI1YTYxMWQyY2JiMWQxNjYwOWVjODgyODQzMGM5ZDMwYTFlMTM3ZDg3NzgyY2MxY2QzZWMwYTAzIn0.eyJhdWQiOiI2IiwianRpIjoiZDhmMGQ2NDU0MDlkNjhmOWZlYWMzNGU0MjVhNjExZDJjYmIxZDE2NjA5ZWM4ODI4NDMwYzlkMzBhMWUxMzdkODc3ODJjYzFjZDNlYzBhMDMiLCJpYXQiOjE1NzQzNjAwOTIsIm5iZiI6MTU3NDM2MDA5MiwiZXhwIjoxNjA1OTgyNDkyLCJzdWIiOiI0NyIsInNjb3BlcyI6W119.FEqZz02PsWho73GiPMFQjS3EHhTQUGYDSON9AloXPR5Tjb2A-Ogg_WUdXhvuUmZmZpHdyUfjXKdnYu_oI51spYuTNqRmhm-kI_zYRY44cIGLtrBsuZT9AL-EaYo7Jn_EjHX0OZkgk3eSLHEhffyGpARfQOndI7QSMg1lqMAL_6o5mLgyiwJpUxnmWOKCNARzGHQabNCMlCQIkZmAe80PfYjkURA3JTAdPydC9Xr46jZFzL_-BVTjlY5HP-KwUudI0_8eOWHAVin0D8QLEnGDCexRj9EeXoNjDYD0f8YPqoY2RQEXe5HihpjEC3TQl6HsNJ-tVQKy_WMgs9h9q7gZ91nTajtPYqbOv-K0INuwlYn4ZJw3slZ890ANdHxOyrDeDIqShLGiOPHKVlMvDDsAoyy_iyNNHd8Asuxn1D7cJW_AxsA1wC_XMnys36pLoeI8iMmBaYBe5MvPAY4IlLsew2Tg8NWCShdSih5tfaMECixawS5s0x8Xe0tqGFz6m1UslRdkpw-I4EKL8LBswf4waG4ZMRKAWnE-16CLJcEuZpcSyavMCjKc4AuswMCf81wfi92KecjgR-tdZ3xMGgkBzT3f9epaQ5M2JIM1bF06TZAdKchzRt0N_u_sOywSa5DTgTVqw27Da7WTg1thEvDZ0l_iP9Eq3On8SjfhBtO3SO0")
    ws.onmessage = (event) => { 
      // nhan tin nhan o day
      if(event.data !=null&&event.data !=undefined){
        // xu ly data nhan duoc
      let LCD_message= this.xu_ly_data_nhan_duoc_tu_GSM(event.data);//id
        // tra data ve here
        if(LCD_message == "false"){// gui the chua duoc dang ki
          ws.send("0");
        }
        if(LCD_message[0]=="1"){// tra ve thong tin len xe,xuong xe
          ws.send(LCD_message);
          // Re_update user
          firebaseApp
          .database()
          .ref('rifd/user')
          .set(this.listUser);
          // lay vi tri hien tai
          firebaseApp
          .database()
          .ref('rifd/vtri')
          .once('value', snapshot => {
            this.vtri=snapshot.val();
          });
          // update thong tin lich su
          let time=new Date();
          let g,p,n,t;
          hh=time.getMonth()+1;
          n=time.getDate()<10?("0"+time.getDate()):time.getDate();
          t=time.getMonth()<10?("0"+hh):hh;
          g=time.getHours()<10?("0"+time.getHours()):time.getHours();
          p=time.getMinutes()<10?("0"+time.getMinutes()):time.getMinutes();
          // let vtri=this.vtri
          isGoUp=LCD_message[14]=="1"?true:false
          firebaseApp
          .database()
          .ref('rifd/lichSu/'+event.data+'/'+n+"-"+t+"-"+time.getFullYear()+"/"+time.getTime())
          .set({
            isGoUp:isGoUp,
            vtri:this.vtri,
            time:g+"h:"+p
          });

        }



      }
    }
    ws.onopen = (event) => {}
    ws.onclose = () => this.reconnect ? this._handleWebSocketSetup() : this.ws.close();

  }

//  PHAN XU LY DATA NHAN DUOC VA MOCK API
xu_ly_data_nhan_duoc_tu_GSM=(id)=>{
  // console.log(id);
  // console.log(this.state.listUser)

  let listUser=this.listUser; 
  let result="false";
  for(let i in listUser){

    if(listUser[i].id==id){
      let len_xuong=!listUser[i].isGoUp?"1":"0";
      let time=new Date();let h,m
      if(time.getHours()<10){
        h="0"+time.getHours();
      } else{
        h=h=time.getHours();
      }
      if(time.getMinutes()<10){
        m="0"+time.getMinutes();
      } else{
        m=time.getMinutes();
      }
      result="1"+listUser[i].name+"  "+len_xuong+h+":"+m;
      this.listUser[i].isGoUp=!listUser[i].isGoUp;

    }

  }
  return result;
}




















  onLogin = value => {
    this.setState({
      selectedPage:value
    })
  };
  render() {
    let {selectedPage}=this.state
    return (
      <Fragment>
        <SafeAreaView style={styles.safeAreaView}>
          {selectedPage=="admin"&&<Admin onLogin={this.onLogin}/>}
         {selectedPage=="user" &&<User onLogin={this.onLogin}/>}
         {selectedPage=="login"&& <SignUpPage onLogin={this.onLogin} />}
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    paddingTop: Platform.OS === 'Android' ? 25 : 0,
  },
});

export default App;
