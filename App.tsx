import 'react-native-gesture-handler';
import React from 'react'
import SrcApp from './src/App';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () =>{
  return (
        <SafeAreaProvider>
            <SrcApp />
        </SafeAreaProvider>
  )
}


export default App