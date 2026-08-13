import React, { useState, useEffect } from 'react'

/**
 * JokeGenerator
 * - Primary: https://v2.jokeapi.dev/joke/Any
 * - Fallback: https://official-joke-api.appspot.com/random_joke
 *
 * Usage: <JokeGenerator />
 */
export default function JokeGenerator() {
  const [open, setOpen] = useState(false)
  const [joke, setJoke] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0) // for simple retry/backoff

  // Simple cooldown to avoid accidental repeated rapid requests
  const [lastFetchedAt, setLastFetchedAt] = useState(0)

  async function fetchFromJokeAPI() {
    // ask for single or twopart; prefer single for this UI
    const url = 'https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,sexist,explicit&type=single,twopart'
    const res = await fetch(url)
    if (!res.ok) throw new Error('JokeAPI error')
    return res.json()
  }

  async function fetchFromOfficialJoke() {
    const url = 'https://official-joke-api.appspot.com/random_joke'
    const res = await fetch(url)
    if (!res.ok) throw new Error('OfficialJoke error')
    return res.json()
  }

  async function fetchJoke() {
    // basic rate-limit: prevent calls more than once per 800ms
    const now = Date.now()
    if (now - lastFetchedAt < 800) return
    setLastFetchedAt(now)

    setLoading(true)
    setError(null)
    setJoke(null)
    try {
      // try primary
      const data = await fetchFromJokeAPI()
      // JokeAPI returns type 'single' or 'twopart'
      if (data && (data.type === 'single' || data.type === 'twopart')) {
        const text = data.type === 'single' ? data.joke : `${data.setup}\n\n${data.delivery}`
        setJoke(text)
      } else {
        // fallback to official
        const fallback = await fetchFromOfficialJoke()
        setJoke(`${fallback.setup}\n\n${fallback.punchline}`)
      }
      // reset attempt counter on success
      setAttempt(0)
    } catch (err) {
      console.warn('Joke fetch failed, retrying fallback', err)
      // try fallback once
      try {
        const fallback = await fetchFromOfficialJoke()
        setJoke(`${fallback.setup}\n\n${fallback.punchline}`)
        setAttempt(0)
      } catch (err2) {
        console.error('Both joke fetches failed', err2)
        setError('Could not load a joke. Please try again.')
        // increase attempt so UI message may change or backoff
        setAttempt(a => a + 1)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // prefetch a joke for faster UX if panel will be opened soon
    // but only once initially
    if (!joke) {
      fetchJoke().catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function openPanel() {
    setOpen(true)
    // if we don't have a joke yet, load one
    if (!joke && !loading) fetchJoke()
  }

  function closePanel() {
    setOpen(false)
  }

  // small message variations for repeated failures
  const failMessages = [
    'Could not load a joke. Try again.',
    'Still nothing — maybe the internet is shy.',
    'No jokes today. Blame the network.'
  ]
  const failMsg = failMessages[Math.min(attempt, failMessages.length - 1)]

  return (
    <div className="joke-root" aria-live="polite">
      <button
        className="pixel-btn joke-btn"
        onClick={openPanel}
        aria-expanded={open}
        aria-controls="joke-panel"
        title="Get a random joke"
      >
        JOKE
      </button>

      {open && (
        <div
          id="joke-panel"
          className="joke-panel"
          role="dialog"
          aria-label="Random joke"
        >
          <div className="joke-card">
            <header className="joke-header">
              <div className="logo" style={{ fontSize: 11 }}>JOKE</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="pixel-btn small"
                  onClick={() => fetchJoke()}
                  disabled={loading}
                  aria-label="Fetch another joke"
                >
                  {loading ? '…' : 'Another'}
                </button>
                <button
                  className="pixel-btn small"
                  onClick={closePanel}
                  aria-label="Close jokes dialog"
                >
                  ✕
                </button>
              </div>
            </header>

            <div className="joke-body">
              {loading && <div className="joke-loading">loading…</div>}
              {error && <div className="joke-error">{failMsg}</div>}
              {!loading && !error && joke && (
                <div className="joke-text" style={{ whiteSpace: 'pre-wrap' }}>
                  {joke}
                </div>
              )}
            </div>

            <footer className="joke-actions" style={{ marginTop: 10 }}>
              <button
                className="pixel-btn"
                onClick={() => {
                  // copy joke to clipboard (friendly)
                  if (!joke) return
                  navigator.clipboard?.writeText(joke)
                }}
                disabled={!joke}
              >
                Copy
              </button>
              <button
                className="pixel-btn"
                onClick={closePanel}
              >
                Close
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  )
}
