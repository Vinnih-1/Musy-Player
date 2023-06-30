import React, { useContext, useState } from 'react'
import {
	Background,
	CardImage,
	CardInformation,
	CardPlayingIcon,
	MusicInformation
} from './styles'

import { Image } from 'react-native'
import { MusicArtistText, MusicTitleText } from '../footer/styles'
import { TrackProps, TrackerContext } from '../../contexts/track/TrackerContext'
import TrackPlayer, { Event } from 'react-native-track-player'

export function MusicCard(props: TrackProps) {
	const trackerContext = useContext(TrackerContext)
	const [playing, setPlaying] = useState(false)

	TrackPlayer.addEventListener(Event.PlaybackTrackChanged, () => {
		setTimeout(() => {
			if (trackerContext) {
				const currentTrack = trackerContext.getCurrentTrack()
	
				if (currentTrack) {
					if (currentTrack.url === props.url) {
						setPlaying(true)
					} else {
						setPlaying(false)
					}
				}
			}
		}, 500)
	})

	return (
		<Background onPress={() => {
			if (trackerContext) {
				const track = trackerContext.getTrackByUrl(props)

				if (track) {
					trackerContext.playTrack(track)
				}
			}
		}}>
			<CardInformation>
				<CardImage>
					<Image style={{ maxWidth: 40, maxHeight: 40 }} source={require('../../assets/music-icon.png')} />
				</CardImage>
				<MusicInformation>
					<MusicTitleText>{props.title}</MusicTitleText>
					<MusicArtistText>{props.artist}</MusicArtistText>
				</MusicInformation>
			</CardInformation>

			<CardPlayingIcon>
				{
					playing ? (
						<Image style={{ maxWidth: 40, maxHeight: 40 }} source={require('../../assets/playing.png')} />
					):(
						<></>
					)
				}
			</CardPlayingIcon>
		</Background>
	)
}