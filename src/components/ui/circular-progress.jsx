import * as React from "react"
import {Loader2} from 'lucide-react';

function CircularProgress({
  className,
  ...props
}) {
  return (
    <Loader2 className="h-4 w-4 animate-spin" />
  );
}

export {
  CircularProgress
}