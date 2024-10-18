import { StyleSheet, SafeAreaView, Button, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';



export default function MonthlyView({ route, navigation }) {
    const { dimensions } = route.params;
    const screenWidth = dimensions['window'].width;
    const screenHeight = dimensions['window'].height;
    console.log('monthly view', screenHeight);

    const styles = StyleSheet.create({
        body: {
            // backgroundColor: 'lightblue',
            padding: 8,
            width: screenWidth - 16,
            height: screenHeight - 96,
            margin: 'auto'
        },
        text: {
            fontSize: 16,
            lineHeight: 24,
            // color: 'white',
            textAlign: 'center'
        },
        daycontainers: {
            // width: 40,
            // paddingTop: 4, 
            // marginBottom: 8,
            // paddingBottom: 40,
            backgroundColor: '#696969',
            borderRadius: 4,
            height: (screenHeight - 96 - 64)/8,
            marginBottom: 8,
        },
        columns: {
            flexDirection: 'column',
            width: (screenWidth-(8*4))/8,
            // backgroundColor: 'red'
        }
    });

    
    
    return (
        <SafeAreaView>
            <ThemedView style={styles.body}>
                <ThemedText style={{flexDirection: 'row', textAlign: 'center', fontSize: 24, margin: 4, marginBottom: 16}}> SEPT </ThemedText>

                <ThemedView style={{flexDirection: 'row', justifyContent:'space-between'}}>
                    <ThemedView style={styles.columns}>
                        <ThemedText style={styles.text}> Mon </ThemedText>
                        <ThemedView style={{flexDirection: 'column'}}>
                            <View style={styles.daycontainers}>
                                <Button title="26" onPress={() => {
                                    console.log('You tapped the button!');
                                }}> </Button>
                            </View>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 2 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 9 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 16 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 23 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 30 </ThemedText>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>

                    <ThemedView style={styles.columns}>
                        <ThemedText style={styles.text}> Tue </ThemedText>
                        <ThemedView style={{flexDirection: 'column'}}>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 27 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 3 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 10 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 17 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 24 </ThemedText>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>

                    <ThemedView style={styles.columns}>
                        <ThemedText style={styles.text}> Wed </ThemedText>
                        <ThemedView style={{flexDirection: 'column'}}>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 28 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 4 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 11 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 18 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 25 </ThemedText>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>

                    <ThemedView style={styles.columns}>
                        <ThemedText style={styles.text}> Thu </ThemedText>
                        <ThemedView style={{flexDirection: 'column'}}>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 29 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 5 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 12 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 19 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 26 </ThemedText>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>

                    <ThemedView style={styles.columns}>
                        <ThemedText style={styles.text}> Fri </ThemedText>
                        <ThemedView style={{flexDirection: 'column'}}>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 30 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 6 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 13 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 20 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 27 </ThemedText>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>

                    <ThemedView style={styles.columns}>
                        <ThemedText style={styles.text}> Sat </ThemedText>
                        <ThemedView style={{flexDirection: 'column'}}>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 31 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 7 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 14 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 21 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 28 </ThemedText>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>

                    <ThemedView style={styles.columns}>
                        <ThemedText style={styles.text}> Sun </ThemedText>
                        <ThemedView style={{flexDirection: 'column'}}>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 1 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 8 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 15 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 22 </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.daycontainers}>
                                <ThemedText style={styles.text}> 29 </ThemedText>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>
                    
                </ThemedView>
                </ThemedView>
        </SafeAreaView>
    );
}