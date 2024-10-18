import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
  
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
  
    stepContainer: {
      gap: 8,
      marginBottom: 8,
    },
  
    reactLogo: {
      height: 178,
      width: 290,
      bottom: 0,
      left: 0,
      position: 'absolute',
    },
  
    buttonContainer: {
      flexDirection: 'column',
      gap: 10,
      marginTop: 20,
    },
  
    eventsContainer: {
      marginTop: 20,
      gap: 20,
    },
  
    dateSection: {
      marginBottom: 20,
    },
  
    dateText: {
      fontSize: 18,
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
  
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  
    modalView: {
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
  
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      color: '##000000',
    },
  
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 15,
      backgroundColor: 'white',
    },
  
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 10,
    },
  
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
  
    pickerContainer: {
      flex: 1,
      marginHorizontal: 5,
      alignItems: 'center',
    },
  
    headingText: {
      color: '##000000', 
      fontWeight: 'bold', 
      fontSize: 24,  
    },
  
    fab: {
      position: 'absolute',
      zIndex: 5, // works on ios
      elevation: 5, // works on android
      bottom: 30,
      right: 30,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
  });

export default styles;
