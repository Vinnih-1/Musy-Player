import React from 'react'
import { ThemeProvider } from 'styled-components'
import { Songs } from './pages/songs'
import { TrackerProvider } from './contexts/track/TrackerContext'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Player, QueueButtonsProvider } from './pages/player'

const collors = {
	background: '#2F2F2F',
	footer: '#161616',
}

const Stack = createNativeStackNavigator()

function App() {
	return (
		<TrackerProvider>
			<QueueButtonsProvider>
				<ThemeProvider theme={collors}>
					<NavigationContainer>
						<Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Songs'>
							<Stack.Screen name='Songs' component={Songs} />
							<Stack.Screen name='Player' component={Player} />
						</Stack.Navigator>
					</NavigationContainer>
				</ThemeProvider>
			</QueueButtonsProvider>
		</TrackerProvider>
	)
}

export default App
