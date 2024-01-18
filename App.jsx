import React from './core/React.js'

let showBar = false
function Counter() {
    // const foo = <div>foo</div>
    function Foo() {
        return <div>foo</div>
    }
    const bar = <p>bar</p>

    const handleClick = () => {
        showBar = !showBar
        React.update()
    }
    return (
        <div>
            Counter
            <div>{showBar ? bar : <Foo />}</div>
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
