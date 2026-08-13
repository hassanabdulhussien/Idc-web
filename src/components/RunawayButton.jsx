import React, { useEffect, useRef, useState } from 'react'

// Reusable runaway button that avoids a target element
export default function RunawayButton({label, onClick, avoidRef, containerRef, startPos, ariaLabel}){
  const btnRef = useRef(null)
  const [pos, setPos] = useState({left: null, top: null})
  const moving = useRef(false)

  // place at startPos or center
  useEffect(()=>{
    try{
      const container = containerRef?.current || document.body
      const btn = btnRef.current
      if(!btn || !container) return
      const rect = container.getBoundingClientRect()
      const left = startPos?.left ?? (rect.width/2 - btn.offsetWidth/2)
      const top = startPos?.top ?? (rect.height*0.65 - btn.offsetHeight/2)
      setPos({left, top})
    }catch(err){
      // swallow — positioning is non-fatal; overlay will show runtime errors
      console.warn('RunawayButton: initial placement failed', err)
    }
  },[containerRef, startPos])

  function safeGetRect(el){
    try{
      if(!el || !el.getBoundingClientRect) return null
      return el.getBoundingClientRect()
    }catch(e){
      return null
    }
  }

  function getSafeRandom(){
    try{
      const container = containerRef?.current || document.body
      const btn = btnRef.current
      const avoid = avoidRef?.current
      if(!container || !btn) return {left:0, top:0}
      const crect = safeGetRect(container)
      const bread = safeGetRect(btn)
      if(!crect || !bread) return {left:0, top:0}

      const padding = 12
      const minX = crect.left + padding
      const minY = crect.top + padding
      const maxX = crect.right - bread.width - padding
      const maxY = crect.bottom - bread.height - padding

      let attempts = 0
      while(attempts < 50){
        const left = Math.floor(Math.random()*(Math.max(1, maxX-minX)+1)+minX) - crect.left
        const top = Math.floor(Math.random()*(Math.max(1, maxY-minY)+1)+minY) - crect.top
        const candidate = {left, top}
        // avoid overlapping avoidRef
        if(avoid){
          const avoidRect = safeGetRect(avoid)
          if(avoidRect){
            const btnRect = {left: crect.left + left, top: crect.top + top, right: crect.left + left + bread.width, bottom: crect.top + top + bread.height}
            const overlap = !(btnRect.right < avoidRect.left || btnRect.left > avoidRect.right || btnRect.bottom < avoidRect.top || btnRect.top > avoidRect.bottom)
            if(overlap){ attempts++; continue }
          }
        }
        return candidate
      }
      return {left: Math.max(0, (crect.width-bread.width)/2), top: Math.max(0, (crect.height-bread.height)/2)}
    }catch(err){
      console.warn('RunawayButton: getSafeRandom failed', err)
      return {left:0, top:0}
    }
  }

  function moveAway(){
    if(moving.current) return
    moving.current = true
    const next = getSafeRandom()
    setPos(next)
    setTimeout(()=> moving.current=false, 220)
  }

  useEffect(()=>{
    try{
      const container = containerRef?.current || document.body
      if(!container) return

      function onPointerMove(e){
        try{
          const btn = btnRef.current
          if(!btn) return
          const brect = safeGetRect(btn)
          if(!brect) return
          const cx = brect.left + brect.width/2
          const cy = brect.top + brect.height/2
          const clientX = typeof e.clientX === 'number' ? e.clientX : (e.touches && e.touches[0] && e.touches[0].clientX)
          const clientY = typeof e.clientY === 'number' ? e.clientY : (e.touches && e.touches[0] && e.touches[0].clientY)
          if (typeof clientX !== 'number' || typeof clientY !== 'number') return
          const dx = clientX - cx
          const dy = clientY - cy
          const dist = Math.hypot(dx,dy)
          if(dist < 120) moveAway()
        }catch(e){ /* ignore per-move errors */ }
      }

      container.addEventListener('pointermove', onPointerMove)
      return ()=> container.removeEventListener('pointermove', onPointerMove)
    }catch(err){
      console.warn('RunawayButton: pointermove effect failed', err)
    }
  },[containerRef])

  // For touch / click: intercept pointerdown and move before allowing click
  useEffect(()=>{
    try{
      const btn = btnRef.current
      if(!btn) return
      function onPointerDown(e){
        try{
          const rect = safeGetRect(btn)
          if(!rect) return
          const cx = rect.left + rect.width/2
          const cy = rect.top + rect.height/2
          const clientX = typeof e.clientX === 'number' ? e.clientX : (e.touches && e.touches[0] && e.touches[0].clientX)
          const clientY = typeof e.clientY === 'number' ? e.clientY : (e.touches && e.touches[0] && e.touches[0].clientY)
          if (typeof clientX !== 'number' || typeof clientY !== 'number') { moveAway(); e.preventDefault(); return }
          const dx = clientX - cx
          const dy = clientY - cy
          const dist = Math.hypot(dx,dy)
          if(dist < 200){
            // move away and prevent click
            e.preventDefault()
            moveAway()
          }
        }catch(e){ /* ignore pointerdown errors */ }
      }
      btn.addEventListener('pointerdown', onPointerDown)
      return ()=> btn.removeEventListener('pointerdown', onPointerDown)
    }catch(err){
      console.warn('RunawayButton: pointerdown effect failed', err)
    }
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
