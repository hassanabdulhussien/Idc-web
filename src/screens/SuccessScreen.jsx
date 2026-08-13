import React from 'react'

export default function SuccessScreen({onRestart}){
  return (
    <section className="screen screen-success">
      <div className="celebrate" aria-hidden />
      <h1 className="pixel-heading">Finally 😭</h1>
      <p className="sub">Character development.</p>
      <p className="small">Thank you for understanding.</p>
      <div className="actions">
        <button className="pixel-btn" onClick={onRestart}>Start over</button>
      </div>
    </section>
  )
}
