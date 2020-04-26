import React, {useState}from 'react'
import StepHome from './StepHome' 
import { withNavigation, NavigationInjectedProps, NavigationParams } from 'react-navigation'
import data from "./StepHome/Data"

export type NavigationProps = NavigationInjectedProps<NavigationParams>


const Intro = (props:NavigationProps) =>{
    const [counter, setCounter] = useState(0)
    const [start, setStart] = useState(false)
    const _next = (step:number) =>{
     if(counter < data.length-1){
      setCounter(counter+step)
      counter === data.length-2 ? done() : null
     }else{ 
       counter < data.length ? done() : null
     } 
    }
    const previous = (step:number) =>{
      counter > 0? setCounter(counter-step): setCounter(0)
    }
    const done = () =>{
      started()
    }
    const started = () =>{
      setStart(!start)
    }
   return(
     <StepHome {...props} next={_next} done={done} countData={counter} donnee={data} started={start} previous={previous} />
   )
 }

export default withNavigation(Intro)
