// 重点：vDom包含 type, props, children
function createTextElement(text) {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: [],
        },
    }
}

function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map((child) => {
                const isTextNode =
                    typeof child === 'string' || typeof child === 'number'
                return isTextNode ? createTextElement(child) : child
            }),
        },
    }
}

// 动态创建

/**
 * 1. 创建 element
 * 2. 添加值和属性
 * 3. append到dom树上
 */

function render(el, container) {
    wipRoot = {
        dom: container,
        props: {
            children: [el],
        },
    }

    nextWorkOfUnit = wipRoot
}

// work in progress root
let wipRoot = null
let currentRoot = null
let nextWorkOfUnit = null
let deletions = []
let wipFiber = null
function workLoop(deadline) {
    let shouldYield = false

    while (!shouldYield && nextWorkOfUnit) {
        // 当前任务执行完之后要返回下一个任务，关联
        nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)

        if (wipRoot?.sibling?.type === nextWorkOfUnit?.type) {
            console.log('hit', wipRoot, nextWorkOfUnit)
            nextWorkOfUnit = null
        }

        shouldYield = deadline.timeRemaining() < 1
    }

    if (!nextWorkOfUnit && wipRoot) {
        commitRoot()
    }

    requestIdleCallback(workLoop)
}

function commitRoot() {
    deletions.forEach(commitDeletion)
    commitWork(wipRoot.child)
    currentRoot = wipRoot // 保留根节点，用于更新
    wipRoot = null // 只添加一次
    deletions = []
}

function commitDeletion(fiber) {
    if (fiber.dom) {
        // FC 是一个函数，没有dom，递归网上找
        let fiberParent = fiber.parent
        while (!fiberParent.dom) {
            fiberParent = fiberParent.parent
        }
        fiberParent.dom.removeChild(fiber.dom)
    } else {
        commitDeletion(fiber.child)
    }
}

function commitWork(fiber) {
    if (!fiber) return

    // FC 是一个函数，没有dom，递归网上找
    let fiberParent = fiber.parent
    while (!fiberParent.dom) {
        fiberParent = fiberParent.parent
    }

    if (fiber.effectTag === 'update') {
        // 走跟新props逻辑
        updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
    } else if (fiber.effectTag === 'placement') {
        // 走添加dom逻辑
        if (fiber.dom) {
            fiberParent.dom.append(fiber.dom)
        }
    }

    commitWork(fiber.child)
    commitWork(fiber.sibling)
}

function createDom(type) {
    return type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(type)
}

function updateProps(dom, nextProps, prevProps) {
    /**
     * 1. old 有 new 没有 —— 删除
     * 2. new 有 old 没有 —— 添加
     * 3. new 有 old 有 —— 修改
     */

    // old 有 new 没有 —— 删除
    Object.keys(prevProps).forEach((key) => {
        if (key !== 'children') {
            if (!(key in nextProps)) dom.removeAttribute(key)
        }
    })

    Object.keys(nextProps).forEach((key) => {
        if (key !== 'children') {
            if (nextProps[key] !== prevProps[key]) {
                if (key.startsWith('on')) {
                    const eventKey = key.slice(2).toLowerCase()
                    dom.removeEventListener(eventKey, prevProps[key])
                    dom.addEventListener(eventKey, nextProps[key])
                } else {
                    dom[key] = nextProps[key]
                }
            }
        }
    })
}

function reconcileChildren(fiber, children) {
    let oldFiber = fiber.alternate?.child
    let prevChild = null
    children.forEach((child, index) => {
        const isSameType = oldFiber && oldFiber.type === child.type

        let newFiber
        if (isSameType) {
            // 新的dom树节点 update
            newFiber = {
                type: child.type,
                props: child.props,
                child: null,
                parent: fiber,
                sibling: null,
                dom: oldFiber.dom,
                effectTag: 'update',
                alternate: oldFiber, // 指向旧节点
            }
        } else {
            // 创建节点时如果没有child则不创建 —— edge case情况可能传入一个表达式
            if (child) {
                newFiber = {
                    type: child.type,
                    props: child.props,
                    child: null,
                    parent: fiber,
                    sibling: null,
                    dom: null,
                    effectTag: 'placement',
                }
            }

            if (oldFiber) {
                console.log('should delete', oldFiber)
                deletions.push(oldFiber)
            }
        }

        if (oldFiber) {
            oldFiber = oldFiber.sibling
        }

        if (index === 0) {
            fiber.child = newFiber
        } else {
            prevChild.sibling = newFiber
        }

        // 有可能为空表达式
        if (newFiber) {
            prevChild = newFiber
        }
    })

    // 删掉多余的节点
    while (oldFiber) {
        deletions.push(oldFiber)
        oldFiber = oldFiber.sibling // 多个兄弟节点循环删除
    }
}

function updateFunctionComponent(fiber) {
    wipFiber = fiber
    const children = [fiber.type(fiber.props)]
    reconcileChildren(fiber, children)
}

function updateHostComponent(fiber) {
    if (!fiber.dom) {
        const dom = (fiber.dom = createDom(fiber.type))

        // fiber.parent.dom.append(dom)

        updateProps(dom, fiber.props, {})
    }

    const children = fiber.props.children
    reconcileChildren(fiber, children)
}

function performWorkOfUnit(fiber) {
    /**
     * 1. 创建dom
     * 2. 处理props
     * 3. 转换链表，设置指针
     * 4. 返回下一个要执行的任务
     */
    const isFunctionComponent = typeof fiber.type === 'function'

    // 不是 FC 才创建DOM
    if (isFunctionComponent) {
        updateFunctionComponent(fiber)
    } else {
        updateHostComponent(fiber)
    }

    if (fiber.child) {
        return fiber.child
    }

    let nextFiber = fiber
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling
        }
        nextFiber = nextFiber.parent
    }
}

requestIdleCallback(workLoop)

// 用 currentRoot 来创建新的 dom 树
function update() {
    let currentFiber = wipFiber
    return () => {
        console.log(currentFiber)

        // 指向要跟新的节点
        wipRoot = {
            ...currentFiber,
            alternate: currentFiber,
        }
        // wipRoot = {
        //     dom: currentRoot.dom,
        //     props: currentRoot.props,
        //     alternate: currentRoot, // 根节点指向旧 dom 树的根节点
        // }

        nextWorkOfUnit = wipRoot
    }
}

const React = {
    render,
    update,
    createElement,
}

export default React
