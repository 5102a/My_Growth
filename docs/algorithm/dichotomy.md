# 二分法查找

## 二分法(折半查找)

- 时间复杂度O(logn)级别的查找，在有序队列中使用
- 每次查找范围缩小一半，所以也叫折半查找

注意点：

1. 循环退出条件
2. mid 的取值
3. low 和 high 的更新

> 终止条件、区间上下界更新方法、返回值选择

代码实现

```js js 二分法
const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
// 基于递归的二分法查找
function search(arr, target, l = 0, r = arr.length - 1) {
  // 超限表示不存在
  if (l > r) return -1;
  // 取中
  let mid = (r + l) >>> 1
  if (arr[mid] == target) { // 相等
    return mid
  }
  if (arr[mid] < target) { // 右边
    return search(arr, target, mid + 1, r) // 右限[mid+1,r]
  }
  if (arr[mid] > target) { // 左边
    return search(arr, target, l, mid - 1) // 左限[l,mid-1]
  }
}
console.log(search(array, 6))

// 简化版
function search(arr, target, l = 0, r = arr.length - 1) {
  if (l >= r) return target === arr[r] ? r : -1
  let mid = l + ((r - l) >> 1)
  if (arr[mid] === target) return mid
  return arr[mid] < target
    ? search(arr, target, mid + 1, r)
    : search(arr, target, l, mid - 1)
}
console.log(search(arr,6))
----------------------------------------------
// 非递归二分法
function search(arr, target, l = 0, r = arr.length - 1) {
  let mid
  // 超限跳出
  while (l <= r) {
    mid = (r + l) >>> 1
    // 找到
    if (arr[mid] == target) {
      return mid
    }
    // 在右边
    if (arr[mid] < target) {
      // 改左限
      l = mid + 1 // [mid+1,r]
    }
    // 在左边
    if (arr[mid] > target) {
      // 改右限
      r = mid - 1 // [l,mid-1]
    }
  }
  // 未找到
  return -1
}
console.log(search(array, 6)) 

// 简化版
function search(arr, target, l = 0, r = arr.length - 1) {
  while (l <= r) {
    const mid = l + ((r - l) >> 1)
    if (arr[mid] === target) return mid
    if (arr[mid] < target) {
      l = mid + 1 // 更新左界限
    } else {
      r = mid - 1 // 更新界限
    }
  }
  return -1
}
```

## 二分法查找重复值的索引

- 根据找到的位置，进行前后试探查找，直到不等于目标值

代码实现

```js js 二分法查找重复值的索引
function search(arr, target, l = 0, r = arr.length - 1) {
  let mid, res = []
  // 超限跳出
  while (l <= r) {
    mid = (r + l) >>> 1
    // 找到
    if (arr[mid] == target) {
      l = mid // 记录目标关键位置
      break
    }
    // 在右边
    if (arr[mid] < target) {
      // 改左限
      l = mid + 1 // [mid+1,r]
    }
    // 在左边
    if (arr[mid] > target) {
      // 改右限
      r = mid - 1 // [l,mid-1]
    }
  }
  while (arr[--l] == target && l >= 0); // 左界
  while (arr[++l] == target && l < arr.length) { // 右界
    res.push(l)
  }
  return res.length ? res : -1
}
console.log(search(array, 7)) // [3,4,5,6,7]
--------------------------------------------------------
const arr = [1, 3, 4, 6, 7, 7, 7, 7, 8, 9, 10]
           //0  1  2  3  4  5  6  7
function search(arr, target, l = 0, r = arr.length - 1) {
  let mid, base, res = []
  while (l <= r) {
    mid = l + ((r - l) >> 1)
    if (arr[mid] === target) break
    if (arr[mid] < target) l = mid + 1
    else r = mid - 1
  }
  if (l > r) return -1
  res.push((base = mid))
  while (arr[mid - 1] === target) res.unshift(--mid)
  mid = base
  while (arr[mid + 1] === target) res.push(++mid)
  return res
}
console.log(search(arr, 7))
```

## 二分法求一个数的平方根，精确小数点后6位

- 给定一个数，求其平方根，最终计算出的数字精确小数点后6位，使用二分逐步逼近，直到差值小于容忍误差

```js
// 为了防止栈溢出，使用迭代循环
function sqrt(num, acc = 6) {
  const min_value = 10 ** -acc
  let target = num / 2
  while (Math.abs(target * target - num) > min_value) {
    // 设定值的平方与目标值比较，再做二分
    if (target * target > num) target -= target / 2
    else target += target / 2
  }
  return target
}
console.log(sqrt(5))
```

除2比较

## 查找第一个值等于给定值的元素

- 在含有重复值的有序数组中查找
- 找到目标值后，往前继续查找，直到不等于目标值

```js
const arr = [1, 3, 4, 6, 7, 7, 7, 7, 8, 9, 10]
           //0  1  2  3  4  5  6  7
function searchStart(arr, target, l = 0, r = arr.length - 1) {
  if (l >= r) return arr[r] === target ? r : -1
  let mid = l + ((r - l) >> 1)
  if (arr[mid] === target) {
    while (arr[--mid] === target);
    return mid + 1
  }
  return arr[mid] < target
    ? searchStart(arr, target, mid + 1, r)
    : searchStart(arr, target, l, mid - 1)
}
console.log(searchStart(arr, 7))
```

