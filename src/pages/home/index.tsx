import React from 'react'
import { Background } from './styles'
import { NavigationBar } from '../../components/navigator'
import { FooterBar } from '../../components/footer'

export function Home() {
    return(
        <Background>
            <NavigationBar title='Musy Player'/>
            <FooterBar/>
        </Background>
    )
}