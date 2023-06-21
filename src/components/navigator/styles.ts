import { styled } from 'styled-components/native'

export const Title = styled.Text`
    color: #ECECEC;
    font-weight: 800;
    font-size: 20px;
`

export const Text = styled.Text`
    color: #ECECEC;
    font-size: 11px;
    font-weight: 600;
`

export const NavigatorBar = styled.View`
    flex: 1;
    max-height: 13%;
`

export const PagesBar = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    max-height: 25%;
`

export const Navbar = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
`

export const SideMenuView = styled.View`
    flex: 1;
    flex-direction: row;
    gap: 20px;
    margin-left: 5%;
`

export const SearchView = styled.View`
    flex: 1;
    align-items: flex-end;
    margin-right: 10%;
`