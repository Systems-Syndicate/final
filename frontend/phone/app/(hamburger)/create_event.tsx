import { Alert, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { format, isSameDay } from 'date-fns';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Image, Button, View, Modal, TextInput, TouchableOpacity, Switch } from 'react-native';

import styles from '@/types/styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ParallaxScrollView from '@/components/ParallaxScrollView';

interface Event {
  uid: string;
  name: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  description: string;
  location: string;
}

const backendURL = "http://10.89.243.10:3801/events/123456";

export default function CreateEvent() {
  const [modalVisible, setModalVisible] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventStartTime, setEventStartTime] = useState(new Date());
  const [eventEndTime, setEventEndTime] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null); 
  const [isAllDay, setIsAllDay] = useState(false);

  {/* Function to format date to "YYYYMMDDHHMMSS" for UID */}
  const formatUIDDate = (date: Date) => {
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
        // const response = await fetch(`http://192.168.0.6:5000/events/${1}`);
        const response = await fetch(backendURL);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        } else {
          console.log("run ok")
        }
        const data = await response.json();
        const convertUTCToAEST = (date: Date) => {
          const utcDate = new Date(date);
          const aestDate = new Date(utcDate.getTime() + 10 * 60 * 60 * 1000);
        
          return aestDate;
        };
        
        const fetchedEvents = data.map(event => ({ // No error, still runs all good :)
          uid: event.uid,
          name: event.name,
          startTime: convertUTCToAEST(event.begin),
          endTime: convertUTCToAEST(event.end),
          description: event.description,
          location: event.location,
          isAllDay: false // TODO: change this to true if the event is all-day
        }));
        

        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        alert('There was a problem fetching events.');
      }
    };

    fetchEvents();
  }, []);

  {/* Function for Saving an Event */}
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
    const newEvent: Event = {
        uid: `${new Date().getTime()}`,
        name: eventName,
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
      begin: newEvent.startTime.toISOString().slice(0, 19).replace('T', ' '),
      end: newEvent.endTime.toISOString().slice(0, 19).replace('T', ' '),
      description: newEvent.description,
      location: newEvent.location,
    };

    // Make POST request
    try {
      // const response = await fetch(`http://192.168.0.6:5000/events/${1}`, {
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
  
  {/* Function for Deleting an Event */}
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
                const AESTtoUTC = (date: Date) => {
                  const UTCDate = new Date(date.getTime() - 10 * 60 * 60 * 1000);
                  return UTCDate;
                }

                // Convert AEST time to UTC - ics file format is UTC time
                const utcStartTime = AESTtoUTC(selectedEvent.startTime);
                const apiUID = `${formatUIDDate(utcStartTime)}-${selectedEvent.name}`;
                console.log("APIUID", apiUID);
                
                // const response = await fetch(`http://192.168.0.6:5000/events/${1}/${apiUID}`, {
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
  const formatDate = (date: Date) => format(date, 'EEE, d MMM');
  const formatTime = (date: Date) => format(date, 'h:mm a');

  const sortedEvents = [...events].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  // Group events by date
  const groupedEvents = sortedEvents.reduce((acc: { [key: string]: Event[] }, event) => {
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
    <SafeAreaView>

      {/* Circular Add Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>

      <View style={{ backgroundColor: 'white', height: 120}}>
        <Image source={require('@/assets/images/icon.png')} style={{left: 20, height: 120, width: 220}} ></Image>
      </View> 

      <ScrollView>
        {/* Render Grouped Events */}
        <View style={styles.eventsContainer}>
          {Object.entries(groupedEvents).map(([date, events]) => (
            <View key={date} style={styles.dateSection}>
              <ThemedText style={styles.dateText}>{date}</ThemedText>
              <View style={styles.lineSeparator} />
              {events.map((event, index) => (
                <TouchableOpacity key={index} onPress={() => setSelectedEvent(event)} style={styles.eventCard}>
                  <ThemedText style={styles.eventText}>{event.name}</ThemedText>
                  <ThemedText style={styles.eventText}>
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        {/* Modal for Adding Event */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
            <ThemedText type="title" style={[styles.modalText, styles.headingText]}>Create a New Event</ThemedText>
              
              {/* Event Name Input */}
              <TextInput
                placeholder="Event Name"
                value={eventName}
                onChangeText={setEventName}
                style={styles.input}
                placeholderTextColor="#999"
              />

              <View>
                {/* All Day Switch */}
                <View style={styles.switchContainer}>
                  <ThemedText style={styles.modalText}>All Day</ThemedText>
                  <Switch
                    value={isAllDay}
                    onValueChange={(value) => setIsAllDay(value)}
                  />
                </View>

                {/* Row for Start Date and Start Time */}
                <View style={styles.rowContainer}>
                  {/* Start Date Picker on the left */}
                  <View style={styles.pickerContainer}>
                    <ThemedText style={styles.modalText}>Start Date</ThemedText>
                    <DateTimePicker
                      value={eventStartTime}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        const currentDate = selectedDate || eventStartTime;
                        setEventStartTime(currentDate);
                      }}
                    />
                  </View>

                  {/* Start Time Picker on the right (if not all-day) */}
                  {!isAllDay && (
                    <View style={styles.pickerContainer}>
                      <ThemedText style={styles.modalText}>Start Time</ThemedText>
                      <DateTimePicker
                        value={eventStartTime}
                        mode="time"
                        display="default"
                        onChange={(event, selectedTime) => {
                          const currentTime = selectedTime || eventStartTime;
                          setEventStartTime(currentTime);
                        }}
                      />
                    </View>
                  )}
                </View>

                {/* Row for End Date and End Time */}
                <View style={styles.rowContainer}>
                  {/* End Date Picker on the left */}
                  <View style={styles.pickerContainer}>
                    <ThemedText style={styles.modalText}>End Date</ThemedText>
                    <DateTimePicker
                      value={eventEndTime}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        const currentDate = selectedDate || eventEndTime;
                        setEventEndTime(currentDate);
                      }}
                    />
                  </View>

                  {/* End Time Picker on the right (if not all-day) */}
                  {!isAllDay && (
                    <View style={styles.pickerContainer}>
                      <ThemedText style={styles.modalText}>End Time</ThemedText>
                      <DateTimePicker
                        value={eventEndTime}
                        mode="time"
                        display="default"
                        onChange={(event, selectedTime) => {
                          const currentTime = selectedTime || eventEndTime;
                          setEventEndTime(currentTime);
                        }}
                      />
                    </View>
                  )}
                </View>
              </View>


              {/* Other input fields (Description, Location) */}
              <TextInput
                placeholder="Description"
                value={eventDescription}
                onChangeText={setEventDescription}
                style={styles.input}
                placeholderTextColor="#999"
              />
              <TextInput
                placeholder="Location"
                value={eventLocation}
                onChangeText={setEventLocation}
                style={styles.input}
                placeholderTextColor="#999"
              />

              {/* Save and Cancel buttons */}
              <Button title="Save" onPress={handleSave} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
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
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                {selectedEvent && (
                  <>
                    <ThemedText type="title" style={styles.modalText}>
                      {selectedEvent.name}
                    </ThemedText>

                    <ThemedText style={styles.modalText}>
                      {selectedEvent.isAllDay ? (
                        isSameDay(selectedEvent.startTime, selectedEvent.endTime) ? (
                          `${format(selectedEvent.startTime, 'EEEE, MMMM d, yyyy')}`
                        ) : (
                          `${format(selectedEvent.startTime, 'EEEE, MMMM d, yyyy')} - ${format(selectedEvent.endTime, 'EEEE, MMMM d, yyyy')}`
                        )
                      ) : (
                        isSameDay(selectedEvent.startTime, selectedEvent.endTime) ? (
                          `${format(selectedEvent.startTime, 'EEEE, MMMM d, yyyy')} ${formatTime(selectedEvent.startTime)} - ${formatTime(selectedEvent.endTime)}`
                        ) : (
                          `${format(selectedEvent.startTime, 'EEEE, MMMM d, yyyy')} ${formatTime(selectedEvent.startTime)} - ${format(selectedEvent.endTime, 'EEEE, MMMM d, yyyy')} ${formatTime(selectedEvent.endTime)}`
                        )
                      )}
                    </ThemedText>

                    <ThemedText style={styles.modalText}>
                      Location: {selectedEvent.location}
                    </ThemedText>
                    <ThemedText style={styles.modalText}>
                      Description: {selectedEvent.description}
                    </ThemedText>

                    <View style={styles.buttonRow}>
                      <Button title="Delete" onPress={handleDelete} />
                      <Button title="Edit" onPress={() => {}} />
                      <Button title="Close" onPress={() => setSelectedEvent(null)} />
                    </View>
                  </>
                )}
              </View>
            </View>
          </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}