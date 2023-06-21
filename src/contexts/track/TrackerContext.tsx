import React, { ReactNode, createContext, useEffect, useState } from 'react'

import TrackPlayer from 'react-native-track-player'
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
            RNFS.readDir(musicPath.path).then(files => {
                const musics = files.filter(file => file.name.endsWith(".mp3"))
                .map(music => {
                    return {
                        url: music.path,
                        title: music.name,
                        artist: "Autor desconhecido"
                    }
                })
                setTrack(musics)
            })

        })
    }, [])

    useEffect(() => {
        console.log(tracks)

        TrackPlayer.add(tracks).then(() => {
            TrackPlayer.play().then(() => console.log("tocando"))
        })
    }, [tracks])

    const trackContextValue: TrackerContextProps = {
        tracks: tracks
    }

    return(
        <TrackerContext.Provider value={trackContextValue}>
            {props.children}
        </TrackerContext.Provider>
    )
}