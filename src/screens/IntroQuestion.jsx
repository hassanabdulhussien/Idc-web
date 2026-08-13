import React, { useRef } from 'react'
import RunawayButton from '../components/RunawayButton'

export default function IntroQuestion({onNoClick, containerRef}){
  const textRef = useRef(null)
  return (
    <section className="screen screen-intro">
      <h1 className="pixel-heading">Do you really think I’m going to read all the messages you wrote?</h1>
      <p ref={textRef} className="sub">Be honest.</p>

      <div className="choices">
        <RunawayButton
          label="YES"
          avoidRef={textRef}
          containerRef={containerRef}
        />
        <button className="pixel-btn" onClick={onNoClick}>NO</button>
      </div>
    </section>
  )
}
