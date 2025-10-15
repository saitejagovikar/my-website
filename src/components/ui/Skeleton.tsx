import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`animate-pulse bg-gray-200 rounded-md ${className}`}
      {...props}
    />
  )
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
