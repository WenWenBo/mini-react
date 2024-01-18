import React from './core/React.js'

let showBar = false
function Counter() {
    const bar = <div>bar</div>

    const handleClick = () => {
        showBar = !showBar
        React.update()
    }
    return (
        <div>
            Counter
            {showBar && bar}
            <button onClick={handleClick}>click</button>
        </div>
    )
}

function App() {
    return (
        <div>
            hi-mini-react
            <Counter></Counter>
            {/* <Counter num={20}></Counter> */}
        </div>
    )
}

export default App
