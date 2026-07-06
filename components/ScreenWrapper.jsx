import { Dimensions, Platform, StatusBar, View } from 'react-native'
import React from 'react'

const { height } = Dimensions.get("window")

const ScreenWrapper = ({style, children}) => {

  let paddingTop = Platform.OS === "android" ? height * 0.06 : 50;

  return (
    <View style={[
      {
        paddingTop,
        flex: 1,
        backgroundColor: '#262626',
      }
    ]}>
      <StatusBar barStyle="light-content"/>
      {children}
    </View>
  )
}

export default ScreenWrapper

