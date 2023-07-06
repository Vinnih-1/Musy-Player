import { styled } from 'styled-components/native'

export const Background = styled.View`
    flex: 1;
    background-color: ${props => props.theme.background};
`

export const Navbar = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    max-height: 10%;
    gap: 70px;
`

export const NavToSongs = styled.TouchableOpacity`
`

export const Title = styled.Text`
    color: #ECECEC;
    font-weight: 800;
    font-size: 20px;
`

export const SettingsButton = styled.TouchableOpacity`
    color: #ECECEC;
    font-weight: 800;
    font-size: 20px;
`

export const MusicInformation = styled.View`
    flex: 1;
    flex-direction: column;
    align-items: center;
    margin-top: 20%;
`

export const Text = styled.Text`
    color: #ECECEC;
    font-size: 16px;
    font-weight: 900;
`
export const MusicImage = styled.View`
    flex: 1;
    flex-direction: column;
    align-items: center;
    margin-top: 13%;
`

export const MusicPlayingView = styled.View`
    flex: 1;
    flex-direction: column;
    align-items: center;
    margin-top: 15%;
    width: 100%;
    max-height: 15%;
    justify-content: center;
`

export const ArtistText = styled.Text`
    color: #FFF;
    font-weight: 500;
    font-size: 11px;
`

export const PlayerManager = styled.View`
    flex: 1;
    flex-direction: column;
    align-items: center;
    width: 80%;
    max-height: 30%;
`

export const PlayerIcons = styled.View`
    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-height: 30%;
`

export const PlayerProgressBar = styled.View`
    flex: 1;
    width: 100%;
    max-height: 20%;
    justify-content: center;
    align-items: center;
`

export const PlayerProgressTimer = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    max-height: 50%;
`

export const PlayerButtons = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 5%;
    width: 60%;
`