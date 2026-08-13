import React from 'react'
import ProgressIndicator from './ProgressIndicator'

export default function QuizLayout({children, progressIndex, total, containerRef}){
  return (
    <div className="quiz-layout">
      <header className="topbar">
        <div className="logo">IDC.</div>
        <ProgressIndicator index={progressIndex} total={total} />
      </header>

      <main className="main-stage" ref={containerRef}>
        {children}
      </main>

      <footer className="site-footer">© 2026 Hassan Abdlhussien. All rights reserved.</footer>
    </div>
  )
}
