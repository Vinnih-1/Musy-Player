import React, { useEffect, useState } from 'react'
import { Image, TouchableOpacity } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'

import { 
	ArtistText,
	Background, 
	MusicImage, 
	MusicInformation, 
	MusicPlayingView, 
	NavToSongs, Navbar, 
	PlayerButtons, 
	PlayerIcons, 
	PlayerManager, 
	PlayerProgressBar, 
	PlayerProgressTimer, 
	SettingsButton, 
	Text, 
	Title 
} from './styles'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'
import TrackPlayer, { Event, RepeatMode, State, useProgress, } from 'react-native-track-player'
import * as Progress from 'react-native-progress'

interface RootStackParamList {
    Songs: undefined;
    [key: string]: undefined;
}

interface PlayerScreenProps {
    navigation: StackNavigationProp<RootStackParamList, 'Songs'>
}

interface MusicProps {
	title: string;
	artist: string;
	duration: string;
	position: string;
}

export function Player({navigation}: PlayerScreenProps) {
	return(
		<Background>
			<Navbar>
				<NavToSongs onPress={() => navigation.navigate('Songs')}>
					<Ionicons color={'#ECECEC'}  name='chevron-down-outline' size={35}/>
				</NavToSongs>
				<Title>Musy Player</Title>
				<SettingsButton>
					<Ionicons color={'#ECECEC'}  name='ellipsis-vertical' size={25}/>
				</SettingsButton>
			</Navbar>

			<MusicInformation>
				<Text>Song</Text>
				<MusicImage>
					<Image style={{maxHeight: 250, maxWidth: 250, borderRadius: 40}} source={require('../../assets/music-icon.png')} />
				</MusicImage>
				<MusicName />
				<PlayerManager>
					<QueueButtons/>
					<ProgressBar />
					<PlayerButton />
				</PlayerManager>
			</MusicInformation>
		</Background>
	)
}

export function QueueButtons() {
	const [repeat, setRepeat] = useState<boolean>(false)

	return(
		<PlayerIcons>
			<TouchableOpacity>
				<Ionicons color={'#ECECEC'} name='volume-medium' size={25} />
			</TouchableOpacity>

			<TouchableOpacity>
				<MaterialCommunityIcons color={'#ECECEC'} name='playlist-play' size={25} />
			</TouchableOpacity>

			<TouchableOpacity>
				<Ionicons color={'gray'} name='shuffle' size={25} />
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => {
					setRepeat(!repeat)

					if (repeat) {
						TrackPlayer.setRepeatMode(RepeatMode.Queue)
					} else {
						TrackPlayer.setRepeatMode(RepeatMode.Off)
					}
				}}
			>
				<Ionicons color={repeat ? '#ECECEC' : 'gray'} name='repeat' size={25} />
			</TouchableOpacity>

			<TouchableOpacity>
				<Ionicons color={'#ECECEC'} name='heart-sharp' size={25} />
			</TouchableOpacity>
		</PlayerIcons>
	)
}

export function PlayerButton() {
	const [paused, setPaused] = useState<boolean>(true)

	TrackPlayer.addEventListener(Event.RemotePlay, () => { TrackPlayer.play(); setPaused(false) })
	TrackPlayer.addEventListener(Event.RemotePause, () => { TrackPlayer.pause(); setPaused(true) })

	useEffect(() => {
		TrackPlayer.getState().then(state => {
			if (state) {
				if (state === State.Playing) {
					setPaused(false)
				} else {
					setPaused(true)
				}
			}
		})
	}, [])

	async function handlePlayPause() {
		const state = await TrackPlayer.getState()

		if (state === State.Playing) {
			TrackPlayer.pause()
			setPaused(true)
		} else {
			TrackPlayer.play()
			setPaused(false)
		}
	}

	return (
		<PlayerButtons>
			<TouchableOpacity
				onPress={() => TrackPlayer.skipToPrevious()}
			>
				<Ionicons color={'#ECECEC'} name='play-skip-back' size={40} />
			</TouchableOpacity>

			<TouchableOpacity onPress={handlePlayPause}>
				<FontAwesome5 color={'#ECECEC'} name={paused ? 'play' : 'pause'} size={40} />
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => TrackPlayer.skipToNext()}
			>
				<Ionicons color={'#ECECEC'} name='play-skip-forward' size={40} />
			</TouchableOpacity>
		</PlayerButtons>
	)
}

export function MusicName() {
	const [music, setMusic] = useState<MusicProps>()

	useEffect(() => {
		setTrack()

		const trackChangedListener = TrackPlayer.addEventListener(Event.PlaybackTrackChanged, () => {
			setTrack()
		})
	
		return () => {
			trackChangedListener.remove()
		}
	}, [])

	function setTrack() {
		TrackPlayer.getCurrentTrack().then((track) => {
			TrackPlayer.getTrack(Number(track)).then(async (track) => {
				const title = track?.title ?? ''
				const artist = track?.artist ?? ''
				const durationSeconds = await TrackPlayer.getDuration()
				const duration = `${Math.floor(durationSeconds / 60)}:${(Math.floor(durationSeconds) % 60)}`

				setMusic({ title: title, artist: artist, duration: duration, position: '0:00' })
			})
		})
	}

	return (
		<MusicPlayingView>
			<Title>{music?.title}</Title>
			<ArtistText>{music?.artist}</ArtistText>
		</MusicPlayingView>
	)
}

export function ProgressBar() {
	const progress = useProgress()

	function getPosition(): string {
		const positionSeconds = Math.floor(progress.position)
		const position = `${Math.floor(positionSeconds / 60)}:${(Math.floor(positionSeconds) % 60).toString().padStart(2, '0')}`
		return position
	}

	function getDuration(): string {
		const durationSeconds = Math.floor(progress.duration)
		const position = `${Math.floor(durationSeconds / 60)}:${(Math.floor(durationSeconds) % 60).toString().padStart(2, '0')}`
		return position
	}

	return (
		<PlayerProgressBar>
			<Progress.Bar 
				borderWidth={0} 
				color='#ECECEC' 
				unfilledColor='#1A1A1A' 
				height={3} width={330} 
				progress={progress.duration && progress.position != 0 ? 
					(Math.floor(progress.position) / Math.floor(progress.duration)): 0
				} />
			<PlayerProgressTimer>
				<ArtistText>{getPosition()}</ArtistText>
				<ArtistText>{getDuration()}</ArtistText>
			</PlayerProgressTimer>
		</PlayerProgressBar>
	)
}