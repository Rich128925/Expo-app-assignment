import { Text } from 'react-native'
import React from 'react'

const Typo = ({
  size,
  color = '#f8f7f7',
  fontWeight = '400',
  children,
  style,
  textProps = {}
}) => {
  const textStyle = {
    fontSize: size ? size : 18,
    color,
    fontWeight,
  }
  return (
    <Text style={[textStyle, style]} {...textProps}>
      {children}
    </Text>
  )
}

export default Typo

