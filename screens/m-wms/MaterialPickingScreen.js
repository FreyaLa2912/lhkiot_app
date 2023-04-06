import { Block, Text, theme } from 'galio-framework';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('screen');

const MaterialPickingScreen = () => {
  const renderContent = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      {/* <StatusBar hidden /> */}
      <Block flex>
        <Text>Material Picking Screen</Text>
      </Block>
    </ScrollView>
  );

  return (
    <Block flex center style={styles.container}>
      {renderContent()}
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  content: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
    // height: height,
  },
});

export default MaterialPickingScreen;
