import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Timeline from 'react-native-timeline-flatlist';
import {convertDataToTimeList} from '../../../../common/myFunction'
export default class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };

    this.data = [
      {
        time: '09:00',
        title: 'Di Chuyển',
        description: `* Vận tốc trung bình : 25 (km/h)
* Quãng đường đi được : 5 (km)
* Đi được khoảng thời gian : 60 (phút)
* Điểm xuất phát : 26 Cộng Hòa,phường 13,Tân Bình
* Điểm kết thúc :30 Ngô Đức kế,Bình Thành,tpHCM`,
        circleColor: '#61ad55',
        lineColor: '#61ad55',
      },
      {
        time: '10:45',
        title: 'Dừng',
        description: `Thời gian dừng : 120 (phút)`,
        circleColor: '#d63a1e',
        lineColor: '#d63a1e',
      },
      {
        time: '12:45',
        title: 'Di Chuyển',
        description: `* Vận tốc trung bình : 55 (km/h)
* Đi được khoảng thời gian : 60 (phút)
* Điểm xuất phát : 26 Cộng Hòa,phường 13,Tân Bình
* Điểm kết thúc :30 Ngô Đức kế,Bình Thành,tpHCM`,
        circleColor: '#61ad55',
        lineColor: '#61ad55',
      },
      {
        time: '10:45',
        title: 'Dừng',
        description: `Thời gian dừng : 80 (phút)`,
        circleColor: '#d63a1e',
        lineColor: '#d63a1e',
      },
      {
        time: '00:00',
        title: 'Dừng',
        description: `Thời gian dừng : N/A (phút)`,
        circleColor: '#d63a1e',
        lineColor: '#d63a1e',
      },
    ];
  }
  // componentDidMount() {
  //   let {data} = this.props;
  //   console.log('TCL: Detail -> componentDidMount -> data 1', data);
  //   let dataConvert=convertDataToTimeList(data)
  //   this.setState({
  //     data: dataConvert,
  //   });
  // }
  // 
  render() {
    let {data} = this.props;
    console.log('TCL: Detail -> componentDidMount -> data 1', data);
    let dataConvert=convertDataToTimeList(data)

    return (
      <View style={styles.container}>
        <Timeline
          style={styles.list}
          data={dataConvert}
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
          descriptionStyle={{color: 'gray'}}
          innerCircle={'dot'}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 20,
  },
  list: {
    flex: 1,
    marginTop: 5,
  },
});
