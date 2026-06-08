'use client'

import React from 'react'

export default class ThreeErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Three.js canvas error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center rounded-[24px] border border-dashed border-[#FF6B6B]/40 bg-white/70 px-4 text-center text-sm font-semibold text-[#1A3A5C]">
          The 3D beach scene is taking a quick splash break.
        </div>
      )
    }

    return this.props.children
  }
}
