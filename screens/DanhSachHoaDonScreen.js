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

  const renderItem = ({ item }) => {
    return (
      <View  style={styles.item}>
        <Text style={styles.title}>{item.MaBanHang}</Text>
        <Text>{item.TenHinhThucThanhToan}</Text>
        <Text>{item.TongTien}</Text>
        <Text>{item.createdDate}</Text>
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
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default DanhSachHoaDonScreen;
