import React from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { banHangService } from '@services';
import { commonDetailService } from '@services/system';
import connectionStore from '@stores/system/connectionStore';
import { FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomSheet from 'reanimated-bottom-sheet';
//import { Picker } from '@react-native-picker/picker';
import { numbericFormat } from '@utils';
import cartStore from '@stores/system/cartStore';
import Toast from 'react-native-toast-message';
import Picker from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

const window = Dimensions.get('window');

export default function KetThucDonHangScreen({ navigation }) {
  const [cart, setCart] = useState([]);
  const [hinhThucThanhToan, setHinhThucThanhToan] = useState([]);
  const [selectedHTTT, setSelectedHTTT] = useState(null);
  const sheetRef = useRef(null);
  const [showPicker, setShowPicker] = useState(false);
  const [opacity, setOpacity] = useState(new Animated.Value(0));
  const [selectedProduct, setSelectedProduct] = useState(null);

  const getHinhThucThanhToan = async () => {
    const result = await commonDetailService.getAllByMasterCode({
      commonMasterCode: '004',
      isActived: true,
      keyWord: '',
      page: 1,
      pageSize: 100,
    });
    setHinhThucThanhToan(result?.Data ?? []);
    if (result?.Data && result.Data.length > 0) {
      setSelectedHTTT(result.Data[0]);
    }
    console.log(result);
  };
  useEffect(() => {
    const unsub = cartStore.subscribe(({ cart }) => {
      setCart(cart);
    });
    getHinhThucThanhToan();
    return unsub;
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setCart(cartStore.getState().cart);
      console.log('focus ketThuc');
    });
    return unsubscribe;
  }, [navigation]);
  const showToast = (text1) => {
    Toast.show({
      type: 'info',
      text1,
    });
  };
  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 5,
          width: '100%',
        }}
      />
    );
  };

  const handleClickItem = (item) => {
    sheetRef.current.snapTo(2);
    setSelectedProduct({ ...item });
    setShowPicker(true);
    Animated.timing(opacity, {
      toValue: 0.7,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const ItemView = ({ item }) => {
    return (
      // Flat List Item
      <View style={{ width: '100%' }}>
        <TouchableOpacity
          onPress={() => handleClickItem(item)}
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
          <View style={{ width: '10%', alignItems: 'center', justifyContent: 'center', marginHorizontal: 5 }}>
            <View
              style={{
                width: 35,
                height: 35,
                backgroundColor: '#EF17241A',
                borderRadius: 50,
                justifyContent: 'center',
              }}
            >
              <Text style={{ textAlign: 'center' }}>{item.SoLuong}</Text>
            </View>
          </View>
          <View style={{ width: '5%', alignItems: 'center', justifyContent: 'center' }}>
            <View>
              <Text style={{ textAlign: 'center' }}>X</Text>
            </View>
          </View>
          <View style={{ width: '60%', paddingVertical: 10, paddingLeft: 10 }}>
            <Text numberOfLines={2}>{item.TenHang}</Text>
            <Text style={{ color: '#e53b32', fontWeight: 'bold' }}>{numbericFormat(item.ThanhTien)}</Text>
            <Text style={{ color: '#707070' }}>{item.TenDonViTinh}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const changeQty = (type, value) => {
    let SoLuong = selectedProduct.SoLuong;
    switch (type) {
      case 'plus':
        SoLuong = !isNaN(SoLuong) ? Number(SoLuong) + 1 : SoLuong;
        break;
      case 'minus':
        if (SoLuong > 1) {
          SoLuong = !isNaN(SoLuong) ? Number(SoLuong) - 1 : SoLuong;
        }
        break;
      default:
        SoLuong = value;
        break;
    }
    if (!SoLuong || isNaN(SoLuong)) setSelectedProduct((item) => ({ ...item, SoLuong }));
    else setSelectedProduct((item) => ({ ...item, SoLuong, ThanhTien: SoLuong * item.GiaBan }));
  };

  const renderProductPicker = () => (
    <DismissKeyboard>
      <View
        style={{
          backgroundColor: '#fff',
          padding: 16,
          width: '100%',
          height: '100%',
        }}
      >
        {selectedProduct && (
          <React.Fragment>
            <View style={{ height: '60%' }}>
              <Text
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontSize: 20,
                }}
              >
                Chọn chi tiết
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '20%' }}>
                  <Image style={{ width: '100%', height: 90 }} source={{ uri: selectedProduct.TepHinh }} />
                </View>
                <View style={{ width: '80%', paddingVertical: 10, paddingLeft: 20 }}>
                  <Text numberOfLines={3}>{selectedProduct.TenHang}</Text>
                  <Text style={{ color: '#e53b32', fontWeight: 'bold' }}>{numbericFormat(selectedProduct.GiaBan)}</Text>
                  <Text style={{ color: '#707070' }}>{selectedProduct.TenDonViTinh}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <View>
                  <Text style={{ fontSize: 20 }}>Số lượng:</Text>
                </View>
                <View style={{ flexDirection: 'row', width: '80%', justifyContent: 'center', alignItems: 'center' }}>
                  <View>
                    <TouchableOpacity
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: '#ef1724',
                        borderRadius: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => changeQty('minus')}
                    >
                      <Icon size={20} color={'#fff'} name="minus" />
                    </TouchableOpacity>
                  </View>
                  <View style={{ marginHorizontal: 20, width: 100 }}>
                    <TextInput
                      //inputMode="numeric"
                      keyboardType="numeric"
                      focusable
                      onChangeText={(newText) => changeQty(null, newText)}
                      value={selectedProduct.SoLuong.toString()}
                      textAlign="center"
                      style={{ fontSize: 20 }}
                      onBlur={() => {
                        if (isNaN(selectedProduct.SoLuong) || !selectedProduct.SoLuong) {
                          setSelectedProduct((item) => ({ ...item, SoLuong: 1, ThanhTien: item.GiaBan }));
                        }
                      }}
                    />
                  </View>
                  <View>
                    <TouchableOpacity
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: '#ef1724',
                        borderRadius: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => changeQty('plus')}
                    >
                      <Icon size={20} color={'#fff'} name="plus" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={{ marginTop: 30,flexDirection:"row",alignItems:"center" }}>
                <Text style={{ fontSize: 20,marginRight:15 }}>Đơn vị tính</Text>
                <View>
                <SelectDropdown
                data={selectedProduct.DonViTinhGiaBan}
                buttonStyle={{ backgroundColor: '#D1D5DB' }}
                defaultValue={selectedProduct?.MaDonViTinh}
                defaultButtonText={`${selectedProduct?.TenDonViTinh} - ${numbericFormat(selectedProduct?.GiaBan)}`}
                onSelect={(selectedItem, index) => {
                  const { GiaBan, TenDonViTinh, MaDonViTinh } = selectedItem;
                  setSelectedProduct((item) => ({
                    ...item,
                    GiaBan,
                    TenDonViTinh,
                    MaDonViTinh,
                    ThanhTien: GiaBan * item.SoLuong,
                  }));
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return `${selectedItem.TenDonViTinh} - ${numbericFormat(selectedItem.GiaBan)}`;
                }}
                rowTextForSelection={(item, index) => {
                  return `${item.TenDonViTinh} - ${numbericFormat(item.GiaBan)}`;
                }}
              />
                  {/* <Picker
                    mode="dropdown"
                    selectedValue={selectedProduct.MaDonViTinh}
                    style={{ height: 50 }}
                    onValueChange={(itemValue, itemIndex) => {
                      const { GiaBan, TenDonViTinh, MaDonViTinh } = selectedProduct.DonViTinhGiaBan[itemIndex];
                      setSelectedProduct((item) => ({
                        ...item,
                        GiaBan,
                        TenDonViTinh,
                        MaDonViTinh,
                        ThanhTien: GiaBan * item.SoLuong,
                      }));
                    }}
                  >
                    {selectedProduct.DonViTinhGiaBan.map((item) => (
                      <Picker.Item
                        key={item.MaDonViTinh}
                        label={`${item.TenDonViTinh} - ${numbericFormat(item.GiaBan)}`}
                        value={item.MaDonViTinh}
                      />
                    ))}
                  </Picker> */}
                </View>
              </View>
            </View>
            <View style={{ height: '20%', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 20 }}>Tổng tiền</Text>
                <Text style={{ fontSize: 20, color: '#EF1724' }}>{numbericFormat(selectedProduct.ThanhTien)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <TouchableOpacity
                  style={{
                    width: 180,
                    height: 50,
                    backgroundColor: '#EF17241A',
                    borderRadius: 50,
                    justifyContent: 'center',
                  }}
                  onPress={handleDelete}
                >
                  <Text style={{ color: '#ef1724', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>Xóa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 180,
                    height: 50,
                    backgroundColor: '#EF1724',
                    borderRadius: 50,
                    justifyContent: 'center',
                  }}
                  onPress={handleUpdate}
                >
                  <Text style={{ color: '#ffff', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
                    Cập nhật
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </React.Fragment>
        )}
      </View>
    </DismissKeyboard>
  );

  const handleClosePicker = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start();
    sheetRef.current.snapTo(0);
    setShowPicker(false);
    setSelectedProduct(null);
  };
  const renderBackDrop = () => (
    <Animated.View
      style={{
        opacity: opacity,
        backgroundColor: '#000',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <TouchableOpacity
        style={{
          width: window.width,
          height: window.height,
          backgroundColor: 'transparent',
        }}
        activeOpacity={1}
        onPress={handleClosePicker}
      />
    </Animated.View>
  );

  const handleUpdate = () => {
    const index = cart.findIndex((x) => x.id == selectedProduct.id);
    if (index != -1) {
      const copy = [...cart];
      copy[index] = selectedProduct;
      setCart(copy);
    }

    handleClosePicker();
  };

  const dispatchSetCart = cartStore((state) => state.dispatchSetCart);

  const handleFinishOrder = async () => {
    Alert.alert('Chú ý', 'Xác nhận bán hàng', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Đồng ý',
        style: 'destructive',
        onPress: async () => {
          const data = {
            HinhThucThanhToan: selectedHTTT.commonDetailId,
            DaThanhToan: true,
            ChiTiet: cart.map((x) => ({
              MaHang: x.MaHang,
              MaDonViTinh: x.MaDonViTinh,
              GiaBan: x.GiaBan,
              SoLuong: x.SoLuong,
              ThanhTien: x.ThanhTien,
            })),
          };
          console.log({ data });
          const { ResponseMessage } = await banHangService.createBanHang(data);
          if (ResponseMessage == 'general.success') {
            showToast('Bán hàng thành công');
            setCart([]);
            dispatchSetCart([]);
            setSelectedHTTT(hinhThucThanhToan[0]);
            navigation.navigate('BanHang');
          } else {
            showToast('Lỗi khi bán hàng');
          }
        },
      },
    ]);
  };

  const handleDelete = () => {
    setCart((item) => item.filter((x) => x.id !== selectedProduct.id));
    handleClosePicker();
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          data={cart}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          enableEmptySections={true}
          renderItem={ItemView}
        />
        {cart.length > 0 && (
          <>
            <View
              style={{
                flexDirection: 'row',
                borderRadius: 10,
                backgroundColor: '#D1D5DB',
                padding: 10,
                justifyContent: 'space-between',
                height: 50,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Đơn hàng</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                {cart.length} món - {numbericFormat(cart.map((item) => item.ThanhTien).reduce((a, b) => a + b))}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                borderRadius: 10,
                backgroundColor: '#D1D5DB',
                padding: 10,
                justifyContent: 'space-between',
                height: 50,
                alignItems: 'center',
                marginTop: 10,
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Hình thức thanh toán</Text>

              <SelectDropdown
                data={hinhThucThanhToan}
                buttonStyle={{ backgroundColor: '#D1D5DB' }}
                defaultValue={selectedHTTT?.commonDetailId}
                defaultButtonText={selectedHTTT?.commonDetailName}
                onSelect={(selectedItem, index) => {
                  setSelectedHTTT(selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem.commonDetailName;
                }}
                rowTextForSelection={(item, index) => {
                  return item.commonDetailName;
                }}
              />
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
                  Bán hàng
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      {showPicker && renderBackDrop()}
      <BottomSheet
        ref={sheetRef}
        snapPoints={['-10%', window.height * 0.5, window.height * 0.7, window.height * 0.85]}
        initialSnap={0}
        borderRadius={10}
        onCloseEnd={handleClosePicker}
        renderContent={renderProductPicker}
        enabledContentGestureInteraction={false}
      />
    </SafeAreaView>
  );
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
const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);
