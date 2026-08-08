'use client'

import { Suspense, lazy, ComponentProps } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
  onLoad?: (splineApp: any) => void
  onSplineMouseDown?: (e: any) => void
  onSplineMouseUp?: (e: any) => void
  onSplineMouseHover?: (e: any) => void
  onMouseDown?: (e: any) => void
  onClick?: (e: any) => void
  style?: React.CSSProperties
}

export function SplineScene({
  scene,
  className,
  onLoad,
  onSplineMouseDown,
  onSplineMouseUp,
  onSplineMouseHover,
  onMouseDown,
  onClick,
  style,
}: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="loader"></span>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
        onLoad={onLoad}
        onSplineMouseDown={onSplineMouseDown}
        onSplineMouseUp={onSplineMouseUp}
        onSplineMouseHover={onSplineMouseHover}
        onMouseDown={onMouseDown}
        onClick={onClick}
        style={style}
      />
    </Suspense>
  )
}
