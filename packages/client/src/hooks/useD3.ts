import React, {useRef} from 'react'
import * as d3 from 'd3'

const useD3 = (callbackFunction: { (ctx: any): void }) => {
    const ref = useRef(null)
    const canvasRef = ref.current
    const context = canvasRef?.getContext('2d')
    callbackFunction(context)

    return canvasRef
}

export default useD3