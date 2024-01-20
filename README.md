# mini-react

## git repo

https://github.com/WenWenBo/mini-react

## day01

### 从 React 的用法入手

```
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)

```

### 将创建虚拟 DOM 的流程抽象为：

1. 创建 element.
2. 添加值和属性。
3. 将节点 append 到 dom 树上

### 思考

当 dom 树非常大的时候，渲染时间很长，会导致浏览器卡顿，怎么处理——fiber

## day02

主要解决 dom 过大时构建 dom 树会导致页面卡顿的问题，解决的思路是在浏览器空闲时间去直接 dom 树的构建（Fiber 架构实现）

React 中因为兼容性问题，自己实现的 API，我们这里用 requestIdleCallback 这个 API，原理是一样的

### 思路：

1. 将构建 dom 树的大任务拆分成一个个的小任务（任务单元），在每一帧空闲时间去执行这些任务单元（根据空闲时间的长短，可能每次执行多个任务单元）
2. 为了方便任务拆分后能合并回来，用链表的结构实现任务的查分和存储

执行任务单元的过程中不光是要完成创建 DOM 的流程，还要能实现关联下一个任务的任务（返回下一个任务）

### 思考

requestIdleCallback 如果剩余时间一直不够，就会导致渲染被阻塞，应该怎么处理。

## day03

实现 function component
整体的流程需要自己逐步调试理解几遍。

## day04

复习

## day05

### 实现事件绑定

在 updateProps 中检测是否有对应的事件属性，将事件属性转化成原生的事件名然后绑定在对应的 dom 上即可

### 实现更新 Props

跟新 Props 的操作是手动触发的 update 函数，在 react 中是由于状态的更新触发的，每次更新会生成一个新的 dom 树，然后与旧的 dom 树进行 diff

1. 如何得到新的 dom 树 —— 跟创建时一样参考 render 函数实现即可
2. 如何找到老的节点 —— 树已经被转化为一个链表，在新的树的节点中指向旧的树的节点，快速找到旧的节点
3. 如何 diff props —— updateProps

### 代码命名重构

## day06

### diff-更新 children

标签 type 不一致时，删除旧的创建新的

### diff-删除多余的老节点

新的节点树比老的节点树短的时候，删掉多余的节点

### edge case

### 优化更新，减少不必要的计算

react 中将跟新的内容抽成单独的组件，优化更新性能

## day07

### 实现 useState

重点是理解怎么把状态存下来，每次组件更新都会重新调用一次 useState，理解怎么保存之前的状态和更新后怎么拿到最新的状态渲染

### 批量更新 action

### 提前检测，减少不必要的更新

提前检测 setState 后的值是否与之前状态一样，如果一样就不执行后面的更新操作

## day08
