import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import cartStore from '@stores/system/cartStore';
import axios from 'axios';

export default function KetThucDonHangScreen() {
  const { cart: cartData } = cartStore.getState();//lấy giỏ hàng từ store


  useEffect(() => {
    console.log('cart fn screen', cartData);
  }, []);
  return (
    <View>
      <Text>KetThucDonHangScreen</Text>
    </View>
  );
}
