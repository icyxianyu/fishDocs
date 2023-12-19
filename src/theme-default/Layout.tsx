import { useState } from "react"

export function Layout() {
    const [state, setState] = useState(2);
    return (
        <div>
            <div>{state}</div>
            <button onClick={() => { setState(state + 1) }}>点击加1</button>
        </div>
    )
}