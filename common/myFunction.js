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
    // console.log("TCL: dataConvertFromServer -> dataServer[key]", dataServer[key])

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
    let midleValue = lengthday / 2 - (lengthday % 2) / 2;
    listDay[index] = {
      key: fullData[index][midleValue].dd,
      label: fullData[index][midleValue].dd,
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

//convert data to distant,speed,status
function convertDataDetail(data) {
  console.log('TCL: convertDataDetail -> data', data);
  if (data.length > 0) {
    let timeStartConvert = new Date(data[0].hh);
    let hoursStartConvert = timeStartConvert.getHours();
    let minuteStartConvert = timeStartConvert.getMinutes();
    let result = [];
    if (
      hoursStartConvert != 0 ||
      (hoursStartConvert == 0 && minuteStartConvert > 5)
    ) {
      result.push({
        timeStart: '00:00',
        timeEnd: data[0].hh,
        status: 'Disconnected',
      });
    }
    //
    for (i = 0; i < data.length - 1; i++) {
      if ((data[i + 1].hh - data[i].hh) / 60000 < 5) {
        // co ket noi
        // kiem tra xem no  chay hay la dung || dung speed
        if (data[i].speed > 1.2) {
          // chay
          data[i].status = 'Run';
          result.push(data[i]);
        } else {
          // dung
          data[i].status = 'Stop';
          result.push(data[i]);
        }
      } else {
        // khong co ket noi
        result.push({
          status: 'Disconnected',
          timeStart: data[i].hh,
          timeEnd: data[i + 1].hh,
        });
      }
    }
    //  xu ly cuoi ngay (ngay hom qua)
    let isActionToNight = checkTimeNow(data[data.length - 1].hh);
    if (isActionToNight) {
      result.push({
        status: 'Disconnected',
        timeStart: data[data.length - 1].hh,
        timeEnd: '23:59',
      });
    }
    console.log('TCL: convertDataDetail -> result', result);
    // co status roi ; gio gom cac thong so lai khu vuc
   let dataXuLyNhieu= xulynhieu(result)
  }
}
// xu ly nhieu
function xulynhieu(data) {
  // xu ly index
  let arrayValue = [];
  for (let i = 0; i <= data.length - 1; i++) {
    let dataCover= coverXuLyNhieu(i, data, data[i].status);
    console.log("TCL: xulynhieu -> dataCover", dataCover)
    if(i <dataCover[1]) i=dataCover[1];
  }
  //  xu ly gia tri
}
// Gom mang


//  cover xu ly nhieu
function coverXuLyNhieu(i, data, status) {
  let index = i,
    check = 0;
  while(true){
    index+=1;
    // console.log("TCL: coverXuLyNhieu -> index", index)
    if(data[index].status =='Disconnected'&&status !='Disconnected'){
      index+=2;
      break;
    }
    if (data[index].status == status) {
      check = 0;
    } else {
      check++;
    }

    if (check > 2) {
      break;
    }
    if( index == data.length - 1) {
      index+=3;
      break;
    }
  }

    return [i, index - 3, status];

}

// function checkStatus(i, result, status) {
//   let wakeHouse = [];
//   let index = i;
//   while (result[index].status == status) {
//     wakeHouse.push(result[index]);
//     // console.log("TCL: checkStatus -> result[index]", result[index])
//     index += 1;
//     console.log("TCL: checkStatus -> index", index)
//     if (index == result.length) break;
//   }

//   //  nhom mang xong roi; gio xu ly
//   if (status == 'Disconnected') {// xu ly cho Disconect
//     if (wakeHouse.length == 1) {
//       return [wakeHouse[0], index];
//     } else {
//       return [
//         {
//           status: 'Disconnected',
//           timeStart: wakeHouse[0].timeStart,
//           timeEnd: wakeHouse[wakeHouse.length - 1].timeEnd,
//         },
//         index,
//       ];
//     }
//   }else{// xu ly cho Run v Stop
//     return [
//       {
//         location:wakeHouse,
//         status:status
//       },
//       index
//     ]
//   }
// }
// xu ly cuoi ngay
function checkTimeNow(stamps) {
  let nowTime = new Date();
  let lastTime = new Date(stamps);
  if (
    (nowTime.getDate() != lastTime.getDate() && lastTime.getHours() < 23) ||
    (nowTime.getDate() != lastTime.getDate() &&
      lastTime.getHours() == 23 &&
      lastTime.getMinutes() < 55)
  ) {
    return true;
  } else {
    return false;
  }
}

// tinh khoang cach
function getDistant(lat2, lon2, lat1, lon1) {
  var p = 0.017453292519943295; // Math.PI / 180
  var c = Math.cos;
  var a =
    0.5 -
    c((lat2 - lat1) * p) / 2 +
    (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

  return 12742000 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

export {dataConvertFromServer, convertDataDetail};