## 查找最后一个值等于给定值的元素索引

- 在含有重复值的有序数组中查找
- 找到目标值后，往后继续查找，直到不等于目标值

```js
const arr = [1, 3, 4, 6, 7, 7, 7, 7, 8, 9, 10]
           //0  1  2  3  4  5  6  7
function searchEnd(arr, target, l = 0, r = arr.length - 1) {
  if (l >= r) return arr[r] === target ? r : -1
  let mid = l + ((r - l) >> 1)
  if (arr[mid] === target) {
    // 重点
    while (arr[++mid] === target);
    return mid - 1
  }
  return arr[mid] < target
    ? searchEnd(arr, target, mid + 1, r)
    : searchEnd(arr, target, l, mid - 1)
}
console.log(searchEnd(arr, 7))
```

## 查找最近一个大于等于给定值的元素

- 在含有重复值的有序数组中查找
- 如果相等则返回第一个重复值的索引，不相等则返回大于目标值最近的索引

```js
const arr = [1, 3, 4, 6, 7, 7, 7, 7, 9, 10]
           //0  1  2  3  4  5  6  7
function searchFast(arr, target, l = 0, r = arr.length - 1) {
  if (arr[arr.length - 1] < target) return -1
  if (l > r) {
    // 找到直接返回，未找到返回最接近且大于的值
    if (arr[r] > target) return r
    if (arr[r] < target) return r + 1
    return -1
  }
  let mid = l + ((r - l) >> 1)
  if (arr[mid] === target) {
    // 重点
    while (arr[--mid] === target);
    return mid + 1
  }
  return arr[mid] < target
    ? searchFast(arr, target, mid + 1, r)
    : searchFast(arr, target, l, mid - 1)
}
console.log(searchFast(arr, 7))
```

## 查找最远一个大于等于给定值的元素

- 在含有重复值的有序数组中查找
- 如果相等则返回最后一个重复值的索引，不相等则返回大于目标值最近的索引

```js
const arr = [1, 3, 4, 6, 7, 7, 7, 7, 9, 10]
           //0  1  2  3  4  5  6  7
function searchLast(arr, target, l = 0, r = arr.length - 1) {
  if (arr[arr.length - 1] < target) return -1
  if (l > r) {
    // 找到直接返回，未找到返回最接近且大于的值
    if (arr[r] > target) return r
    // 数组最后一个没有大于它的值
    if (arr[r] < target) return r + 1
    return 0
  }
  let mid = l + ((r - l) >> 1)
  if (arr[mid] === target) {
    // 重点
    while (arr[++mid] === target);
    return mid - 1
  }
  return arr[mid] < target
    ? searchLast(arr, target, mid + 1, r)
    : searchLast(arr, target, l, mid - 1)
}
console.log(searchLast(arr, 0))
```

## 查找最远一个小于等于给定值的元素

- 在含有重复值的有序数组中查找
- 如果相等则返回最后一个重复值的索引，不相等则返回小于目标值最近的索引

```js
const arr = [1, 3, 4, 6, 7, 7, 7, 7, 9, 10]
            //0  1  2  3  4  5  6  7
function searchFast(arr, target, l = 0, r = arr.length - 1) {
  if (arr[0] > target) return -1
  if (l > r) {
    // 找到直接返回，未找到返回最接近且小于的值
    if (arr[r] < target) {
      while (arr[--r] === arr[r + 1]);
      return r + 1
    } else {
      while (arr[--r] === arr[r - 1]);
      return r
    }
  }
  let mid = l + ((r - l) >> 1)
  if (arr[mid] === target) {
    // 重点
    while (arr[--mid] === target);
    return mid + 1
  }
  return arr[mid] < target
    ? searchFast(arr, target, mid + 1, r)
    : searchFast(arr, target, l, mid - 1)
}
console.log(searchFast(arr, 8))
```

## 查找最近一个小于等于给定值的元素

- 在含有重复值的有序数组中查找
- 如果相等则返回第一个，如果没有找到，则返回小于目标值最近的索引

```js
const arr = [1, 3, 4, 6, 7, 7, 7, 7, 9, 10]
           //0  1  2  3  4  5  6  7
function searchLast(arr, target, l = 0, r = arr.length - 1) {
  if (l >= r) {
    // 找到直接返回，未找到返回最接近且小于的值
    if (arr[r] === target || arr[r] < target) return r
    // 数组最后一个没有大于它的值
    if (arr[r] > target) return r - 1
    return -1
  }
  let mid = l + ((r - l) >> 1)
  if (arr[mid] === target) {
    // 重点
    while (arr[++mid] === target);
    return mid - 1
  }
  return arr[mid] < target
    ? searchLast(arr, target, mid + 1, r)
    : searchLast(arr, target, l, mid - 1)
}
console.log(searchLast(arr, 8))
```

<Vssue title="算法 issue" />