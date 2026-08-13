import React, { useEffect, useRef, useState } from 'react'

export default function CareMeter({onInteracted, interacted, attempts, bumpAttempts, onContinue}){
  const trackRef = useRef(null)
  const thumbRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [pos, setPos] = useState(0) // 0 bottom, 1 top

  useEffect(()=>{
    function onPointerMove(e){
      if(!dragging) return
      const track = trackRef.current
      const rect = track.getBoundingClientRect()
      const y = e.clientY
      let t = (rect.bottom - y)/rect.height
      t = Math.max(0, Math.min(1,t))
      setPos(t)
    }
    function onPointerUp(){
      if(dragging){
        setDragging(false)
        // fall back to bottom
        setPos(0)
        bumpAttempts()
      }
    }
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return ()=>{
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  },[dragging])

  function startDrag(e){
    setDragging(true)
    onInteracted && onInteracted()
  }

  const messages = ["Oops… it keeps slipping down 😭","Still trying? 💀","Take the hint 😭"]
  const msg = attempts <=1 ? messages[0] : attempts===2? messages[1] : messages[2]

  return (
    <section className="screen screen-meter">
      <h2 className="pixel-heading">On a scale of ‘don’t care at all’ to ‘care sooo much’…</h2>
      <p className="sub">How much do I actually care about your message?</p>

      <div className="meter-area">
        <div className="meter-track" ref={trackRef}>
          <div className="meter-label top">I CARE SOOO MUCH 🥺</div>
          <div className="meter-label bottom">I DON’T CARE AT ALL 😌</div>
          <div
            className="meter-thumb"
            ref={thumbRef}
            onPointerDown={startDrag}
            style={{transform: `translateY(${(1-pos)*100}%)`}}
            aria-hidden
          />
        </div>
      </div>

      <p className="meter-msg">{msg}</p>
      <div className="actions">
        <button className="pixel-btn" onClick={onContinue} disabled={!interacted}>DING DING DING 🔔</button>
      </div>
    </section>
  )
}
