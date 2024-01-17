// 重点：vDom包含 type, props, children
function createTextElement(text) {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        }
    }
}

function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map((child) => {
                const isTextNode = typeof child === 'string' || typeof child === 'number'
                return isTextNode ? createTextElement(child) : child
            })
        }
    }
}

// 动态创建

/**
 * 1. 创建 element
 * 2. 添加值和属性
 * 3. append到dom树上
 */

function render(el, container) {
    nextWorkOfUnit = {
        dom: container,
        props: {
            children: [el]
        }
    }

    root = nextWorkOfUnit
}

let root = null
let nextWorkOfUnit = null
function workLoop(deadline) {
    let shouldYield = false

    while (!shouldYield && nextWorkOfUnit) {
        // 当前任务执行完之后要返回下一个任务，关联
        nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)

        shouldYield = deadline.timeRemaining() < 1
    }

    if (!nextWorkOfUnit && root) {
        commitRoot()
    }

    requestIdleCallback(workLoop)
}

function commitRoot() {
    commitWork(root.child)
    root = null // 只添加一次
}


function commitWork(fiber) {
    if (!fiber) return;

    // FC 是一个函数，没有dom，递归网上找
    let fiberParent = fiber.parent
    while (!fiberParent.dom) {
        fiberParent = fiberParent.parent
    }

    if (fiber.dom) {
        fiberParent.dom.append(fiber.dom)
    }
    commitWork(fiber.child)
    commitWork(fiber.sibling)
}

function createDom(type) {
    return type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(type)
}

function updateProps(dom, props) {
    Object.keys(props).forEach((key) => {
        if (key !== 'children') {
            dom[key] = props[key]
        }
    })
}

function initChildren(fiber, children) {
    let prevChild = null
    children.forEach((child, index) => {
        const newFiber = {
            type: child.type,
            props: child.props,
            child: null,
            parent: fiber,
            sibling: null,
            dom: null
        }

        if (index === 0) {
            fiber.child = newFiber;
        } else {
            prevChild.sibling = newFiber
        }
        prevChild = newFiber
    })
}

function updateFunctionComponent(fiber) {
    const children = [fiber.type(fiber.props)]
    initChildren(fiber, children)
}

function updateHostComponent(fiber) {
    if (!fiber.dom) {
        const dom = (fiber.dom = createDom(fiber.type))
        
        // fiber.parent.dom.append(dom)
        
        updateProps(dom, fiber.props)
    }

    const children = fiber.props.children
    initChildren(fiber, children)
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
    while(nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling
        }
        nextFiber = nextFiber.parent
    }
}

requestIdleCallback(workLoop)

const React = {
    render,
    createElement
}

export default React