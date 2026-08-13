import React from 'react'

export default function PunchlineScreen({onContinue}){
  return (
    <section className="screen screen-punch">
      <div className="confetti" aria-hidden />
      <h2 className="pixel-heading">You’re right!\nYou’re just wasting your time.</h2>
      <p className="sub">Absolutely nobody asked for that essay.</p>
      <div className="actions">
        <button className="pixel-btn large" onClick={onContinue}>CONTINUE 💀</button>
      </div>
    </section>
  )
}
