/* eslint-disable react/prop-types */
/* eslint-disable no-inner-declarations */
import React, { ReactNode, createContext, useContext, useRef, useState } from 'react'

import { FFprobeKit } from 'ffmpeg-kit-react-native'
import TrackPlayer, { Event } from 'react-native-track-player'
import { minimatch } from 'minimatch'
import RNFS from 'react-native-fs'
import { QueueButtonsContext } from '../../pages/player'

interface TrackerContextProps {
	getTrack: () => TrackProps[];
	setTrack: (track: TrackProps[]) => TrackProps[];
	getTrackByUrl: (track: TrackProps) => TrackProps | undefined;
	playTrack: (track: TrackProps) => void;
	nextTrack: (track: TrackProps) => TrackProps | undefined;
	previousTrack: (track: TrackProps) => TrackProps | undefined;
	getCurrentTrack: () => TrackProps | undefined;
}

export interface TrackProps {
	url: string;
	title: string;
	artist: string;
}

interface TrackerProviderProps {
	children: ReactNode;
}

export const TrackerContext = createContext<TrackerContextProps | undefined>(undefined)

export function TrackerProvider(props: TrackerProviderProps) {
	const [tracks, setTracks] = useState<TrackProps[]>([])
	const queueButtonsContext = useContext(QueueButtonsContext)
	const track = useRef<TrackProps>()

	TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => {
		if (track.current) {
			const next = nextTrack(track.current)
			if (next) {
				playTrack(next)
			}
		}
	})

	function playTrack(props: TrackProps) {
		TrackPlayer.reset().then(() => {
			TrackPlayer.removeUpcomingTracks().then(() => {
			
				if (props) {
					TrackPlayer.add(props).then(() => {
						TrackPlayer.play().then(() => track.current = props)
					})
				}
			})	
		})
	}

	function getCurrentTrack(): TrackProps | undefined {
		if (track.current) {
			return track.current
		}
	}

	function nextTrack(props: TrackProps): TrackProps | undefined {
		const currentTrack = getTrackByUrl(props)

		if (currentTrack) {
			const currentTrackIndex = tracks.findIndex(track => track.url === currentTrack.url) 
			
			if ((currentTrackIndex + 1) === tracks.length) {
				if (queueButtonsContext) {
					if (queueButtonsContext.getRepeat()) {
						return tracks[0]
					}
				}
			}

			if (currentTrackIndex) {
				return tracks[currentTrackIndex + 1]
			}
		}
	}

	function previousTrack(props: TrackProps): TrackProps | undefined {
		const currentTrack = getTrackByUrl(props)

		if (currentTrack) {
			const currentTrackIndex = tracks.findIndex(track => track.url === currentTrack.url) 
			
			if (currentTrackIndex === 0) {
				if (queueButtonsContext) {
					if (queueButtonsContext.getRepeat()) {
						return tracks[tracks.length - 1]
					}
				}
			}

			if (currentTrackIndex) {
				return tracks[currentTrackIndex - 1]
			}
		}

		return
	}

	function getTrackByUrl(props: TrackProps): TrackProps | undefined {		
		return tracks.find(track => track.url === props.url)
	}

	function getTrack(): TrackProps[] {
		return tracks
	}

	function setTrack(track: TrackProps[]): TrackProps[] {
		setTracks(track)
		return track
	}

	const trackContextValue: TrackerContextProps = {
		getTrack,
		setTrack,
		getTrackByUrl,
		playTrack,
		nextTrack,
		previousTrack,
		getCurrentTrack
	}

	return (
		<TrackerContext.Provider value={trackContextValue}>
			{props.children}
		</TrackerContext.Provider>
	)
}

export async function loadAllTracks(): Promise<TrackProps[] | undefined> {
	const tracks: TrackProps[] = []

	console.log('Starting the scan of the songs in the default directory...')

	try {
		const paths = await RNFS.readDir(RNFS.ExternalStorageDirectoryPath)
		const musicPath = paths.find((path) => path.name === 'Music')

		if (!musicPath) {
			console.error('The default music directory could not be found...')
			return
		}

		async function getMusicTags(music: RNFS.ReadDirItem): Promise<Record<string, any> | object> {
			try {
				const session = await FFprobeKit.getMediaInformation(music.path)
				const information = await session.getMediaInformation()

				if (information)
					return information.getTags()
				else
					return {}
			} catch (error) {
				console.log(error, 'for ', music.name)
				return {}
			}
		}

		async function scanMusicDirectory(directoryPath: string) {
			const files = await RNFS.readDir(directoryPath)
			const match = minimatch.filter('*.{mp3,flac}', { matchBase: true })

			const musics = files.filter(file => match(file.name))
				.map(async (music) => {
					const tags = await getMusicTags(music)

					return {
						url: music.path,
						title: 'title' in tags ? tags.title : music.name.replace(/\.[^.]+$/, ''),
						artist: 'artist' in tags ? tags.artist : 'Unknown Artist'
					}
				})
			const scannedMusics = await Promise.all(musics)
			scannedMusics.forEach(music => tracks.push(music))

			const subDirectories = files.filter((file) => file.isDirectory())
			subDirectories.forEach((subDirectory) => {
				scanMusicDirectory(subDirectory.path)
			})
		}
		await scanMusicDirectory(musicPath.path)
		return tracks
	} catch (error) {
		console.log(error)
		return tracks
	}
}