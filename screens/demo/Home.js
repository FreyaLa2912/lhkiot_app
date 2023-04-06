import React from 'react';
import { StyleSheet, Dimensions, ScrollView, StatusBar } from 'react-native';
import { Block, theme } from 'galio-framework';

import { Card } from '@components';
import articles from '@constants/articles';
const { width, height } = Dimensions.get('screen');

const Home = () => {
  const renderArticles = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.articles}>
      {/* <StatusBar hidden /> */}
      <Block flex>
        <Card item={articles[0]} horizontal />
        <Block flex row>
          <Card item={articles[1]} style={{ marginRight: theme.SIZES.BASE }} />
          <Card item={articles[2]} />
        </Block>
        <Card item={articles[3]} horizontal />
        <Card item={articles[4]} full />
      </Block>
    </ScrollView>
  );

  return (
    <Block flex center style={styles.home}>
      {renderArticles()}
    </Block>
  );
};

const styles = StyleSheet.create({
  home: {
    width: width,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
    // height: height,
  },
});

export default Home;
