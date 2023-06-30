import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
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
import { TrackerContext } from '../../contexts/track/TrackerContext'

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
	const [queueButtons, setQueueButtons] = useState<QueueButtonProps>()
	const queueContext = useContext(QueueButtonsContext)

	useEffect(() => {
		if (queueContext) {
			setQueueButtons(queueContext.getProps())
		}
	}, [])

	function handleRepeatButton(repeat: boolean) {
		setQueueButtons((prevState) => {
			if (prevState) {
				return { ...prevState, repeat: repeat }
			}
		})
	}

	function handleShuffleButton(shuffle: boolean) {
		setQueueButtons((prevState) => {
			if (prevState) {
				return { ...prevState, shuffle: shuffle }
			}
		})
	}

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
					<PlayerIcons>
						<TouchableOpacity>
							<Ionicons color={'#ECECEC'} name='volume-medium' size={25} />
						</TouchableOpacity>

						<TouchableOpacity>
							<MaterialCommunityIcons color={'#ECECEC'} name='playlist-play' size={25} />
						</TouchableOpacity>

						<TouchableOpacity 
							onPress={() => {
								if (queueContext) {
									if (queueContext.getShuffle()) {
										queueContext.setShuffle(false)
										handleShuffleButton(false)
									} else {
										queueContext.setShuffle(true)
										handleShuffleButton(true)
									}
								}
							}}>
							<Ionicons color={queueButtons?.shuffle ? '#ECECEC' : 'gray'} name='shuffle' size={25} />
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => {
								if (queueContext) {
									if (queueContext.getRepeat()) {
										queueContext.setRepeat(false)
										handleRepeatButton(false)
										TrackPlayer.setRepeatMode(RepeatMode.Off)
									} else {
										queueContext.setRepeat(true)
										handleRepeatButton(true)
										TrackPlayer.setRepeatMode(RepeatMode.Queue)
									}
								}
							}}
						>
							<Ionicons color={queueButtons?.repeat ? '#ECECEC' : 'gray'} name='repeat' size={25} />
						</TouchableOpacity>

						<TouchableOpacity>
							<Ionicons color={'#ECECEC'} name='heart-sharp' size={25} />
						</TouchableOpacity>
					</PlayerIcons>
					<ProgressBar />
					<PlayerButton />
				</PlayerManager>
			</MusicInformation>
		</Background>
	)
}

interface QueueButtonContextProps {
	props: QueueButtonProps;
	getRepeat: () => boolean;
	getShuffle: () => boolean;
	getProps: () => QueueButtonProps;
	setRepeat: (repeat: boolean) => void;
	setShuffle: (shuffle: boolean) => void;
}

interface QueueButtonProps {
	repeat: boolean;
	shuffle: boolean;
	loved: boolean;
}

interface QueueButtonProviderProps {
	children: ReactNode;
}

export const QueueButtonsContext = createContext<QueueButtonContextProps | undefined>(undefined)

export function QueueButtonsProvider({ children }: QueueButtonProviderProps) {
	const [queueButtons, setQueueButtons] = useState<QueueButtonProps>({ loved: false, repeat: false, shuffle: false })

	function getRepeat(): boolean {
		if (queueButtons) {
			return queueButtons.repeat
		} else {
			return false
		}
	}

	function getShuffle(): boolean {
		if (queueButtons) {
			return queueButtons.shuffle
		} else {
			return false
		}
	}

	function getProps(): QueueButtonProps {
		if (queueButtons) {
			return queueButtons
		}
		return { loved: false, repeat: false, shuffle: false }
	}

	function setRepeat(repeat: boolean) {
		if (queueButtons) {
			setQueueButtons((prevState) => {
				if (prevState) {
					return { ...prevState, repeat }
				}
				return prevState
			})
		}
	}

	function setShuffle(shuffle: boolean) {
		if (queueButtons) {
			setQueueButtons((prevState) => {
				if (prevState) {
					return { ...prevState, shuffle }
				}
				return prevState
			})
		}
	}

	const queueButtonsValue: QueueButtonContextProps = {
		props: { loved: false, repeat: false, shuffle: false },
		getRepeat,
		getShuffle,
		getProps,
		setRepeat,
		setShuffle
	}

	return(
		<QueueButtonsContext.Provider value={queueButtonsValue}>
			{children}
		</QueueButtonsContext.Provider>
	)
}

export function PlayerButton() {
	const [paused, setPaused] = useState<boolean>(true)
	const trackerContext = useContext(TrackerContext)

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
				onPress={() => {
					if (trackerContext) {
						const currentTrack = trackerContext.getCurrentTrack()
						
						if (currentTrack) {
							const previousTrack = trackerContext.previousTrack(currentTrack)

							if (previousTrack) {
								trackerContext.playTrack(previousTrack)
							}
						}
					}
				}}
			>
				<Ionicons color={'#ECECEC'} name='play-skip-back' size={40} />
			</TouchableOpacity>

			<TouchableOpacity onPress={handlePlayPause}>
				<FontAwesome5 color={'#ECECEC'} name={paused ? 'play' : 'pause'} size={40} />
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => {
					if (trackerContext) {
						const currentTrack = trackerContext.getCurrentTrack()
						
						if (currentTrack) {
							const nextTrack = trackerContext.nextTrack(currentTrack)
							
							if (nextTrack) {
								trackerContext.playTrack(nextTrack)
							}
						}
					}
				}}
			>
				<Ionicons color={'#ECECEC'} name='play-skip-forward' size={40} />
			</TouchableOpacity>
		</PlayerButtons>
	)
}

export function MusicName() {
	const [music, setMusic] = useState<MusicProps>()
	const trackerContext = useContext(TrackerContext)
	const progress = useProgress()

	useEffect(() => {
		if (trackerContext) {
			setMusic(
				{ 
					title: trackerContext.getCurrentTrack()?.title ?? '', 
					artist: trackerContext.getCurrentTrack()?.artist ?? '',
					duration: '',
					position: ''
				}
			)
		}
	}, [progress])

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