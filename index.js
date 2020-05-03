import { AppRegistry } from 'react-native'
import BackgroundFetch from "react-native-background-fetch"
import {executeTask} from './src/Services/BackgroundTaskService'
import App from './App'
import { name as appName } from './app.json'

let backgroundFetchHeadlessTask = async (event) => {
    
    console.log('[BackgroundFetch HeadlessTask] event: ', event)
    let taskId = event.taskId  
    console.log('[BackgroundService] Inner task start: ', taskId)
    executeTask()
    
    BackgroundFetch.finish(taskId)
}

AppRegistry.registerComponent(appName, () => App)

// Register your BackgroundFetch HeadlessTask
BackgroundFetch.registerHeadlessTask(backgroundFetchHeadlessTask)
