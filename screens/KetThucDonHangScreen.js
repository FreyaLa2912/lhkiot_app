import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { numbericFormat } from '@utils';

import cartStore from '@stores/system/cartStore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';



function KetThucDonHangScreen({ route, navigation}) {
  const { cart } = cartStore();
  
  const data = {
    HinhThucThanhToan: 63816302822834,
    DaThanhToan: true,
    ChiTiet: cart.map((x) => ({
      MaHang: x.MaHang,
      MaDonViTinh: x.MaDonViTinh,
      GiaBan: x.GiaBan,
      SoLuong: x.SoLuong,
      ThanhTien: x.ThanhTien,
    })),
  };
  
  const handleFinishOrder = async () => {
    alert('Đơn hàng đã được gửi đi');
  };
  
  return (
    <SafeAreaView style={{flex:1}}>
      <View >
        <View>
            {cart?.map((item, index) => (
            <View style={{ width: '100%'}} key={index}>
            <View
              style={{
                borderColor: '#E4E8EC',
                borderWidth: 1,
                borderRadius: 5,
                display: 'flex',
                flexDirection: 'row',
              }}
              >
              <View style={{ width: '20%' }}>
                <Image style={{ width: '100%', height: 90 }} source={{ uri: item.TepHinh }} />
              </View>
              <View style={{ 
                width: '60%', 
                paddingVertical: 10, 
                paddingLeft: 20, 
                flexDirection: 'row', 
                justifyContent: 'flex-start',
                alignItems: 'center'
                }}>
                
                <View style={{ 
                  backgroundColor: '#EEEEEE',
                  borderRadius: 30, 
                  alignItems: 'center',
                  justifyContent: 'center'
                  }}>
                  <Text style={{ paddingHorizontal:10,paddingVertical:6, color: 'blue', fontWeight: 'bold' }}>{item.SoLuong}</Text>
                </View>
                <Text style={{ color: '#707070', fontWeight: 'bold',  paddingLeft: 10 }}>x</Text>
                <Text style={{ color: '#707070', paddingLeft: 10 }}>{item.TenHang + ' - ' + ' (' + item.GiaBan +'/'+item.TenDonViTinh + ')'}</Text>
                
                
                
                
              </View>
              <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                
                {/* <Icon onPress={() => handleClickIconAdd(item)} name="plus-circle" color={'#e53b32'} size={25}></Icon> */}
                {/* <Text style={{ color: '#707070' , fontWeight: 'bold'}}>Tổng tiền: </Text> */}

                <Text style={{ color: '#e53b32' , fontWeight: 'bold'}}>{numbericFormat(item.GiaBan * item.SoLuong)+'đ'}</Text>

              </View>
            </View>
          </View>    
          ))}
        </View>
      
      {cart.length > 0 && (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#D1D5DB',
                  padding: 10,
                  justifyContent: 'space-between',
                  height: 50,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Đơn hàng</Text>
                <Text style={{ color: '#e53b32' , fontWeight: 'bold', fontSize: 18}}>
                  {numbericFormat(cart.map((item) => item.ThanhTien).reduce((a, b) => a + b)) + 'đ'}
                </Text>
              </View>
              <View style={{ marginTop: 20 }}>
                <TouchableOpacity
                  style={{ borderRadius: 50, height: 50, backgroundColor: '#EF1724', justifyContent: 'center' }}
                  onPress={handleFinishOrder}
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 18,
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    Hoàn tất đơn hàng
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

    </View>
  </SafeAreaView>
  )



}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    height: '100%',
    backgroundColor: '#fff',
    padding: 10,
  },
});

export default KetThucDonHangScreen
