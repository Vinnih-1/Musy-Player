import { styled } from 'styled-components/native'

export const Footer = styled.View`
    flex: 1;
    flex-direction: row;
    max-height: 10%;
    border-radius: 40px;
    justify-content: space-around;
    align-items: center;
    background-color: ${props => props.theme.footer};
`

export const PlayerInformation = styled.View`
    flex: 1;
    flex-direction: row;
    gap: 15px;
`

export const MusicImage = styled.View`
    height: 40px;
    width: 40px;
    background-color: gray;
    margin-left: 5%;
`

export const MusicTitleView = styled.View`
    flex: 1;
    flex-direction: column;
`

export const MusicTitleText = styled.Text`
    color: #FFF;
    font-weight: 700;
    font-size: 13px;
`

export const MusicArtistText = styled.Text`
    color: #FFF;
    font-weight: 500;
    font-size: 11px;
`

export const PlayerManager = styled.View`
    flex: 1;
    flex-direction: column;
    max-height: 50%;
    max-width: 35%;
    margin-right: 3%;
`

export const Player = styled.View`
    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 20px;
`

export const Progress = styled.View`
    flex: 1;
    max-height: 2px;
`