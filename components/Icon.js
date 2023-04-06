import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import { Icon } from 'galio-framework';

// import argonConfig from '@assets/config/argon.json';
// const ArgonExtra = require('@assets/font/argon.ttf');
// const IconArgonExtra = createIconSetFromIcoMoon(argonConfig, 'ArgonExtra');

import icoMoonConfig from '@assets/config/selection.json';
const IconCollection = require('@assets/font/icomoon.ttf');
const IconCollectionExtra = createIconSetFromIcoMoon(icoMoonConfig, 'IconCollection');

const IconExtra = ({ name, family, ...rest }) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      // await Font.loadAsync({ ArgonExtra: ArgonExtra });
      await Font.loadAsync({ IconCollection: IconCollection });
      setFontLoaded(true);
    })();
  }, []);

  if (name && family && fontLoaded) {
    if (family === 'IconCollection') {
      return <IconCollectionExtra name={name} family={family} {...rest} />;
    }
    return <Icon name={name} family={family} {...rest} />;
  }

  return null;
};

export default IconExtra;
