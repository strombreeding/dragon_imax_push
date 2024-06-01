import {isEqual} from 'lodash';
import {Fragment, memo, useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, StatusBarStyle, View} from 'react-native';

interface ISafeAreaViewProps {
  children: React.ReactNode;
  topColor?: string;
  botColor?: string;
  barColor?: StatusBarStyle;
}
function SafeAreaViewCustom({
  children,
  topColor,
  botColor,
  barColor,
}: ISafeAreaViewProps) {
  // barColor 는 전역상태관리해야됨
  if (botColor == null) {
    botColor = '#181A1D';
  }

  if (topColor == null) {
    topColor = '#181A1D';
  }

  useEffect(() => {
    if (barColor == null) {
      barColor = 'light-content';
    }

    StatusBar.setBarStyle(barColor, false);
  }, [barColor]);
  return (
    <Fragment>
      <SafeAreaView style={{flex: 0, backgroundColor: topColor}} />
      <SafeAreaView style={{flex: 1, backgroundColor: botColor}}>
        {children}
      </SafeAreaView>
    </Fragment>
  );
}

export default SafeAreaViewCustom;
// export default memo(SafeAreaViewCustom, areEqual);
