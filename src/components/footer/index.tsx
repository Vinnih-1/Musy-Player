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

import { TouchableOpacity } from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

export function FooterBar() {
    return(
        <Footer>
            <PlayerInformation>
                <MusicImage></MusicImage>
                <MusicTitleView>
                    <MusicTitleText>Nakhla</MusicTitleText>
                    <MusicArtistText>Hidden & Khalse & Sijal</MusicArtistText>
                </MusicTitleView>
            </PlayerInformation>
            
            <PlayerManager>
                <Player>
                    <TouchableOpacity>
                        <Ionicons name='play-skip-back' size={20}/>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <FontAwesome5 name='pause' size={20}/>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Ionicons name='play-skip-forward' size={20}/>
                    </TouchableOpacity>
                </Player>

                <Progress>

                </Progress>
            </PlayerManager>
        </Footer>
    )
}