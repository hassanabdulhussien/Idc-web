import React, { useRef, useState } from 'react'
import QuizLayout from './components/QuizLayout'
import PixelDecorations from './components/PixelDecorations'
import IntroQuestion from './screens/IntroQuestion'
import PunchlineScreen from './screens/PunchlineScreen'
import CareMeter from './screens/CareMeter'
import FinalQuestion from './screens/FinalQuestion'
import SuccessScreen from './screens/SuccessScreen'

const SCREENS = ['intro','punch','meter','final','success']

export default function App(){
  const [screenIndex, setScreenIndex] = useState(0)
  const [sliderInteracted, setSliderInteracted] = useState(false)
  const [sliderAttempts, setSliderAttempts] = useState(0)
  const containerRef = useRef(null)

  function goTo(index){
    setScreenIndex(index)
  }

  function resetAll(){
    setScreenIndex(0)
    setSliderInteracted(false)
    setSliderAttempts(0)
  }

  return (
    <div className="app-root">
      <PixelDecorations />
      <QuizLayout
        containerRef={containerRef}
        progressIndex={screenIndex}
        total={SCREENS.length}
      >
        <div ref={containerRef} className="screen-area">
          {screenIndex===0 && (
            <IntroQuestion
              onNoClick={()=>goTo(1)}
              containerRef={containerRef}
            />
          )}
          {screenIndex===1 && (
            <PunchlineScreen onContinue={()=>goTo(2)} />
          )}
          {screenIndex===2 && (
            <CareMeter
              onInteracted={()=> setSliderInteracted(true)}
              interacted={sliderInteracted}
              attempts={sliderAttempts}
              bumpAttempts={()=> setSliderAttempts(a=>a+1)}
              onContinue={()=>goTo(3)}
            />
          )}
          {screenIndex===3 && (
            <FinalQuestion
              onYes={()=>goTo(4)}
              containerRef={containerRef}
            />
          )}
          {screenIndex===4 && (
            <SuccessScreen onRestart={resetAll} />
          )}
        </div>
      </QuizLayout>
    </div>
  )
}
