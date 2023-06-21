import React from 'react'
import { NavigatorBar, Title, SearchView, SideMenuView, Navbar, PagesBar, Text } from './styles'
import { TouchableOpacity } from 'react-native'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

interface NavbarProps {
    title: string
}

export function NavigationBar(props: NavbarProps) {
    return (
        <NavigatorBar>
            <Navbar>
                <SideMenuView>
                    <TouchableOpacity>
                        <MaterialCommunityIcons color={'#ECECEC'} name='text' size={30}/>
                    </TouchableOpacity>

                    <Title>
                        {props.title}
                    </Title>
                </SideMenuView>

                <SearchView>
                    <TouchableOpacity>
                        <MaterialIcons color={'#ECECEC'} name='search' size={40}/>
                    </TouchableOpacity>
                </SearchView>
            </Navbar>

            <PagesBar>
                <TouchableOpacity>
                    <Text>Songs</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Text>Artists</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Text>Playlist</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Text>Albums</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Text>Folder</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <MaterialCommunityIcons color={'#ECECEC'} name='shuffle-variant' size={18}/>
                </TouchableOpacity>

                <TouchableOpacity>
                    <MaterialCommunityIcons color={'#ECECEC'} name='playlist-play' size={19}/>
                </TouchableOpacity>
            </PagesBar>
        </NavigatorBar>
    )
}