import React from "react";
import {ChakraProvider, extendTheme} from '@chakra-ui/react'
import {EthProvider} from "../contexts/EthContext";
import App from "./App";
import Admin from "./Admin";


const theme = extendTheme({
    styles: {
        global: (props) => ({
            body: {
                bg: 'gray.300'
            }
        })
    }
})

export default function index() {
    return (
        <EthProvider>
            <ChakraProvider theme={theme}>
                <App/>
            </ChakraProvider>
        </EthProvider>
    )
}