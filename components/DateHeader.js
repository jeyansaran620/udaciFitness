import React from 'react'
import { Text } from 'react-native'

export default function DateHeader ({ date }) {
  return (
    <Text style={{fontSize:18}}>
      {date}
    </Text>
  )
}