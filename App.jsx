import React from './core/React.js'

let showBar = false
function Counter() {
    const foo = (
        <div>
            foo
            <div>child1</div>
            <div>child2</div>
        </div>
    )

    const bar = <div>bar</div>

    const handleClick = () => {
        showBar = !showBar
        React.update()
    }
    return (
        <div>
            Counter
            <button onClick={handleClick}>click</button>
            <div>{showBar ? bar : foo}</div>
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
