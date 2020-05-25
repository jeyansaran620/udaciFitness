import React, { Component } from 'react'
import { View, TouchableOpacity, Text ,Platform,StyleSheet} from 'react-native'
import { getMetricMetaInfo, timeToString ,getDailyRemainderValue} from '../utils/helpers'
import MySlider from './MySlider'
import MyStepper from './MyStepper'
import DateHeader from './DateHeader'
import { Ionicons } from '@expo/vector-icons'
import TextButton from './TextButton'
import { submitEntry, removeEntry } from '../utils/api'
import {connect} from 'react-redux';
import {addEntry} from '../actions';
import {white, lightPurp } from '../utils/colors';
import {NavigationActions} from 'react-navigation';

function SubmitBtn ({ onPress }) {
  return (
    <TouchableOpacity style={Platform.OS==='ios' ? styles.iosSubmitBtn: styles.androidSubmitBtn}
      onPress={onPress}>
        <Text style={ styles.submitBtnText}>SUBMIT</Text>
    </TouchableOpacity>
  )
}

 class AddEntry extends Component {

  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0,
  }


  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric)

    this.setState((state) => {
      const count = state[metric] + step

      return {
        ...state,
        [metric]: count > max ? max : count,
      }
    })
  }

  decrement = (metric) => {
    this.setState((state) => {
      const count = state[metric] - getMetricMetaInfo(metric).step

      return {
        ...state,
        [metric]: count < 0 ? 0 : count,
      }
    })
  }

  slide = (metric, value) => {
    this.setState(() => ({
      [metric]: value
    }))
  }

  submit = () => {

    const key = timeToString()
    const entry = this.state

    this.props.dispatch(addEntry({
      [key]:entry
    }))

    this.setState(() => ({ run: 0, bike: 0, swim: 0, sleep: 0, eat: 0 }))

    this.toHome()

    submitEntry({ key, entry })

    // Clear local notification
  }

  
  reset = () => {

    const key = timeToString()

    this.props.dispatch(addEntry({
      [key]:getDailyRemainderValue()
    }))


    this.toHome()

    removeEntry(key)
  }

toHome = () =>
{
  this.props.navigation.dispatch(NavigationActions.back({
    key: 'AddEntry'
  }))
}

  render() {
    const metaInfo = getMetricMetaInfo()

    if(this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
          <Ionicons
            name={Platform.OS === 'ios' ? 'ios-happy-outline' : 'md-happy'}
            size={100}
          />
          <Text>You already logged your information for today.</Text>
          <TextButton onPress={this.reset} style={{padding:10}}>
            Reset
          </TextButton>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <DateHeader date={(new Date()).toLocaleDateString()}/>
        {Object.keys(metaInfo).map((key) => {
          const { getIcon, type, ...rest } = metaInfo[key]
          const value = this.state[key]

          return (
            <View key={key} style={styles.row}>
              {getIcon()}
              {type === 'slider'
                ? <MySlider
                    value={value}
                    onChange={(value) => this.slide(key, value)}
                    {...rest}
                  />
                : <MyStepper
                    value={value}
                    onIncrement={() => this.increment(key)}
                    onDecrement={() => this.decrement(key)}
                    {...rest}
                  />}
            </View>
          )
        })}
        <SubmitBtn onPress={this.submit} />
      </View>
    )
  }
}

const styles =StyleSheet.create({
  container:{
    flex:1,
    padding:20,
    backgroundColor:white
  },
  row:{
    flexDirection:'row',
    alignItems:'center',
    margin:25,
  },
  iosSubmitBtn:{
  backgroundColor:lightPurp,
  padding:18,
  borderRadius:8,
  height:45,
  marginLeft:40,
  marginRight:40
  },
  androidSubmitBtn:{
    backgroundColor:lightPurp,
    padding:18,
    borderRadius:5,
    height:45,
    marginLeft:40,
    marginRight:40,
    justifyContent:'center',
    alignItems:'center'
    },
  submitBtnText:{
    color:'white',
    fontSize:20,
    textAlign:'center'
  },
  center:{
    flex:1,
    justifyContent:"center",
    alignItems:'center',
    marginRight:30,
    marginLeft:30
  }
})

function mapStateToProps(state)
{ 
  const key = timeToString()
  return {
    alreadyLogged :state[key] && typeof state[key].today === 'undefined'
  }

}

export default connect(mapStateToProps)(AddEntry)