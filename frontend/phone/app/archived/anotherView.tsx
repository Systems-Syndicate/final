import React, { useRef, useCallback } from 'react';
import isEmpty from 'lodash/isEmpty';
import { Alert, StyleSheet, TouchableOpacity, View, Text, Button } from 'react-native';
import { ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar } from 'react-native-calendars';

const today = new Date().toISOString().split('T')[0];
const fastDate = getPastDate(3);
const futureDates = getFutureDates(12);
const dates = [fastDate, today].concat(futureDates);

function getFutureDates(numberOfDays: number) {
  const array: string[] = [];
  for (let index = 1; index <= numberOfDays; index++) {
    let d = Date.now();
    
    if (index > 8) {
      // set dates on the next month
      const newMonth = new Date(d).getMonth() + 1;
      d = new Date(d).setMonth(newMonth);
    }
    const date = new Date(d + 864e5 * index); // 864e5 == 86400000 == 24*60*60*1000
    const dateString = date.toISOString().split('T')[0];
    array.push(dateString);
  }
  return array;
}

function getPastDate(numberOfDays: number) {
  return new Date(Date.now() - 864e5 * numberOfDays).toISOString().split('T')[0];
}

export const agendaItems = [
  {
    title: dates[0],
    data: [{hour: '9am', duration: '1h', title: 'Arlecchino Boss'}],
  },
  {
    title: dates[1],
    data: [
      {hour: '4pm', duration: '8h', title: 'Aranara Quest'}
    ]
  },
  {
    title: dates[2],
    data: [
      {hour: '1pm', duration: '2h', title: 'Furina Story Quest'}
    ]
  },
  {
    title: dates[3],
    data: [{hour: '12am', duration: '1h', title: 'Collecting Brilliant Chrysanthemum'}]
  },
  {
    title: dates[4],
    data: [{}]
  },
  {
    title: dates[5],
    data: [
      {hour: '10am', duration: '1h', title: 'Petting the Saurians'},
      {hour: '9pm', duration: '1h', title: 'Slapping SSADC'},
    ]
  },
  {
    title: dates[6],
    data: [
      {hour: '11am', duration: '3h', title: 'Building the motorbike for Mauvika'},
    ]
  },
  {
    title: dates[7],
    data: [{}]
  },
  {
    title: dates[8],
    data: [
      {hour: '9pm', duration: '1h', title: 'Vibing with Xilonen'},
    ]
  },
  {
    title: dates[9],
    data: [
      {hour: '1pm', duration: '1h', title: 'Swinging among the treetops with Kinich'},
      {hour: '2pm', duration: '1h', title: 'Gunslinging with Chasca'}
    ]
  },
  {
    title: dates[10],
    data: [
      {hour: '3pm', duration: '1h', title: 'Soaking in the hot spring with Mualani'}
    ]
  },
  {
    title: dates[11],
    data: [
      {hour: '10pm', duration: '1h', title: 'Feeding the saurians with Kachina'}
    ]
  },
  {
    title: dates[12],
    data: [
      
      {hour: '9am', duration: '2h', title: 'Surfing with Mualani'}
    ]
  },
  {
    title: dates[13],
    data: [
      {hour: '12am', duration: '4h', title: 'Natlan Archon Quest'}
    ]
  }
];

const ITEMS: any[] = agendaItems;

interface Props {
    weekView?: boolean;
}

interface ItemProps {
    item: any;
}

const AgendaItem = (props: ItemProps) => {
  const {item} = props;

  // const buttonPressed = useCallback(() => {
  //   Alert.alert('Show me more');
  // }, []);

  const itemPressed = useCallback(() => {
    Alert.alert(item.title);
  }, []);

  if (isEmpty(item)) {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>No Events Planned Today</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={itemPressed} style={styles.item}>
      <View>
        <Text style={styles.itemHourText}>{item.hour}</Text>
        <Text style={styles.itemDurationText}>{item.duration}</Text>
      </View>
      <Text style={styles.itemTitleText}>{item.title}</Text>
      

      {/* <View style={styles.itemButtonContainer}>
        <Button color={'grey'} title={'Info'} onPress={buttonPressed}/>
      </View> */}

    </TouchableOpacity>
  );
};



const ExpandableCalendarScreen = (props: Props) => {
    const { weekView } = props;
    const todayBtnTheme = useRef({
    });

    const renderItem = useCallback(({ item }: any) => {
        return <AgendaItem item={item} />;
    }, []);

    return (
        <CalendarProvider
            date={ITEMS[1]?.title}
            showTodayButton
            theme={todayBtnTheme.current}
        >
            <AgendaList
                sections={ITEMS}
                renderItem={renderItem}
            />
        </CalendarProvider>
    );
};

export default ExpandableCalendarScreen;

const styles = StyleSheet.create({
    calendar: {
        paddingLeft: 20,
        paddingRight: 20
    },
    header: {
        backgroundColor: 'lightgrey'
    },
    section: {
        color: 'grey',
        textTransform: 'capitalize'
    },
    item: {
    padding: 20,
    backgroundColor: 'black',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    flexDirection: 'row'
    },
    itemHourText: {
        color: 'white'
    },
    itemDurationText: {
        color: 'grey',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4
    },
    itemTitleText: {
        color: 'white',
        marginLeft: 16,
        fontWeight: 'bold',
        fontSize: 16
    },
    itemButtonContainer: {
        flex: 1,
        alignItems: 'flex-end'
    },
    emptyItem: {
        paddingLeft: 20,
        height: 52,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey'
    },
    emptyItemText: {
        color: 'lightgrey',
        fontSize: 14
    }
});