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
                return typeof child === 'string' ? createTextElement(child) : child
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
}

let nextWorkOfUnit = null
function workLoop(deadline) {
    let shouldYield = false

    while (!shouldYield && nextWorkOfUnit) {
        // 当前任务执行完之后要返回下一个任务，关联
        nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)

        shouldYield = deadline.timeRemaining() < 1
    }

    requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

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

function initChildren(fiber) {
    const children = fiber.props.children
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

function performWorkOfUnit(fiber) {
    /**
     * 1. 创建dom
     * 2. 处理props
     * 3. 转换链表，设置指针
     * 4. 返回下一个要执行的任务
     */
    if (!fiber.dom) {
        const dom = (fiber.dom = createDom(fiber.type))
    
        fiber.parent.dom.append(dom)
    
        updateProps(dom, fiber.props)
    }

    initChildren(fiber)

    if (fiber.child) {
        return fiber.child
    }

    if (fiber.sibling) {
        return fiber.sibling
    }

    return fiber.parent?.sibling
}

const React = {
    render,
    createElement
}

export default React