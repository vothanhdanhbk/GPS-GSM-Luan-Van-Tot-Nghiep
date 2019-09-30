import {stringLiteral} from '@babel/types';

//  not use
function getDayNow() {
  var dt = new Date();
  let date = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
  // let monthReal=dt.getMonth() + 1
  // let month=monthReal <10?'0'+monthReal:monthReal
  // let year =dt.getFullYear()-2000
  return date;
}
// convert my data from server
function dataConvertFromServer(dataServer) {
  // console.log("TCL: dataConvertFromServer -> dataServer", dataServer)
  //   console.log(dataServer);
  let fullData = [];
  let listDay = [];
  Object.keys(dataServer).forEach(key => {
    // console.log("TCL: dataConvertFromServer -> key", key)
    //    trong 1 ngay
    let fullDay = [];
    // console.log("TCL: dataConvertFromServer -> dataServer[key]", dataServer[key])

    if (key != 0 && Object.keys(dataServer[key]).length > 1) {
      Object.keys(dataServer[key]).forEach(keyInfor => {
        //    tat ca gio trong mot ngay
        // console.log(dataServer[key][keyInfor]);
        if (keyInfor != 'adminSet') {
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
        }
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
  // console.log('TCL: convertDataDetail -> data', data);
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
    // console.log('TCL: convertDataDetail -> result', result);
    // co status roi ; gio gom cac thong so lai khu vuc
    let dataFinancialConvert = xulynhieu(result);
    // console.log("TCL: convertDataDetail -> dataFinancialConvert", dataFinancialConvert)
    return dataFinancialConvert;
  }
}
// xu ly nhieu
function xulynhieu(data) {
  // xu ly index
  let arrayValue = [];
  for (let i = 0; i <= data.length - 1; i++) {
    let dataCover = coverXuLyNhieu(i, data, data[i].status);
    if (i < dataCover[1]) i = dataCover[1];
    //  start  array group
    let array = [];
    for (let k = dataCover[0]; k <= dataCover[1]; k++) {
      array.push(data[k]);
    }
    arrayValue.push(dataFinancialConvert(array, dataCover[2]));
    //
  }
  return arrayValue;
}
//
function dataFinancialConvert(data, status) {
  let k = {};
  if (status == 'Disconnected') {
    k = {
      status: 'Disconnected',
      timeStart: data[0].timeStart,
      timeEnd: data[data.length - 1].timeEnd,
    };
  } else {
    k = {
      detail: data,
      status: status,
    };
  }
  return k;
}
//  cover xu ly nhieu
function coverXuLyNhieu(i, data, status) {
  // console.log("TCL: coverXuLyNhieu -> i", i)
  // console.log("TCL: coverXuLyNhieu -> status", status)
  // console.log("TCL: coverXuLyNhieu -> data", data)
  let index = i,
    check = 0;
  while (true) {
    // console.log("TCL: coverXuLyNhieu -> index", index)
    if (data[index].status == 'Disconnected' && status != 'Disconnected') {
      index += 2;
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
    if (index == data.length - 1) {
      index += 3;
      break;
    }
    index += 1;
  }

  return [i, index - 3, status];
}

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
function convertDistantV(input) {
  let data = input;
  console.log('TCL: convertDistantV -> data', data);
  for (let i in data) {
    let index = Number(i);
    let localArr = [];
    let timeMove = 0;
    if (data[index].title == 'Di chuyển') {
      // tinh dia diem dung truoc khi di chuyen
      if (i > 0) {
        if (data[index - 1].title == 'Dừng') {
          localArr.push(data[index - 1].detail[0]);
        }
      }
      // tinh dia diem di chuyen
      localArr = localArr.concat(data[index].detail);
      // tinh dia diem sau di chuyen
      if (index < data.length - 1) {
        if (data[index + 1].title == 'Dừng') {
          localArr.push(data[index + 1].detail[0]);
        }
      }
      // tinh thoi gian di chuyen
      timeMove =
        data[index].detail[data[index].detail.length - 1].hh -
        data[index].detail[0].hh;
      // //  co duowc mang toa do di chuyen [localArr]
      // console.log("TCL: convertDistantV -> localArr", localArr)
      //  tinh duoc khoan cach di chuyen
      let financialDistanceResult = solveDistance(localArr);
      // console.log('TCL: convertDistantV -> xxxxxxxxxxxxxxxxxxxxxx m :', financialDistanceResult);
      //  co duoc thoi gian di chuyen
      // console.log("TCL: convertDistantV -> timeMove", timeMove)
      let vanToc = (financialDistanceResult * 3600) / timeMove;
      // convert lai data
      data[index].khoanCach = financialDistanceResult.toFixed(0);
      data[index].vanToc = vanToc.toFixed(1);
    }
  }
  return data;
}
function solveDistance(localArr) {
  // console.log('TCL: solveDistance -> localArr', localArr);
  let financialDistanceResult = 0;
  let distant = 0;
  for (let i = 0; i <= localArr.length - 1; i++) {
    // console.log("TCL: solveDistance -> i", i)
    if (i + 3 <= localArr.length - 1) {
      distant = getDistant(
        localArr[i + 3].lat,
        localArr[i + 3].long,
        localArr[i].lat,
        localArr[i].long,
      );
      //  console.log("local 1 :  ",localArr[i+3].lat+","+localArr[i+3].long)
      //  console.log("local 2 :  ",localArr[i].lat+","+localArr[i].long)
      // console.log("TCL: solveDistance -> distant 1 :", distant)
    } else {
      // console.log("cong cuoi la :")
      distant = getDistant(
        localArr[localArr.length - 1].lat,
        localArr[localArr.length - 1].long,
        localArr[i].lat,
        localArr[i].long,
      );
      // console.log("TCL: solveDistance -> distant 2 :", distant)
    }
    i = i + 2;
    financialDistanceResult += distant - 9;
  }
  return financialDistanceResult;
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
// convert Data To detail
function convertDataToTimeList(data) {
  // console.log("TCL: convertDataToTimeList -> data", data)
  let result = [];
  for (let i in data) {
    if (data[i].status == 'Disconnected') {
      if (data[i].timeStart == '00:00') {
        result.push({
          time: '00:00',
          title: 'Mất kết nối',
          description: `* Thời gian mất kết nối : ${convertThoiGianCuaDisconnect(
            data[i],
            'start',
          )}
`,
          circleColor: '#DC143C',
          lineColor: '#DC143C',
        });
      } else if (data[i].timeEnd == '23:59') {
        result.push({
          time: convertHours(data[i].timeStart),
          title: 'Mất kết nối',
          description: `* Thời gian mất kết nối : ${convertThoiGianCuaDisconnect(
            data[i],
            'end',
          )}
`,
          circleColor: '#DC143C',
          lineColor: '#DC143C',
        });
        result.push({
          time: '23:59',
          title: '',
          circleColor: '#DC143C',
          lineColor: 'while',
        });
      } else {
        result.push({
          time: convertHours(data[i].timeStart),
          title: 'Mất kết nối',
          description: `* Thời gian mất kết nối : ${convertThoiGianCuaDisconnect(
            data[i],
            'midble',
          )}
`,
          circleColor: '#DC143C',
          lineColor: '#DC143C',
        });
      }
    } else {
      if (data[i].status == 'Stop') {
        result.push({
          detail: data[i].detail,
          time: convertHours(data[i].detail[0].hh),
          title: 'Dừng',
          description: `* Thời gian Dừng : ${convertThoiGianHoatDongStatus(
            data[i].detail,
          )}
`,
          circleColor: '#FFA500',
          lineColor: '#FFA500',
        });
      } else {
        result.push({
          detail: data[i].detail,
          time: convertHours(data[i].detail[0].hh),
          title: 'Di chuyển',
          //           description: `* Thời gian di chuyển : ${convertThoiGianHoatDongStatus(
          //             data[i].detail,
          //           )}
          // * Vận tốc trung bình : vanToc
          // * Quãng đường đi được : khoanCach`,
          timeMove: `${convertThoiGianHoatDongStatus(data[i].detail)}`,
          description: '',
          circleColor: '#66e359',
          lineColor: '#66e359',
        });
      }
    }
  }
  // console.log("TCL: convertDataToTimeList -> result", result)
  return result;
}
// cover thoi gian di duoc
function convertThoiGianHoatDongStatus(data) {
  let result = '';
  if (data.length > 0) {
    let time = data[data.length - 1].hh - data[0].hh;
    time = time / 1000 - (time % 1000) / 1000;
    if (time / 3600 - (time % 3600) / 3600 > 0) {
      result += time / 3600 - (time % 3600) / 3600 + ' Giờ ';
      time = time % 3600;
    }
    if (time / 60 > 0) result += time / 60 - (time % 60) / 60 + 1 + ' Phút ';
  }
  return result;
}
function convertThoiGianCuaDisconnect(data, kind) {
  let result = '';
  let time = null;
  if (kind == 'start') {
    time = new Date(data.timeEnd);
    if (time.getHours() > 0) result += time.getHours() + ' Giờ ';
    result += time.getMinutes() + ' Phút';
  } else if (kind == 'midble') {
    time = data.timeEnd - data.timeStart;
    time = time / 1000 - (time % 1000) / 1000;
    if (time / 3600 - (time % 3600) / 3600 > 0) {
      result += time / 3600 - (time % 3600) / 3600 + ' Giờ ';
      time = time % 3600;
    }
    if (time / 60 > 0) result += time / 60 - (time % 60) / 60 + 1 + ' Phút ';
  } else {
    // disconect cuoi ngay
    time = new Date(data.timeStart);
    if (24 - time.getHours() > 0) result += 24 - time.getHours() + ' Giờ ';
    result += 60 - time.getMinutes() + ' Phút';
  }
  return result;
}
// covert hours
function convertHours(stamp) {
  let k = new Date(stamp);
  let time = '';
  if (k.getHours() < 10) time += '0';
  time += k.getHours() + ':';
  if (k.getMinutes() < 10) time += '0';
  time += k.getMinutes() + '';
  return time;
}
// [Map]
function COnvertToPolyline(detail, data, kk) {
  let index = Number(kk);
  let result2 = [];
  for (let i in detail) {
    result2.push({latitude: detail[i].lat, longitude: detail[i].long});
  }
  // noi voi diem phia sau cho min
  if (index > 0) {
    if (data[index - 1].title == 'Dừng') {
      result2.unshift({
        latitude: data[index - 1].detail[0].lat,
        longitude: data[index - 1].detail[0].long,
      });
    }
  }
  // noi voi diem phia trươc cho min
  if (index < data.length - 1) {
    if (data[index + 1].title == 'Dừng') {
      result2.push({
        latitude: data[index + 1].detail[0].lat,
        longitude: data[index + 1].detail[0].long,
      });
    }
  }

  return result2;
}

// [MapUser]
function getDataGo(GoData) {
  // console.log("TCL: getDataGo -> GoData", GoData)
  // lay pointWay de hien thi duong di [array]
  let steps = GoData.steps;
  // console.log("TCL: getDataGo -> GoData.steps", GoData.steps)
  let pointWay = [];
  for (let i in steps) {
    if (i == 0) {
      pointWay.push({
        latitude: steps[i].start_location.lat,
        longitude: steps[i].start_location.lng,
      });
      pointWay.push({
        latitude: steps[i].end_location.lat,
        longitude: steps[i].end_location.lng,
      });
    } else {
      pointWay.push({
        latitude: steps[i].end_location.lat,
        longitude: steps[i].end_location.lng,
      });
    }
  }
  // co ket qua duong di
  // console.log("TCL: getDataGo -> pointWay", pointWay)
  //  lay pointInfor
  let pointInfor = {latitude: 33.12, longitude: 33.34};
  if (pointWay.length > 2) {
    pointInfor.latitude = pointWay[Math.floor(pointWay.length / 2)].latitude;
    pointInfor.longitude = pointWay[Math.floor(pointWay.length / 2)].longitude;
  }
  return {
    distance: GoData.distance.text,
    duration: GoData.duration.text,
    end_address: GoData.end_address,
    end_location: GoData.end_location,
    start_address: GoData.start_address,
    start_location: GoData.start_location,
    pointWay: pointWay,
    pointInfor: pointInfor,
  };
}

// xu ly  hien thi vi tri theo doi khi da chon gio
function getPosition(data1, data2) {
  // console.log('TCL: getPosition -> data2', data2);
  // console.log('TCL: getPosition -> data1', data1);
  let minTime = 1441; //gia tri thoi gian nho nhat (sau khi tru di data1)
  let valueOfMinTime = {title:"",description:"",position:{latitude: 10.804366049999999, longitude: 106.63990885}};
  try {
    for (let i in data2) {
      if (data2[i].title != 'Mất kết nối' && data2[i].title != '') {
        let arrDetail = data2[i].detail;
        //  duoi day la Dung hoac di chuyen ,ben trong no co 1 mang detail
        for (let k in arrDetail) {
          // lay du lieu ngay ra tinh
          let timeInData2 = convertMinute(arrDetail[k].hh);
          if (Math.abs(timeInData2 - data1) < minTime) {
            // neu ma co cai nho hon thi lay cai nho do
            minTime = Math.abs(timeInData2 - data1);
            valueOfMinTime = {
              title: data2[i].title,
              description:data2[i].title=="Di chuyển"?`Di chuyển: ${data2[i].timeMove}`: data2[i].description,
              position: {
                latitude: arrDetail[k].lat,
                longitude: arrDetail[k].long,
              },
            };
          }
        }
      }
    }

    // xu ly neu minTime qua lon, co nghia la no bi mat ket noi
    if(minTime>3){//no la mat ket noi
      valueOfMinTime.title="Mất kết nối."
      valueOfMinTime.description="Mất kế nối tại đây."
    }
    return valueOfMinTime
  } catch (e) {
    return valueOfMinTime
  }
}
function convertMinute(time) {
  let timeMinute = new Date(time);
  return timeMinute.getHours() * 60 + timeMinute.getMinutes();
}
export {
  dataConvertFromServer,
  convertDataDetail,
  convertDataToTimeList,
  COnvertToPolyline,
  convertDistantV,
  getDataGo,
  getDayNow,
  convertDeg,
  getPosition,
};
