import { ActivityIndicator, View } from 'react-native'
import React from 'react'

const Loading = ({
  size = "large",
  color = '#16a34a'
}) => {
  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: 'center'}}>
      <ActivityIndicator size={size} color={color}/>
    </View>
  )
}

export default Loading

