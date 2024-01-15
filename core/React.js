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
    const dom = el.type === 'TEXT_ELEMENT' ?
        document.createTextNode(''):
        document.createElement(el.type)
    
    Object.keys(el.props).forEach((key) => {
        if (key !== 'children') {
            dom[key] = el.props[key]
        }
    })

    container.append(dom)

    el.props.children.forEach((child) => {
        render(child, dom)
    })
}

const React = {
    render,
    createElement
}

export default React