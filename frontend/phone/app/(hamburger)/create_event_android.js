import { useState, useEffect } from 'react';
import { format, isSameDay } from 'date-fns';
import { ThemedText } from '@/components/ThemedText';
import { Alert, StyleSheet, ScrollView, TouchableOpacity, Image, View, Text, Modal, TextInput, Button, Platform, Switch } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

const backendURL = "http://10.89.243.10:3801/events/123456";

export default function DateTimePickerAndroid() {
    const [modalVisible, setModalVisible] = useState(false);
    const [eventName, setEventName] = useState('');
    const [eventClassification, setEventClassification] = useState('PUBLIC');
    const [eventStartTime, setEventStartTime] = useState(new Date());
    const [eventEndTime, setEventEndTime] = useState(new Date());
    const [eventDescription, setEventDescription] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isAllDay, setIsAllDay] = useState(false);

    const [mode, setMode] = useState('date'); // 'date' or 'time'
    const [showStart, setShowStart] = useState(false);
    const [showEnd, setShowEnd] = useState(false);

    // for android only
    const showModeStart = (currentMode) => {
        setShowStart(true);
        setMode(currentMode);
    };

    const showModeEnd = (currentMode) => {
        setShowEnd(true);
        setMode(currentMode);
    };

    const toggleSwitch = () => {
        setEventClassification(prevState => (prevState === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC'));
    };

    {/* Function to format date to "YYYYMMDDHHMMSS" for UID */ }
    const formatUIDDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(backendURL);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                } else {
                    console.log("run ok")
                }
                const data = await response.json();
                const convertUTCToAEST = (date) => {
                    const utcDate = new Date(date);
                    const aestDate = new Date(utcDate.getTime() + 10 * 60 * 60 * 1000);

                    return aestDate;
                };

                const fetchedEvents = data.map(event => ({
                    uid: event.uid,
                    name: event.name,
                    classification: event.classification,
                    startTime: convertUTCToAEST(event.begin),
                    endTime: convertUTCToAEST(event.end),
                    description: event.description,
                    location: event.location,
                    isAllDay: false
                }));


                setEvents(fetchedEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
                alert('There was a problem fetching events.');
            }
        };

        fetchEvents();
    }, []);

    {/* Function for Toggling Classification */ }
    const toggleClassification = async () => {
        if (selectedEvent) {
            // Make PUT request
            try {
                const AESTtoUTC = (date) => {
                    const UTCDate = new Date(date.getTime() - 10 * 60 * 60 * 1000);
                    return UTCDate;
                }

                // Convert AEST time to UTC - ics file format is UTC time
                const utcStartTime = AESTtoUTC(selectedEvent.startTime);
                const apiUID = `${formatUIDDate(utcStartTime)}-${selectedEvent.name}`;

                if (selectedEvent.classification == 'PUBLIC') {
                    var eventClassification = 'PRIVATE'
                }
                if (selectedEvent.classification == 'PRIVATE') {
                    var eventClassification = 'PUBLIC'
                }

                const bodyRes = {
                    uid: apiUID,
                    visibility: eventClassification,
                };

                const response = await fetch(`${backendURL}/${apiUID}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bodyRes),
                });

                if (!response.ok) {
                    console.error('Network response was not ok');
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                console.log('110 API response:', result);
                alert(result.message);


            } catch (error) {
                console.error('Error during fetch:', error);
                alert('There was a problem updating the event.');
            }
        }

    }



    {/* Function for Saving an Event */ }
    const handleSave = async () => {
        if (eventName === '') {
            alert('Event name is required.');
            return;
        }

        if (eventEndTime < eventStartTime) {
            alert('End datetime must be after start datetime.');
            return;
        }

        // Create the new event object
        const newEvent = {
            uid: `${new Date().getTime()}`,
            name: eventName,
            classification: eventClassification,
            startTime: isAllDay ? new Date(eventStartTime.setHours(0, 0, 0, 0)) : eventStartTime,
            endTime: isAllDay ? new Date(eventEndTime.setHours(23, 59, 59, 999)) : eventEndTime,
            description: eventDescription,
            location: eventLocation,
            isAllDay: isAllDay,
        };

        // Format the event for the API call
        const apiEvent = {
            uid: `${formatUIDDate(newEvent.startTime)}-${newEvent.name}`,
            name: newEvent.name,
            classification: newEvent.classification,
            begin: newEvent.startTime.toISOString().slice(0, 19).replace('T', ' '),
            end: newEvent.endTime.toISOString().slice(0, 19).replace('T', ' '),
            description: newEvent.description,
            location: newEvent.location,
        };

        // Make POST request
        try {
            const response = await fetch(backendURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiEvent),
            });

            if (!response.ok) {
                console.error('Network response was not ok');
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('API response:', result);
            alert(result.message);

        } catch (error) {
            console.error('Error during fetch:', error);
            alert('There was a problem saving the event.');
        }

        setEvents([...events, newEvent]);
        setModalVisible(false);
        setEventName('');
        setEventDescription('');
        setEventLocation('');
        setIsAllDay(false);
    };

    {/* Function for Deleting an Event */ }
    const handleDelete = async () => {
        if (selectedEvent) {
            Alert.alert(
                'Confirm Delete',
                `Are you sure you want to delete "${selectedEvent.name}"?`,
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Delete cancelled'),
                        style: 'cancel',
                    },
                    {
                        text: 'Delete',
                        onPress: async () => {
                            // Make DELETE request
                            try {
                                const AESTtoUTC = (date) => {
                                    const UTCDate = new Date(date.getTime() - 10 * 60 * 60 * 1000);
                                    return UTCDate;
                                }

                                // Convert AEST time to UTC - ics file format is UTC time
                                const utcStartTime = AESTtoUTC(selectedEvent.startTime);
                                const apiUID = `${formatUIDDate(utcStartTime)}-${selectedEvent.name}`;
                                console.log("APIUID", apiUID);

                                const response = await fetch(`${backendURL}/${apiUID}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                });

                                if (!response.ok) {
                                    console.error('Network response was not ok');
                                    throw new Error('Network response was not ok');
                                }

                                const result = await response.json();
                                console.log('API response:', result);
                                alert(result.message);

                                const updatedEvents = events.filter((event) => event.uid !== selectedEvent.uid);
                                setEvents(updatedEvents);
                                setSelectedEvent(null);

                            } catch (error) {
                                console.error('Error during fetch:', error);
                                alert('There was a problem deleting the event.');
                            }
                        },
                    },
                ],
                { cancelable: true }
            );
        } else {
            alert('Error: No event selected');
        }
    };

    // Function to format the event date and time for display
    const formatDate = (date) => format(date, 'EEE, d MMM');
    const formatTime = (date) => format(date, 'h:mm a');

    const sortedEvents = [...events].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    // Group events by date
    const groupedEvents = sortedEvents.reduce((acc, event) => {
        const startDate = new Date(event.startTime);
        const endDate = new Date(event.endTime);

        // Iterate through each date from start to end
        for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateString = formatDate(new Date(d));
            if (!acc[dateString]) {
                acc[dateString] = [];
            }
            acc[dateString].push({ ...event });
        }

        return acc;
    }, {});

    return (
        <>
            <ScrollView style={{ padding: 16 }}>

                <View style={{ backgroundColor: 'white', height: 120 }}>
                    <Image source={require('@/assets/images/icon.png')} style={{ left: 20, height: 120, width: 220 }}></Image>
                </View>

                {/* Render Grouped Events */}
                <View style={stylesAndroid.eventsContainer}>
                    {Object.entries(groupedEvents).map(([date, events]) => (
                        <View key={date} style={stylesAndroid.dateSection}>
                            <ThemedText style={stylesAndroid.dateText}>{date}</ThemedText>
                            <View style={stylesAndroid.lineSeparator} />
                            {events.map((event, index) => (
                                <TouchableOpacity key={index} onPress={() => setSelectedEvent(event)} style={stylesAndroid.eventCard}>
                                    <ThemedText style={stylesAndroid.eventText}>{event.name}</ThemedText>
                                    <ThemedText style={stylesAndroid.eventText}>
                                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                    </ThemedText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </View>

                {/* Modal for Adding Event */}
                <Modal animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}>
                    <View style={stylesAndroid.modalContainer}>
                        <View style={stylesAndroid.modalView}>

                            {/* Event Name Input */}
                            <TextInput
                                placeholder="Event Name"
                                value={eventName}
                                onChangeText={setEventName}
                                style={stylesAndroid.input}
                                placeholderTextColor="#999"
                            />

                            {/* All-Day Switch */}
                            <View style={stylesAndroid.switchContainer}>
                                <ThemedText style={stylesAndroid.modalText}>All Day</ThemedText>
                                <Switch value={isAllDay} onValueChange={(value) => setIsAllDay(value)} />
                            </View>

                            {/* Event Classification Switch */}
                            <View style={stylesAndroid.switchContainer}>
                                <ThemedText style={stylesAndroid.modalText}>Event Visibility: {eventClassification} </ThemedText>
                                <Switch value={eventClassification === 'PRIVATE'} onValueChange={toggleSwitch} />
                            </View>


                            {/* Start/End Date Selector */}
                            <Text style={{ color: 'black', textAlign: 'center' }}>{eventStartTime.toLocaleString(('en-GB'))}</Text>
                            <View style={stylesAndroid.buttonRow}>
                                <TouchableOpacity style={stylesAndroid.neutralBtn} onPress={() => showModeStart('date')}>
                                    <Text> Start Date </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={stylesAndroid.neutralBtn} onPress={() => showModeStart('time')}>
                                    <Text> Start Time </Text>
                                </TouchableOpacity>

                            </View>
                            <Text style={{ color: 'black', textAlign: 'center', marginTop: 10 }}>{eventEndTime.toLocaleString(('en-GB'))}</Text>
                            <View style={stylesAndroid.buttonRow}>
                                <TouchableOpacity style={stylesAndroid.neutralBtn} onPress={() => showModeEnd('date')}>
                                    <Text> End Date </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={stylesAndroid.neutralBtn} onPress={() => showModeEnd('time')}>
                                    <Text> End Time </Text>
                                </TouchableOpacity>

                            </View>

                            {showStart && (
                                <DateTimePicker
                                    value={eventStartTime}
                                    mode={mode}
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        const currentDate = selectedDate || eventStartTime;
                                        setShowStart(Platform.OS === 'ios' ? true : false);
                                        setEventStartTime(currentDate);
                                    }} />
                            )}

                            {showEnd && (
                                <DateTimePicker
                                    value={eventEndTime}
                                    mode={mode}
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        const currentDate = selectedDate || eventEndTime;
                                        setShowEnd(Platform.OS === 'ios' ? true : false);
                                        setEventEndTime(currentDate);
                                    }} />
                            )}


                            {/* Other input fields (Description, Location) */}
                            <TextInput
                                placeholder="Description"
                                value={eventDescription}
                                onChangeText={setEventDescription}
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 5,
                                    padding: 10,
                                    marginTop: 20,
                                    marginBottom: 15,
                                    backgroundColor: 'white',
                                }}
                                placeholderTextColor="#999"
                            />
                            <TextInput
                                placeholder="Location"
                                value={eventLocation}
                                onChangeText={setEventLocation}
                                style={stylesAndroid.input}
                                placeholderTextColor="#999"
                            />
                            {/* Save and Cancel buttons */}
                            <View style={stylesAndroid.buttonRow}>
                                <TouchableOpacity style={stylesAndroid.negativeBtn} onPress={() => setModalVisible(false)}>
                                    <Text> Cancel </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={stylesAndroid.positiveBtn} onPress={handleSave}>
                                    <Text> Save </Text>
                                </TouchableOpacity>

                            </View>

                        </View>
                    </View>
                </Modal>

                {/* Modal for Displaying Event Details */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={!!selectedEvent}
                    onRequestClose={() => setSelectedEvent(null)}
                >
                    <View style={stylesAndroid.modalContainer}>
                        <View style={stylesAndroid.modalView}>
                            {selectedEvent && (
                                <>
                                    <ThemedText type="title" style={stylesAndroid.modalText}>
                                        {selectedEvent.name}
                                    </ThemedText>

                                    <ThemedText style={stylesAndroid.modalText}>
                                        This event is set to <Text style={{ fontWeight: 'bold' }}>{selectedEvent.classification} </Text>
                                    </ThemedText>

                                    <ThemedText style={stylesAndroid.modalText}>
                                        <Text style={{ fontWeight: 'bold' }}>Date: </Text>
                                        {selectedEvent.isAllDay ? (
                                            isSameDay(selectedEvent.startTime, selectedEvent.endTime) ? (
                                                ` ${format(selectedEvent.startTime, 'EEEE, MMMM d, yyyy')}`
                                            ) : (
                                                ` ${format(selectedEvent.startTime, 'EEEE, MMMM d, yyyy')} - ${format(selectedEvent.endTime, 'EEEE, MMMM d, yyyy')}`
                                            )
                                        ) : (
                                            isSameDay(selectedEvent.startTime, selectedEvent.endTime) ? (
                                                ` ${format(selectedEvent.startTime, 'EEEE, MMMM d, yyyy')} ${formatTime(selectedEvent.startTime)} - ${formatTime(selectedEvent.endTime)}`
                                            ) : (
                                                ` ${format(selectedEvent.startTime, 'EEEE, MMMM d, yyyy')} ${formatTime(selectedEvent.startTime)} - ${format(selectedEvent.endTime, 'EEEE, MMMM d, yyyy')} ${formatTime(selectedEvent.endTime)}`
                                            )
                                        )}
                                    </ThemedText>


                                    <ThemedText style={stylesAndroid.modalText}>
                                        <Text style={{ fontWeight: 'bold' }}>Description: </Text> {selectedEvent.description}
                                    </ThemedText>
                                    <ThemedText style={stylesAndroid.modalText}>
                                        <Text style={{ fontWeight: 'bold' }}>Location:</Text> {selectedEvent.location}
                                    </ThemedText>

                                    <TouchableOpacity style={[stylesAndroid.neutralBtn, { marginLeft: 16, marginRight: 16 }]} onPress={toggleClassification}>
                                        <Text>
                                            Toggle Visibility
                                        </Text>
                                    </TouchableOpacity>

                                    <View style={stylesAndroid.buttonRow}>
                                        <TouchableOpacity style={stylesAndroid.negativeBtn} onPress={handleDelete}>
                                            <Text>
                                                Delete
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={stylesAndroid.neutralBtn} onPress={() => setSelectedEvent(null)}>
                                            <Text>
                                                Close
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>
            </ScrollView>

            {/* Circular Add Button */}
            <TouchableOpacity style={stylesAndroid.addEventBtn} onPress={() => { setModalVisible(true); }}>
                <MaterialIcons name="add" size={24} color="white" />
            </TouchableOpacity>
        </>
    );
};

const stylesAndroid = StyleSheet.create({
    addEventBtn: {
        // position: 'absolute',
        // bottom: 30, // Adjust based on the padding/margins you need
        // right: 30, // Adjust based on the padding/margins you need
        width: 60,
        height: 60,
        backgroundColor: '#007BFF',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 15, // Adds shadow for Android
        position: 'absolute',
        bottom: 20, // Adjust as needed
        right: 20,  // Adjust as needed
    },
    buttonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '88%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    eventsContainer: {
        marginTop: 20,
        gap: 20,
    },
    dateSection: {
        marginBottom: 20,
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    lineSeparator: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginVertical: 10,
    },
    eventCard: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginBottom: 10,
    },
    eventText: {
        color: 'black',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: 'white',
    },
    eventCard: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginBottom: 10,
    },
    modalText: {
        marginBottom: 8,
        color: 'black',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingHorizontal: 10,
        marginLeft: 16,
        marginRight: 16
    },
    negativeBtn: {
        backgroundColor: 'firebrick',
        padding: 12,
        alignItems: 'center',
        borderRadius: 16,
    },
    positiveBtn: {
        backgroundColor: "seagreen",
        padding: 12,
        alignItems: 'center',
        borderRadius: 16,
    },
    neutralBtn: {
        backgroundColor: "darkgrey",
        padding: 12,
        alignItems: 'center',
        borderRadius: 16,
    }
})