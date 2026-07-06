import { StyleSheet, TextInput, View } from 'react-native'
import React from 'react'

const Input = (props) => {
  return (
    <View 
      style={[styles.container, props.containerStyle && props.containerStyle]}>
      {props.icon && props.icon}
      <TextInput 
        style={[styles.input, props.inputStyle]}
        placeholderTextColor={'#a3a3a3'}
        ref={props.inputRef && props.inputRef}
        {...props}
      />
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: '#d4d4d4',
    borderRadius: 17,
    borderCurve: "continuous",
    paddingHorizontal: 15,
    gap: 10,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14
  }
})