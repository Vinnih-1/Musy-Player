import { styled } from "styled-components/native";

export const Background = styled.SafeAreaView`
    flex: 1;
    background-color: ${props => props.theme.background};
`

export const MusicList = styled.ScrollView`
    flex: 1;
`