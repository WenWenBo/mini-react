# mini-react

## day01

### 从React的用法入手 
```
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)

```

### 将创建虚拟DOM的流程抽象为：
1. 创建 element.
2. 添加值和属性。
3. 将节点append到dom树上

### 思考
当dom树非常大的时候，渲染时间很长，会导致浏览器卡顿，怎么处理——fiber

## day02

主要解决dom过大时构建dom树会导致页面卡顿的问题，解决的思路是在浏览器空闲时间去直接dom树的构建（Fiber架构实现）

React中因为兼容性问题，自己实现的API，我们这里用 requestIdleCallback 这个API，原理是一样的

### 思路：
1. 将构建dom树的大任务拆分成一个个的小任务（任务单元），在每一帧空闲时间去执行这些任务单元（根据空闲时间的长短，可能每次执行多个任务单元）
2. 为了方便任务拆分后能合并回来，用链表的结构实现任务的查分和存储

执行任务单元的过程中不光是要完成创建DOM的流程，还要能实现关联下一个任务的任务（返回下一个任务）

### 思考
requestIdleCallback 如果剩余时间一直不够，就会导致渲染被阻塞，应该怎么处理。