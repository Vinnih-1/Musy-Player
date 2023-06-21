import React, { useContext, useEffect, useState } from 'react'
import { Background, MusicList } from './styles'
import { NavigationBar } from '../../components/navigator'
import { FooterBar } from '../../components/footer'
import { MusicCard } from '../../components/card'
import { ScrollView, Text, View } from 'react-native'
import { TrackProps, TrackerContext } from '../../contexts/track/TrackerContext'

export function Home() {
    const trackContext = useContext(TrackerContext);
    const [tracks, setTracks] = useState<TrackProps[]>([]);
    
    useEffect(() => {
        if (!trackContext) return;
        setTracks(trackContext.tracks);
    });

    return(
        <Background>
            <NavigationBar title='Musy Player'/>
                <MusicList>
                    {tracks.length == 0 ?(
                    <View style={{flex: 1, height: 1.5, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{color: "white"}}>Nenhuma música encontrada na pasta</Text>
                        <Text style={{color: "white"}}>storage/emulated/0/Music/</Text>
                    </View>
                    ):(
                        tracks.map((music) => (
                            <MusicCard key={music.url}
                                    title={music.title}
                                    url={music.url}
                                    artist={music.artist}
                            />
                        ))
                    )}
                </MusicList>
            <FooterBar/>
        </Background>
    )
}