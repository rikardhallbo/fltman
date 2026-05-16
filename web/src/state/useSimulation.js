import { useEffect, useRef, useState } from 'react'
import { createInitialState, tick } from './simulation.js'

export function useSimulation(intervalMs = 1000) {
  const [state, setState] = useState(() => createInitialState())
  const ref = useRef(state)
  ref.current = state

  useEffect(() => {
    let last = performance.now()
    const id = setInterval(() => {
      const now = performance.now()
      const delta = now - last
      last = now
      setState(tick(ref.current, delta))
    }, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return state
}
