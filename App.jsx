import React from './core/React.js'

/**
 * useEffect
 * 调用时机是在 React 完成对 DOM渲染之后，并且浏览器完成绘制之前
 */

function Foo() {
    const [count, setCount] = React.useState(10)
    const [bar, setBar] = React.useState('bar')
    function handleClick() {
        setCount((c) => c + 1)
        setBar('bar')
    }

    React.useEffect(() => {
        console.log('init')

        return () => {
            console.log('cleanup 0')
        }
    }, [])

    React.useEffect(() => {
        console.log('update', count)

        return () => {
            console.log('cleanup 1')
        }
    }, [count])

    React.useEffect(() => {
        console.log('update', count)

        return () => {
            console.log('cleanup 2')
        }
    }, [count])

    return (
        <div>
            <h1>foo</h1>
            {count}
            <div>{bar}</div>
            <button onClick={handleClick}>click</button>
        </div>
    )
}

let countRoot = 1
function App() {
    return (
        <div>
            hi-mini-react count: {countRoot}
            <Foo></Foo>
        </div>
    )
}

export default App
