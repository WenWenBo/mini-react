let taskId = 1
function workLoop(deadline) {
    taskId++


    console.log(deadline.timeRemaining())
    let shouldYield = false
    while (!shouldYield) {
        console.log(`taskId: ${taskId} run task`)

        shouldYield = deadline.timeRemaining() < 1
    }

    requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)