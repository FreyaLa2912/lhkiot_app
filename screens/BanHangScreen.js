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
import { hangHoaService, banHangService } from '@services';
import connectionStore from '@stores/system/connectionStore';
import { FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomSheet from 'reanimated-bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import { numbericFormat } from '@utils';
import cartStore from '@stores/system/cartStore';
import Toast from 'react-native-toast-message';
import 'react-native-get-random-values';

import { v4 as uuidv4 } from 'uuid';
import SelectDropdown from 'react-native-select-dropdown';

const window = Dimensions.get('window');
export default function BanHangScreen_v2({ navigation }) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const { rootUrl } = connectionStore.getState().apiConnection;
  const [dataSource, setDataSource] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 0,
    searchData: {
      keyWord: '',
      showActive: true,
    },
    loadedItems: 8,
  });
  const sheetRef = useRef(null);
  const [showPicker, setShowPicker] = useState(false);
  const [opacity, setOpacity] = useState(new Animated.Value(0));
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const fetchData = async () => {
    setDataSource({ ...dataSource, isLoading: true });

    const params = {
      page: dataSource.page,
      pageSize: dataSource.pageSize,
      keyWord: searchKeyword,
      showActive: dataSource.searchData.showActive,
    };
    const res = await hangHoaService.getHangHoa(params);
    if (res && res.Data) {
      res.Data.forEach((item) => {
        if (item.TepHinh) {
          item.TepHinh = `${rootUrl}/${item.TepHinh}`;
        }
        const { GiaBan, TenDonViTinh, MaDonViTinh } = item.DonViTinhGiaBan[0];
        item.TenDonViTinh = TenDonViTinh;
        item.GiaBan = GiaBan;
        item.MaDonViTinh = MaDonViTinh;
      });
      setDataSource({
        ...dataSource,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
    } else {
      setDataSource({
        ...dataSource,
        data: [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
      showToast('Không lấy được danh sách sản phẩm');
    }
    const getConfig = async () => {
      try {
        const response = await hangHoaService.getHangHoa(params);
        const { data: { pageSize } } = response;
        setDataSource((prevDataSource) => ({
          ...prevDataSource,
          pageSize,
        }));
      } catch (error) {
        console.log(error);
      }
    };
    
  };
  useEffect(() => {
    fetchData();
  
  }, [searchKeyword]);
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
  const handleLoadMore = () => {
    // Update the loadedItems count to load more items
    setDataSource({
      ...dataSource,
      loadedItems: dataSource.loadedItems + 8,
    });
  };
  // Load more items
  const renderLoadMoreButton = () => {
    if (dataSource.loadedItems < dataSource.data.length) {
      return (
        <TouchableOpacity onPress={handleLoadMore} style={styles.loadMoreButton}>
          <Text style={styles.loadMoreText}>Xem thêm</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const handleClickIconAdd = (item) => {
    sheetRef.current.snapTo(2);
    const id = uuidv4();
    setSelectedProduct({ ...item, SoLuong: 1, ThanhTien: item.GiaBan, id });
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
        <View
          style={{
            borderColor: '#96f29e',
            borderWidth: 1,
            borderRadius: 5,
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <View style={{ width: '20%' }}>
            <Image style={{ width: '100%', height: 90 }} source={{ uri: item.TepHinh }} />
          </View>
          <View style={{ width: '65%', paddingVertical: 10, paddingLeft: 20 }}>
            <Text numberOfLines={2}>{item.TenHang}</Text>
            <Text style={{ color: '#e53b32', fontWeight: 'bold' }}>{numbericFormat(item.GiaBan)}</Text>
            <Text style={{ color: '#707070' }}>{item.TenDonViTinh}</Text>
          </View>
          <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
            <Icon onPress={() => handleClickIconAdd(item)} name="plus-circle" color={'#e53b32'} size={35}></Icon>
          </View>
        </View>
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
              <View style={{ marginTop: 30, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, marginRight: 20 }}>Đơn vị tính</Text>
                <View>
                  <SelectDropdown
                    data={selectedProduct?.DonViTinhGiaBan}
                    defaultValue={selectedProduct?.MaDonViTinh}
                    style={{}}
                    defaultButtonText={selectedProduct?.TenDonViTinh}
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
                      return selectedItem.TenDonViTinh;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item.TenDonViTinh;
                    }}
                  />              
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
                >
                  <Text style={{ color: '#ef1724', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
                    Thanh toán
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 180,
                    height: 50,
                    backgroundColor: '#EF1724',
                    borderRadius: 50,
                    justifyContent: 'center',
                  }}
                  onPress={handleAddToCart}
                >
                  <Text style={{ color: '#ffff', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
                    Thêm vào giỏ
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

  const handleAddToCart = () => {
    const { MaHang, MaDonViTinh, GiaBan, SoLuong, ThanhTien, TepHinh, DonViTinhGiaBan, TenHang, TenDonViTinh, id } =
      selectedProduct;
    setCart((item) => [
      {
        MaHang,
        MaDonViTinh,
        GiaBan,
        SoLuong,
        ThanhTien,
        TepHinh,
        DonViTinhGiaBan,
        TenHang,
        TenDonViTinh,
        id,
      },
      ...item,
    ]);
    handleClosePicker();
  };
  useEffect(() => {
    //console.log(cart);
  }, [cart]);
  const dispatchSetCart = cartStore((state) => state.dispatchSetCart);

  const handleFinishOrder = async () => {
    dispatchSetCart(cart);
    setCart([]);
    navigation.navigate('KetThucDonHang');
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
  <TextInput
    style={styles.searchInput}
    placeholder="Tìm kiếm sản phẩm"
    value={searchKeyword}
    onChangeText={(text) => setSearchKeyword(text)}
  />
     <Icon name="search" style={styles.searchIcon} onPress={() => fetchData()} />

        </View>
</View>
      <View style={styles.container}>
        <FlatList
          data={dataSource.data.slice(0, dataSource.loadedItems)}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          enableEmptySections={true}
          renderItem={ItemView}
          ListFooterComponent={renderLoadMoreButton} // Render the "Load more" button at the end of the list
        refreshing={dataSource.isLoading}
        onRefresh={fetchData}
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
  loadMoreButton: {
    backgroundColor: '#8BC34A',
    borderRadius: 25,
    width: 200,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },
  loadMoreText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 10,
    },
    searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 50,
    width: '100%',
    },
    searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
    },
    searchIcon: {
    color: '#54de1d',
    fontSize: 24,
    },
});

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);
