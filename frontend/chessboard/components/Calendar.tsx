import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Button,
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  CalendarList,
  CalendarProvider,
  WeekCalendar,
  TimelineList,
  TimelineProps,
  CalendarUtils,
} from "react-native-calendars";

const { width, height } = Dimensions.get("window");
const BOARD_SIZE = Math.min(width, height); // Ensure board is smaller than the screen size
const BASE_SIZE = 400; // Base size for scaling, adjust this value if needed
const relativeFontSize = (size: number) => (size * BOARD_SIZE) / BASE_SIZE;

const INITIAL_TIME = { hour: 9, minutes: 0 };

// Define types for Event and EventsByDate
interface Event {
  color: string;
  end: string;
  id: string;
  location: string;
  start: string;
  summary: string;
  title: string;
  user: string;
}

interface EventsByDate {
  [key: string]: Event[];
}

const backendURL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.64.223:3801";

const fetchEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch(`${backendURL}/events/ics/all`);
    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const parseEventsToMarkedDates = (events: Event[]) => {
  const markedDates: {
    [key: string]: {
      dots: { key: string; color: string; selectedDotColor: string }[];
    };
  } = {};

  events.forEach((event) => {
    const { color, end, id, location, start, summary, title, user } = event;
    const eventDate = start.split(" ")[0];
    const dot = {
      key: id, // Use user as the key to avoid duplicates for the same user
      color: color || "gray",
      selectedDotColor: color || "gray",
    };

    if (!markedDates[eventDate]) {
      markedDates[eventDate] = { dots: [] };
    }

    // Check if the user is already marked for that date
    const isUserAlreadyMarked = markedDates[eventDate].dots.some(
      (d) => d.key === user
    );

    // If not already marked, add the dot
    if (!isUserAlreadyMarked) {
      markedDates[eventDate].dots.push(dot);
    }
  });

  return markedDates;
};

// Function to parse the time from a string
const parseDateToTimeString = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });
};

// Function to group events by their date
const groupEventsByDate = (events: Event[]): EventsByDate => {
  return events.reduce<EventsByDate>((acc, event) => {
    const dateString = CalendarUtils.getCalendarDateString(event.start);
    if (!acc[dateString]) {
      acc[dateString] = [];
    }
    acc[dateString].push(event);
    return acc;
  }, {});
};

const CalendarTimelineComponent: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadEvents = async () => {
      const fetchedEvents = await fetchEvents();
      setEvents(fetchedEvents);
      setLoading(false);
    };

    // Set an interval to call loadEvents every second
    const interval = setInterval(loadEvents, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  // Update markedDates whenever events are updated
  useEffect(() => {
    const newMarkedDates = parseEventsToMarkedDates(events);
    setMarkedDates(newMarkedDates);
  }, [events]);

  const eventsByDate = groupEventsByDate(events);

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDay(day.dateString);
    setCurrentDate(day.dateString);
  };

  const handleBackToCalendar = () => {
    setSelectedDay(null);
  };

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  const timelineProps: Partial<TimelineProps> = {
    format24h: true,
    scrollToFirst: true,
    initialTime: INITIAL_TIME,
    unavailableHours: [
      { start: 0, end: 6 },
      { start: 22, end: 24 },
    ],
    onEventPress: handleEventPress,
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {selectedDay ? (
        <View style={styles.timelineContainer}>
          <Button title="Back to Calendar" onPress={handleBackToCalendar} />
          <CalendarProvider date={currentDate} showTodayButton>
            <WeekCalendar firstDay={1} />
            <TimelineList
              events={eventsByDate}
              timelineProps={timelineProps}
              showNowIndicator
              scrollToFirst
            />
          </CalendarProvider>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={handleCloseModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{selectedEvent?.title}</Text>
                <Text>
                  {parseDateToTimeString(selectedEvent?.start || "")} -{" "}
                  {parseDateToTimeString(selectedEvent?.end || "")}
                </Text>
                <Text>{selectedEvent?.summary || "No summary available."}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleCloseModal}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <CalendarList
          pastScrollRange={6}
          futureScrollRange={12}
          horizontal={true}
          pagingEnabled={true}
          scrollEnabled={true}
          current={new Date().toISOString().split("T")[0]}
          style={styles.calendar}
          calendarWidth={BOARD_SIZE}
          calendarHeight={BOARD_SIZE}
          onDayPress={handleDayPress}
          markingType={"multi-dot"}
          theme={theme}
          markedDates={markedDates} // Use updated markedDates
        />
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  timelineContainer: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
  },
  calendar: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: "black",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
  },
});

const theme = {
  backgroundColor: "#ffffff", // Overall background
  calendarBackground: "#ffffff", // Calendar background
  textSectionTitleColor: "#b6c1cd", // Color of day titles (Sun, Mon, etc.)
  selectedDayBackgroundColor: "#00adf5", // Background color of selected day
  selectedDayTextColor: "#ffffff", // Text color of selected day
  todayTextColor: "#48BFE3", // Text color of today
  dayTextColor: "#2d4150", // Regular day text color
  textDisabledColor: "#d9e1e8", // Disabled day text color
  dotColor: "#00adf5", // Event dot color
  selectedDotColor: "#ffffff", // Selected dot color
  arrowColor: "#48BFE3", // Color of the arrows
  monthTextColor: "#48BFE3", // Month text color in header
  indicatorColor: "#48BFE3", // Loading indicator color
  textDayFontWeight: "300", // Font weight of day numbers
  textMonthFontWeight: "bold", // Font weight of month in header
  textDayHeaderFontWeight: "600", // Font weight of day headers (Sun, Mon, etc.)
  textDayFontSize: relativeFontSize(15), // Font size of day numbers
  textMonthFontSize: relativeFontSize(24), // Font size of month
  textDayHeaderFontSize: relativeFontSize(18), // Font size of day headers
};

export default CalendarTimelineComponent;
