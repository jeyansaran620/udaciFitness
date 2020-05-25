  
import React from 'react'
import { View, TouchableOpacity, Text ,Platform,StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { white } from '../utils/colors'

export default function MyStepper ({ max, unit, step, value, onIncrement, onDecrement }) {
  return (
    <View style={[styles.row,{justifyContent:'space-between'}]}>
      <View  style={styles.row}>
        <TouchableOpacity onPress={onDecrement} style={[styles.iosBtn,{borderTopRightRadius:0,borderBottomRightRadius:0}]}>
          <FontAwesome name='minus' size={20} color={'black'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onIncrement} style={[styles.iosBtn,{borderTopLeftRadius:0,borderBottomLeftRadius:0}]}>
          <FontAwesome name='plus' size={20} color={'black'} />
        </TouchableOpacity>
      </View>
      <View style={styles.metricCounter}>
        <Text style={{fontSize:20,textAlign:'center'}}>{value}</Text>
        <Text style={{fontSize:16,color:'gray'}}>{unit}</Text>
      </View>
    </View>
  )
}

const styles =StyleSheet.create({
  row :{
    flex:1,
    flexDirection:'row',
  },
  iosBtn:{
  backgroundColor:white,
  borderColor:'black',
  borderWidth:1,
  padding:10,
  borderRadius:5,
  paddingLeft:15,
  paddingRight:15,
  },
  metricCounter:{
    width:85,
    justifyContent:'center',
    alignItems:'center',

  }
})