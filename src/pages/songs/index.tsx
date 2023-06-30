import { TrackProps, TrackerContext, loadAllTracks } from '../../contexts/track/TrackerContext'
import React, { useContext, useEffect, useState } from 'react'
import { NavigationBar } from '../../components/navigator'
import { PermissionsAndroid, Text, View } from 'react-native'
import { FooterBar } from '../../components/footer'
import { MusicCard } from '../../components/card'
import { Background, MusicList } from './styles'
import { RequestPermissions } from '../../services/PermissionsService'

import { StackNavigationProp } from '@react-navigation/stack'

interface RootStackParamList {
	Player: undefined;
	[key: string]: undefined;
}

export interface SongsScreenProps {
	navigation: StackNavigationProp<RootStackParamList, 'Player'>
}

export function Songs({navigation}: SongsScreenProps) {
	const trackerContext = useContext(TrackerContext)
	const [tracks, setTracks] = useState<TrackProps[]>([])
	
	useEffect(() => {
		RequestPermissions().then(status => {
			if (status === PermissionsAndroid.RESULTS.GRANTED) {
				if (trackerContext) {
					loadAllTracks().then(tracks => {
						if (tracks) {
							trackerContext.setTrack(tracks)
							setTracks(tracks)
						}
					})
				}
			}
		})
	}, [])

	return (
		<Background>
			<NavigationBar title='Musy Player' />
			<MusicList>
				{tracks.length == 0 ? (
					<View style={{ flex: 1, height: 1.5, justifyContent: 'center', alignItems: 'center' }}>
						<Text style={{ color: 'white' }}>No music found in the folder</Text>
						<Text style={{ color: 'white' }}>storage/emulated/0/Music/</Text>
					</View>
				) : (
					tracks.map((music) => (
						<MusicCard key={music.url}
							artist={music.artist}
							title={music.title}
							url={music.url}
						/>
					))
				)}
			</MusicList>

			<FooterBar navigation={navigation} />
		</Background>
	)
}