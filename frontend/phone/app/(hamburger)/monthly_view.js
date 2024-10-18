import { useEffect, useState } from 'react'; 
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { Calendar, CalendarList } from 'react-native-calendars';


export default function MonthlyView({ route, navigation }) {
    const [date] = useState(new Date());

    return (
        <CalendarList
            horizontal={true}
            pagingEnabled={true}
            onDayPress={day => {
                console.log('selected day', day);
            }}
        />
    );
}















const styles = StyleSheet.create({  
    body: {
        // backgroundColor: 'black',
        padding: 16
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        // color: 'white',
        textAlign: 'center',
        paddingBottom: 4
    },
});