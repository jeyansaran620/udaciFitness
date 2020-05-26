import React from 'react';
import {View,Text,StyleSheet,Platform,TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {addEntry, receiveEntries} from '../actions';
import {timeToString,getDailyRemainderValue} from '../utils/helpers';
import { fetchCalendarResults } from '../utils/api';
import UdaciFitnessCalendar from 'udacifitness-calendar-fix';
import DateHeader from './DateHeader';
import { white } from '../utils/colors';
import MetricCard from './MetricCard';
import {AppLoading} from 'expo'

class History extends React.Component
{
    state =
    {
        ready:false
    }
    componentDidMount()
    {
    const {dispatch} = this.props;
    fetchCalendarResults()
    .then((entries) => dispatch(receiveEntries(entries)))
    .then((entries) => {
        if(!entries[timeToString()])
        {
            dispatch(addEntry({
                [timeToString()]:getDailyRemainderValue()
            }))
        }
    })
    .then(() =>this.setState({ready:true}))
    }
  
    renderItem = ({ today, ...metrics }, formattedDate, key) => (
        <View style={styles.item}>
          {today
            ? <View >
                 <DateHeader date={formattedDate} />
                 <Text style={styles.noDataText}>
                    {today}
                 </Text>
                </View>
            : <TouchableOpacity onPress={()=>this.props.navigation.navigate(
                'EntryDetail',
                {entryId : key}
            )}>
             <MetricCard date={formattedDate} metrics={metrics} />
            </TouchableOpacity>
            }
        </View>
      )
      renderEmptyDate(formattedDate) {
        return (
          <View style={styles.item}>
              <DateHeader date={formattedDate} />
            <Text style={styles.noDataText}>
                You didn't log data for this day
                </Text>
          </View>
        )
      }
    render()
    {
        const {entries} = this.props;
       const {ready} = this.state
       if (!ready)
       {
           return <AppLoading />
       }
        return( 
       <UdaciFitnessCalendar 
         items={entries}
         renderItem={this.renderItem}
         renderEmptyDate={this.renderEmptyDate}
       />
        )
    }
}

const styles = StyleSheet.create({
    item:{
        backgroundColor:white,
        borderRadius:Platform.OS === 'ios' ? 16 : 12,
        padding:20,
        marginLeft:10,
        marginRight:10,
        marginTop:17,
        justifyContent:'center',
        shadowRadius:3,
        shadowOpacity:0.8,
       shadowColor:'rgba(0,0,0,0.24)',
       shadowOffset:{
           width:0,
           height:3
       } 
    },
    noDataText:{
        fontSize:20,
        paddingTop:15,
        paddingBottom:15,      
          }
})
function mapStateToProps(entries)
{
    return {
        entries
    }
}

export default connect(mapStateToProps)(History); 