import { Button } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';


export default function GetDimensions({ route, navigation }) {
    const { dimensions } = route.params;

    return (
        <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button onPress={() => navigation.goBack()} title="Go back home" />
            <ThemedText style={{ fontSize: 12, marginVertical: 10 }}>Window Dimensions:</ThemedText>
            <ThemedText style={{ fontSize: 12, marginVertical: 10 }}>{JSON.stringify(dimensions['window'])}</ThemedText>
            <ThemedText style={{ fontSize: 12, marginVertical: 10 }}>Screen Dimensions: </ThemedText>
            <ThemedText style={{ fontSize: 12, marginVertical: 10 }}>{JSON.stringify(dimensions['screen'])}</ThemedText>
        </ThemedView>
    );
}