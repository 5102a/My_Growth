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
console.log(search(array, 6)) // -1
// 
function search(val, arr, l = 0, r = arr.length - 1) {
  if (l === r) return val === arr[l] ? l : -1
  let mid = l + (r - l >> 1)
  if (arr[mid] < val) {
    return search(val, arr, mid + 1, r)
  } else if (arr[mid] > val) {
    return search(val, arr, l, mid - 1)
  }
  return mid
}
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
console.log(search(array, 6)) // -1
```

## 二分法查找重复值的索引

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
```

## 二分法求一个数的平方根，精确小数点后6位

- 给定一个数，求其平方根，最终计算出的数字精确小数点后6位

```js
// 为了防止栈溢出，使用迭代循环
function sqrt(data) {
  let result = data / 2
  let res = result * result
  while (1) {
    if (res - data > 0.000001) {
      result = result - result / 2
    } else if (res - data < -0.000001) {
      result = result + result / 2
    } else {
      break
    }
    res = result * result
  }
  return result
}
```

除2比较

## 查找第一个值等于给定值的元素

- 在含有重复值的有序数组中查找

```js
function search(data, arr) {
  let l = 0, r = arr.length - 1
  let mid = r >> 1
  while (l <= r) {
    if (arr[mid] < data) {
      l = mid + 1
      mid = l + (r - l >> 1)
    } else if (arr[mid] > data) {
      r = mid - 1
      mid = l + (r - l >> 1)
    } else {  // 重点
      if (mid === 0 || arr[mid - 1] !== data) return mid
      else mid -= 1
    }
  }
  return -1
}
```

## 查找最后一个值等于给定值的元素

- 在含有重复值的有序数组中查找

```js
function search(data, arr) {
  let l = 0, r = arr.length - 1
  let mid = r >> 1
  while (l <= r) {
    if (arr[mid] < data) {
      l = mid + 1
      mid = l + (r - l >> 1)
    } else if (arr[mid] > data) {
      r = mid - 1
      mid = l + (r - l >> 1)
    } else {  // 区别
      if (mid === arr.length - 1 || arr[mid + 1] !== data) return mid
      else mid += 1
    }
  }
  return -1
}
```

## 查找第一个大于等于给定值的元素

- 在含有重复值的有序数组中查找

```js
function search(data, arr) {
  let l = 0,
    r = arr.length - 1
  let mid = r >> 1
  while (l <= r) {
    if (arr[mid] >= data) { // 区别
      if (mid === 0 && arr[mid] >= data || arr[mid - 1] < data) return mid
      else r = mid - 1
    } else {
      l = mid + 1
    }
    mid = l + (r - l >> 1)
  }
  return -1
}
```

## 查找最后一个小于等于给定值的元素

- 在含有重复值的有序数组中查找

```js
function search(data, arr) {
  let l = 0,
    r = arr.length - 1
  let mid = r >> 1
  while (l <= r) {
    if (arr[mid] <= data) { // 区别
      if (mid === arr.length-1 && arr[mid] <= data || arr[mid + 1] > data) return mid
      else l = mid + 1
    } else {
      r = mid - 1
    }
    mid = l + (r - l >> 1)
  }
  return -1
}
```

<Vssue title="算法 issue" />