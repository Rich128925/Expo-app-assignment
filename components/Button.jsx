import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Loading from './Loading'

const Button = ({
  style,
  onPress,
  loading = false,
  children
}) => {

  if (loading) {
    return (
      <View style={[styles.button, style, {backgroundColor: "transparent",}]}>
          {/** loading */}
          <Loading />
      </View>
    )
  }

  return (
   <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      {children}
   </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
  button: {
   backgroundColor: '#16a34a',
   borderRadius: 17,
   borderCurve: "continuous",
   height: 52,
   justifyContent: "center",
   alignItems: "center"
  }
})