import React, { ReactNode, createContext, useEffect, useState } from 'react'

import { FFmpegKit, FFprobeKit, FFmpegKitConfig } from 'ffmpeg-kit-react-native'
import TrackPlayer from 'react-native-track-player'
import { minimatch } from 'minimatch'
import RNFS from 'react-native-fs'

interface TrackerContextProps {
    tracks: Array<TrackProps>
}

export interface TrackProps {
    url: string;
    title: string;
    artist: string;
}

interface TrackerProviderProps {
    children: ReactNode;
}

export const TrackerContext = createContext<TrackerContextProps | undefined>(undefined);

export function TrackerProvider(props: TrackerProviderProps) {
    const [tracks, setTrack] = useState<TrackProps[]>([]);

    useEffect(() => {
        console.log('Iniciando o escaneamento das músicas no diretório padrão...')

        RNFS.readDir(RNFS.ExternalStorageDirectoryPath).then(paths => {
            const musicPath = paths.find(path => path.name === "Music")

            if (!musicPath) {
                console.error('O diretório padrão de músicas não foi encontrado...')
                return
            }

            async function getMusicTags(music: RNFS.ReadDirItem): Promise<Record<string, any> | {}> {
                try {
                    const session = await FFprobeKit.getMediaInformation(music.path);
                    const information = await session.getMediaInformation();

                    if (information)
                        return information.getTags();
                    else
                        return {}
                } catch (error) {
                    console.log(error, "for ", music.name);
                    return {}
                }
            }

            function scanMusicDirectory(directoryPath: string) {
                RNFS.readDir(directoryPath).then(files => {
                    const match = minimatch.filter("*.{mp3,flac}", { matchBase: true })

                    const musics = files.filter(file => match(file.name))
                        .map(async (music) => {
                            const tags = await getMusicTags(music)
                            
                            return {
                                url: music.path,
                                title: "title" in tags ? tags.title : music.name,
                                artist: "artist" in tags ? tags.artist : "Unknown Artist"
                            }
                        })

                    Promise.all(musics).then((musics) => {
                        setTrack(musics)
                    }).catch((error) => {
                        console.log(error)
                    })

                    const subDirectories = files.filter((file) => file.isDirectory())
                    subDirectories.forEach((subDirectory) => {
                        scanMusicDirectory(subDirectory.path);
                    });
                })
            }

            scanMusicDirectory(musicPath.path)
        })
    }, [])

    useEffect(() => {
        TrackPlayer.add(tracks).then(() => {
            TrackPlayer.play().then(() => console.log("Click"))
        })
    }, [tracks])

    const trackContextValue: TrackerContextProps = {
        tracks: tracks
    }

    return (
        <TrackerContext.Provider value={trackContextValue}>
            {props.children}
        </TrackerContext.Provider>
    )
}