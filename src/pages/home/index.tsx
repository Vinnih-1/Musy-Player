import { TrackProps, TrackerContext } from '../../contexts/track/TrackerContext'
import React, { useContext, useEffect, useState } from 'react'
import { NavigationBar } from '../../components/navigator'
import { Background, MusicList } from './styles'
import { FooterBar } from '../../components/footer'
import { MusicCard } from '../../components/card'
import { ScrollView, Text, View } from 'react-native'

export function Home() {
    const trackContext = useContext(TrackerContext);
    const [tracks, setTracks] = useState<TrackProps[]>([]);

    useEffect(() => {
        if (!trackContext) return;
        setTracks(trackContext.tracks);
    });

    return (
        <Background>
            <NavigationBar title='Musy Player' />
            <MusicList>
                {tracks.length == 0 ? (
                    <View style={{ flex: 1, height: 1.5, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: "white" }}>No music found in the folder</Text>
                        <Text style={{ color: "white" }}>storage/emulated/0/Music/</Text>
                    </View>
                ) : (
                    tracks.map((music) => (
                        <MusicCard key={music.url}
                            title={music.title}
                            url={music.url}
                            artist={music.artist}
                        />
                    ))
                )}
            </MusicList>

            <FooterBar title='' artist='' />
        </Background>
    )
}