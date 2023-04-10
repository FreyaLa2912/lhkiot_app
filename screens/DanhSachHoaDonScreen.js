import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  Animated,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Pressable,
  Platform,
  Alert,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import { numbericFormat } from '@utils';

import { banHangService } from '@services';
import { SafeAreaView } from 'react-native-safe-area-context';

const DanhSachHoaDonScreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hoaDons, setHoaDons] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await banHangService.getBanHang();
        setHoaDons(data.Data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <View style={{flex: 1, 
        flexDirection:'row', 
        borderRadius: 10,
        borderColor: '#000',
        borderWidth: 1,
        marginHorizontal:2,
        backgroundColor: '#f0f0f0',
        marginBottom: 8}}>
        <View style={{ 
          marginVertical: 8,
          width: '15%',
          justifyContent:'center', 
          alignItems:'center',
          
          }}>
          <View
              style={{
                width: 40,
                height: 40,
                borderWidth: 1,
                borderRadius: 50,
                justifyContent: 'center',
              }}
            >
              <Text style={{ textAlign: 'center', fontSize:20 }}>{(index+1)}</Text>
          </View> 
           
        </View>
        <View  style={styles.item}>
          <Text style={styles.title}>{'Người tạo: ' + item.createdName}</Text>
          <Text>{'Hình thức thanh toán: '+item.TenHinhThucThanhToan}</Text>
          <Text>{'Tổng tiền: '+numbericFormat(item.TongTien) +'đ'}</Text>
          <Text>{'Thời gian tạo: '+item.createdDate}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex:1}}>
      <View style={styles.container}>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text>Something went wrong...</Text>
        ) : (
          <FlatList
            data={hoaDons}
            renderItem={renderItem}
            keyExtractor={(item) => item.MaBanHang.toString()}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    height: '100%',
    backgroundColor: '#fff',
    padding: 10,
  },
  item: {
    paddingVertical: 8,
    marginVertical: 8,
    width: '85%',
    marginHorizontal: 8,
    borderRadius: 10,
  },
  title: {
    fontSize: 32,
  },
});

export default DanhSachHoaDonScreen;
