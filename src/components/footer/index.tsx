import React from 'react'

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

import TrackPlayer from 'react-native-track-player'

export function FooterBar() {
    return(
        <Footer>
            <PlayerInformation>
                <MusicImage>
                    <Image style={{maxWidth: 40, maxHeight: 40}} source={require('../../assets/music-icon.png')}/>
                </MusicImage>
                <MusicTitleView>
                    <MusicTitleText>Nakhla</MusicTitleText>
                    <MusicArtistText>Hidden & Khalse & Sijal</MusicArtistText>
                </MusicTitleView>
            </PlayerInformation>
            
            <PlayerManager>
                <Player>
                    <TouchableOpacity
                        onPress={() => TrackPlayer.skipToPrevious()}
                    >
                        <Ionicons color={'#ECECEC'} name='play-skip-back' size={20}/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                        }}
                    >
                        <FontAwesome5 color={'#ECECEC'} name='pause' size={20}/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => TrackPlayer.skipToNext}
                    >
                        <Ionicons color={'#ECECEC'} name='play-skip-forward' size={20}/>
                    </TouchableOpacity>
                </Player>

                <Progress>

                </Progress>
            </PlayerManager>
        </Footer>
    )
}