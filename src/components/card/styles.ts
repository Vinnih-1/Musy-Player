import { styled } from 'styled-components/native'

export const Background = styled.TouchableOpacity`
    flex: 1;
    flex-direction: row;
    height: 90px;
`

export const CardInformation = styled.View`
    flex: 1;
    flex-direction: row;
    align-items: center;
    gap: 20px;
`

export const CardImage = styled.View`
    height: 40px;
    width: 40px;
    margin-left: 8%;
`

export const MusicInformation = styled.View`
    flex: 1;
    flex-direction: column;
`

export const CardPlayingIcon = styled.View`
    flex: 1;
    flex-direction: row;
    align-items: center;
    max-width: 25%;
`