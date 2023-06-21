import React, { useEffect, useState } from 'react'

import {
    Footer,
    MusicArtistText,
    MusicImage,
    MusicTitleText,
    MusicTitleView,
    Player,
    PlayerInformation,
    PlayerManager,
    Progress
} from './styles'

import { TouchableOpacity, Image } from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import TrackPlayer, { State, Event } from 'react-native-track-player'

export function FooterBar() {
    const [paused, setPaused] = useState<boolean>(false)
    const [title, setTitle] = useState<string>("")
    const [artist, setArtist] = useState<string>("")

    TrackPlayer.addEventListener(Event.RemotePlay, () => { TrackPlayer.play(); setPaused(false) });
    TrackPlayer.addEventListener(Event.RemotePause, () => { TrackPlayer.pause(); setPaused(true) });

    useEffect(() => {
        function setTrack() {
            TrackPlayer.getCurrentTrack().then((track) => {
                TrackPlayer.getTrack(Number(track)).then((track) => {
                    setTitle(track?.title ?? "")
                    setArtist(track?.artist ?? "")

                })
            })
        }

        TrackPlayer.addEventListener(Event.PlaybackTrackChanged, setTrack)
    }, [])

    async function handlePlayPause() {
        const state = await TrackPlayer.getState();

        if (state === State.Playing) {
            TrackPlayer.pause()
            setPaused(true)
        } else {
            TrackPlayer.play()
            setPaused(false)
        }
    }



    return (
        <Footer>
            <PlayerInformation>
                <MusicImage>
                    <Image style={{ maxWidth: 40, maxHeight: 40 }} source={require('../../assets/music-icon.png')} />
                </MusicImage>
                <MusicTitleView>
                    <MusicTitleText>{title}</MusicTitleText>
                    <MusicArtistText>{artist}</MusicArtistText>
                </MusicTitleView>
            </PlayerInformation>

            <PlayerManager>
                <Player>
                    <TouchableOpacity
                        onPress={() => TrackPlayer.skipToPrevious()}
                    >
                        <Ionicons color={'#ECECEC'} name='play-skip-back' size={20} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handlePlayPause}>
                        <FontAwesome5 color={'#ECECEC'} name={paused ? 'play' : 'pause'} size={20} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => TrackPlayer.skipToNext()}
                    >
                        <Ionicons color={'#ECECEC'} name='play-skip-forward' size={20} />
                    </TouchableOpacity>
                </Player>

                <Progress>

                </Progress>
            </PlayerManager>
        </Footer>
    )
}