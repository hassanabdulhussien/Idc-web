import React, { useEffect, useState } from 'react'

export default function ProgressIndicator({index=0,total=5}){
  const [anim, setAnim] = useState(0)
  useEffect(()=>{
    setAnim(a=>a+1)
  },[index])

  const boxes = Array.from({length: total}, (_,i)=> i)
  return (
    <div className="progress">
      {boxes.map(i=> (
        <div key={i} className={`pixel-box ${i<=index? 'on':''} ${anim}`} />
      ))}
    </div>
  )
}
