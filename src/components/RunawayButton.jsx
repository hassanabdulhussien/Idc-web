import React, { useEffect, useRef, useState } from 'react'

// Reusable runaway button that avoids a target element
export default function RunawayButton({label, onClick, avoidRef, containerRef, startPos, ariaLabel}){
  const btnRef = useRef(null)
  const [pos, setPos] = useState({left: null, top: null})
  const moving = useRef(false)

  // place at startPos or center
  useEffect(()=>{
    const container = containerRef?.current || document.body
    const btn = btnRef.current
    if(!btn) return
    const rect = container.getBoundingClientRect()
    const left = startPos?.left ?? (rect.width/2 - btn.offsetWidth/2)
    const top = startPos?.top ?? (rect.height*0.65 - btn.offsetHeight/2)
    setPos({left, top})
  },[containerRef, startPos])

  function getSafeRandom(){
    const container = containerRef?.current || document.body
    const btn = btnRef.current
    const avoid = avoidRef?.current
    if(!container || !btn) return {left:0, top:0}
    const crect = container.getBoundingClientRect()
    const bread = btn.getBoundingClientRect()

    const padding = 12
    const minX = crect.left + padding
    const minY = crect.top + padding
    const maxX = crect.right - bread.width - padding
    const maxY = crect.bottom - bread.height - padding

    let attempts = 0
    while(attempts < 50){
      const left = Math.floor(Math.random()*(maxX-minX+1)+minX) - crect.left
      const top = Math.floor(Math.random()*(maxY-minY+1)+minY) - crect.top
      const candidate = {left, top}
      // avoid overlapping avoidRef
      if(avoid){
        const avoidRect = avoid.getBoundingClientRect()
        const btnRect = {left: crect.left + left, top: crect.top + top, right: crect.left + left + bread.width, bottom: crect.top + top + bread.height}
        const overlap = !(btnRect.right < avoidRect.left || btnRect.left > avoidRect.right || btnRect.bottom < avoidRect.top || btnRect.top > avoidRect.bottom)
        if(overlap){ attempts++; continue }
      }
      return candidate
    }
    return {left: Math.max(0, (crect.width-bread.width)/2), top: Math.max(0, (crect.height-bread.height)/2)}
  }

  function moveAway(){
    if(moving.current) return
    moving.current = true
    const next = getSafeRandom()
    setPos(next)
    setTimeout(()=> moving.current=false, 220)
  }

  useEffect(()=>{
    const container = containerRef?.current || document.body
    if(!container) return

    function onPointerMove(e){
      const btn = btnRef.current
      if(!btn) return
      const brect = btn.getBoundingClientRect()
      const cx = brect.left + brect.width/2
      const cy = brect.top + brect.height/2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx,dy)
      if(dist < 120) moveAway()
    }

    container.addEventListener('pointermove', onPointerMove)
    return ()=> container.removeEventListener('pointermove', onPointerMove)
  },[containerRef])

  // For touch / click: intercept pointerdown and move before allowing click
  useEffect(()=>{
    const btn = btnRef.current
    if(!btn) return
    function onPointerDown(e){
      // if pointer is a touch or close
      const rect = btn.getBoundingClientRect()
      const cx = rect.left + rect.width/2
      const cy = rect.top + rect.height/2
      const dx = (e.clientX || (e.touches && e.touches[0].clientX)) - cx
      const dy = (e.clientY || (e.touches && e.touches[0].clientY)) - cy
      const dist = Math.hypot(dx,dy)
      if(dist < 200){
        // move away and prevent click
        e.preventDefault()
        moveAway()
      }
    }
    btn.addEventListener('pointerdown', onPointerDown)
    return ()=> btn.removeEventListener('pointerdown', onPointerDown)
  },[containerRef, avoidRef])

  const style = pos.left==null? {position:'relative'} : {position:'absolute', left: pos.left+'px', top: pos.top+'px'}

  return (
    <button
      ref={btnRef}
      className="pixel-btn runaway"
      style={style}
      onClick={(e)=>{
        // only call onClick if not recently moved
        if(moving.current) { e.preventDefault(); return }
        onClick && onClick()
      }}
      aria-label={ariaLabel || label}
    >
      {label}
    </button>
  )
}
