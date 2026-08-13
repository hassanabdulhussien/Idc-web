import React from 'react'
import ProgressIndicator from './ProgressIndicator'
import JokeGenerator from './JokeGenerator'

export default function QuizLayout({children, progressIndex, total, containerRef}){
  return (
    <div className="quiz-layout">
      <header className="topbar">
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <div className="logo">IDC.</div>
          <ProgressIndicator index={progressIndex} total={total} />
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <JokeGenerator />
        </div>
      </header>

      <main className="main-stage" ref={containerRef}>
        {children}
      </main>

      <footer className="site-footer">© 2026 Hassan Abdlhussien. All rights reserved.</footer>
    </div>
  )
}
