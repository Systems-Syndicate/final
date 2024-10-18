import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import { Agenda } from 'react-native-calendars';

export default function App() {
    return (
        <Agenda
            items={{
                '2024-10-07': [{ name: 'Meeting 1', data: 'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. ' }],
                '2024-10-06': [{ name: 'Meeting 2', data: 'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. ' }],
                '2024-10-29': [{ name: 'Meeting 3', data: 'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. ' }],
                '2024-10-30': [{ name: 'Meeting 4', data: 'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. ' }],
                '2024-10-31': [{ name: 'Meeting 5', data: 'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. ' }],
                '2024-10-25': [{ name: 'Meeting 6', data: 'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. ' }]
            }}
            
            renderItem={(item, isFirst) => (
                <TouchableOpacity style={styles.item}>
                    <Text style={styles.itemText}>{item.name}</Text>
                    <Text style={styles.itemText}>{item.data}</Text>
                </TouchableOpacity>
            )}
            
            markedDates={{
                // '2024-10-07': { selected: true, marked: true },
                '2024-10-07': { marked: true }, // testing purposes
                '2024-10-29': { marked: true },
                '2024-10-12': { disabled: true } // testing purposes
            }}
            // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly
            onRefresh={() => console.log('refreshing...')}
            // Set this true while waiting for new data from a refresh
            refreshing={false}
            // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView
            refreshControl={null}
            // Agenda theme
            theme={{
                agendaDayTextColor: 'red',
                agendaDayNumColor: 'green',
                agendaTodayColor: 'red',
                agendaKnobColor: 'lightblue'
            }}
            // Agenda container style
            style={{}}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    item: {
        backgroundColor: 'lightblue',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 25,
        paddingBottom: 20
    },
    itemText: {
        color: 'black',
        fontSize: 16,
    }
});


