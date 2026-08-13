import React from 'react'

function Pixel({className, style, children}){
  return <div className={"pixel "+className} style={style}>{children}</div>
}

export default function PixelDecorations(){
  return (
    <div className="decorations" aria-hidden>
      <div className="pixels">
        <div className="pixel-heart" />
        <div className="pixel-star" />
        <div className="pixel-spark" />
        <div className="pixel-flower" />
        <div className="pixel-block" />
      </div>
    </div>
  )
}
