import {stringLiteral} from '@babel/types';

//  not use
//  function getDayNow(){
//       var dt=new Date();
//       let date= dt.getDate() <10 ?'0'+dt.getDate():dt.getDate();
//       let monthReal=dt.getMonth() + 1
//       let month=monthReal <10?'0'+monthReal:monthReal
//       let year =dt.getFullYear()-2000
//       return (date +'-'+month+'-'+year)
// }
// convert my data from server
function dataConvertFromServer(dataServer) {
  //   console.log(dataServer);
  let fullData = [];
  let listDay = [];
  Object.keys(dataServer).forEach(key => {
    //    trong 1 ngay
    let fullDay = [];
    if (key != 0) {
      Object.keys(dataServer[key]).forEach(keyInfor => {
        //    tat ca gio trong mot ngay
        // console.log(dataServer[key][keyInfor]);
        let dd = getDateMonthYear(dataServer[key][keyInfor].timestamp);
        let hh = dataServer[key][keyInfor].timestamp;
        let lat = convertDeg(dataServer[key][keyInfor].locations[0]);
        let long = convertDeg(dataServer[key][keyInfor].locations[1]);
        let speed = dataServer[key][keyInfor].locations[2];
        fullDay.push({
          dd: dd,
          hh: hh,
          lat: lat,
          long: long,
          speed: speed,
        });
      });
      fullData.push(fullDay);
    }
  });
  //   setup list day
  for (index in fullData) {
    let lengthday = fullData[index].length;
    let midleValue = lengthday / 2 - (lengthday % 2)/2;
    listDay[index] ={
        key: fullData[index][midleValue].dd,
        label: fullData[index][midleValue].dd
    };
  }
  return {fullData: fullData, listDay: listDay};
}
//
function getDateMonthYear(timestamp) {
  let time = new Date(timestamp);
  let date = time.getDate();
  let month = time.getMonth();
  let year = time.getFullYear();
  let dd = '';
  if (date < 10) dd += '0';
  dd += date + '/';
  if (month < 10) dd += '0';
  dd += month + '/';
  dd += year + '';
  return dd;
}
//
function convertDeg(data) {
  return data / 100 - (data % 100) / 100 + (data % 100) / 60;
}
export {dataConvertFromServer};
