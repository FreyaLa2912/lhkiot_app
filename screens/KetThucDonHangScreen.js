import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import cartStore from '@stores/system/cartStore';

export default function KetThucDonHangScreen() {
  const { cart: cartData } = cartStore.getState();
  useEffect(() => {
    console.log('cart fn scrren', cartData);
  }, []);
  return (
    <View>
      <Text>KetThucDonHangScreen</Text>
    </View>
  );
}
