# 图

![图](./img/40.jpg)

- 图中的元素我们就叫做顶点（vertex）
- 图中的一个顶点可以与任意其他顶点建立连接关系。我们把这种建立的关系叫做边（edge）
- 跟顶点相连接的边的条数,就叫做顶点的度（degree）
- 我们把这种边有方向的图叫做“有向图”
- 我们把边没有方向的图就叫做“无向图”

![有向图](./img/41.jpg)

- 在有向图中，我们把度分为入度（In-degree）和出度（Out-degree）

![带权图](./img/42.jpg)

- 带权图，每条边都有一个权重（weight）

![邻接矩阵](./img/43.jpg)

- 图最直观的一种存储方法就是，邻接矩阵（Adjacency Matrix）

![邻接表](./img/44.jpg)

- 另外一种图的存储方法，邻接表（Adjacency List）

## 广度优先搜索（BFS）

- 广度优先搜索（Breadth-First-Search），我们平常都简称 BFS。
- 直观地讲，它其实就是一种“地毯式”层层推进的搜索策略，即先查找离起始顶点最近的，然后是次近的，依次往外搜索
- 借助一个队列实现深度优先搜索
- 三个重要的辅助变量 visited、queue、prev

visited 是用来记录已经被访问的顶点，用来避免顶点被重复访问
queue 是一个队列，用来存储已经被访问、但相连的顶点还没有被访问的顶点
prev 用来记录搜索路径

使用对象模拟图

```js
/*
    a ——  b —— g
    |    |  \
    d —— e —— c
    |    |
    f    h
  */
let graph = {
  a: ['b', 'd'],
  b: ['a', 'e', 'c', 'g'],
  c: ['b', 'e'],
  d: ['a', 'e', 'f'],
  e: ['b', 'd', 'c', 'h'],
  f: ['d'],
  h: ['e'],
  g: ['b']
}
// 广度优先搜索
function bfs(graph, vertex, visited = [], queue = [], prev = []) {
  visited.push(vertex) // 设置当前顶点访问
  let ver = graph[vertex] // 获取当前顶点的所有邻接点
  queue = ver
  while (queue.length) {
    for (let i = 0; i < ver.length; i++) {
      // 没访问过的点push，避免重复
      if (!visited.includes(ver[i])) {
        visited.push(ver[i])
        queue.push(ver[i])
        prev.push(`${vertex}->${ver[i]}`)
      }
    }
    // 类似树的层次遍历
    vertex = queue.shift()
    ver = graph[vertex]
  }
  return [prev.join(), visited.join()]
}
console.log(bfs(graph, 'a'));
```

## 深度优先搜索（DFS）

- 深度优先搜索（Depth-First-Search），简称 DFS
- 深度优先搜索用的是一种比较著名的算法思想，回溯思想
- 深度优先搜索算法的消耗内存主要是 visited、prev 数组和递归调用栈
- 借助一个栈实现深度优先搜索

```js
/*
    a ——  b —— g
    |    |  \
    d —— e —— c
    |    |
    f    h
  */
let graph = {
  a: ['b', 'd'],
  b: ['a', 'e', 'c', 'g'],
  c: ['b', 'e'],
  d: ['a', 'e', 'f'],
  e: ['b', 'd', 'c', 'h'],
  f: ['d'],
  h: ['e'],
  g: ['b']
}
// 深度优先搜索
function dfs(graph, vertex, visited = [], prev = []) {
  if (visited.includes(vertex)) return
  visited.push(vertex)
  let ver = graph[vertex]
  for (let i = 0; i < ver.length; i++) {
    // 没访问过的点push，避免重复
    if (!visited.includes(ver[i])) {
      prev.push(`${vertex}->${ver[i]}`)
      dfs(graph, ver[i], visited, prev) // 使用递归就能模拟栈
    }
  }
  return [prev.join(), visited.join()]
}
console.log(dfs(graph, 'g'));
```