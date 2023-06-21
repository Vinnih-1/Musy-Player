import React from 'react'
import { 
    Background, 
    CardImage, 
    CardInformation, 
    CardPlayingIcon, 
    MusicInformation 
} from './styles'

import { Image } from 'react-native'
import { MusicArtistText, MusicTitleText } from '../footer/styles'
import { TrackProps } from '../../contexts/track/TrackerContext'

export function MusicCard(props: TrackProps) {
    return(
        <Background>
            <CardInformation>
                <CardImage>
                    <Image style={{maxWidth: 40, maxHeight: 40}} source={require('../../assets/music-icon.png')}/>
                </CardImage>
                <MusicInformation>
                    <MusicTitleText>{props.title.replace(".mp3", "")}</MusicTitleText>
                    <MusicArtistText>{props.artist}</MusicArtistText>
                </MusicInformation>
            </CardInformation>

            <CardPlayingIcon>
                <Image style={{maxWidth: 40, maxHeight: 40}} source={require('../../assets/playing.png')} />
            </CardPlayingIcon>
        </Background>
    )
}