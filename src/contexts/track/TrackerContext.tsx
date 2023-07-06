/* eslint-disable no-inner-declarations */
import React, { ReactNode, createContext, useState } from 'react'

import { FFprobeKit } from 'ffmpeg-kit-react-native'
import TrackPlayer, { RepeatMode } from 'react-native-track-player'
import { minimatch } from 'minimatch'
import RNFS from 'react-native-fs'

interface TrackerContextProps {
    getTrack: () => TrackProps[];
	setTrack: (track: TrackProps[]) => TrackProps[];
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

	function getTrack(): TrackProps[] {
		return tracks
	}

	function setTrack(track: TrackProps[]): TrackProps[] {
		setTracks(track)
		TrackPlayer.add(track)
		return track
	}

	const trackContextValue: TrackerContextProps = {
		getTrack,
		setTrack
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