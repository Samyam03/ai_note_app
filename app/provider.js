'use client'

import React from 'react'
import { ConvexReactClient } from 'convex/react'
import { ConvexProvider } from 'convex/react'

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null

function Provider({ children }) {
  if (!convex) {
    return <div>{children}</div>
  }

  return (
    <ConvexProvider client={convex}>{children}</ConvexProvider>
  )
}

export default Provider
