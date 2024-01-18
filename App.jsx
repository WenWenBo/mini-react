import React from './core/React.js'

let count = 10
let props = { id: '1111' }
function Counter({ num }) {
    const handleClick = () => {
        console.log('click')
        count++
        props = {}
        React.update()
    }
    return (
        <div {...props}>
            <div>count: {count}</div>
            <button onClick={handleClick}>click</button>
        </div>
    )
}

function CounterContainer() {
    return <Counter></Counter>
}

function App() {
    return (
        <div>
            hi-mini-react
            <Counter num={10}></Counter>
            {/* <Counter num={20}></Counter> */}
        </div>
    )
}

export default App
