import React, { useRef } from 'react'
import RunawayButton from '../components/RunawayButton'

export default function FinalQuestion({onYes, containerRef}){
  const textRef = useRef(null)
  return (
    <section className="screen screen-final">
      <h1 className="pixel-heading">Can you please stop texting me?</h1>
      <p className="sub">(there is only one right answer)</p>

      <div className="choices">
        <button className="pixel-btn" onClick={onYes}>YES</button>
        <RunawayButton
          label="NO"
          avoidRef={textRef}
          containerRef={containerRef}
        />
      </div>
    </section>
  )
}
