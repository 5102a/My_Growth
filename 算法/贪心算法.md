# 算法

## 贪心算法

- 贪心算法（又称贪婪算法）是指，在对问题求解时，总是做出在当前看来是最好的选择
- 不从整体最优上加以考虑，他所做出的是在某种意义上的局部最优解
- 贪心关注的是当前问题的最优解，而不是全局最优解。动态规划关注的是全局最优解

基本要素

- 贪心选择是采用从顶向下、以迭代的方法做出相继选择，每做一次贪心选择就将所求问题简化为一个规模更小的子问题
- 要确定它是否具有贪心选择的性质，我们必须证明每一步所作的贪心选择最终能得到问题的最优解
- 当一个问题的最优解包含其子问题的最优解时，称此问题具有最优子结构性质

步骤

- 遍历备选元素
- 贪心策略确定选择元素

支付找零问题

- 给定纸币面值数组`[1,2,5,10,20,50,100]`，每张纸币不限次数使用
- 当要支付x元时，求最少使用的纸币数，并列出使用的纸币面值及其张数
- 不能多付，少付

分析

![贪心算法分析1](img/贪心算法分析1.png)

代码实现

```支付找零
// 纸币面值
const coins = [1, 2, 5, 10, 20, 50, 100]
// 支付找零
function pay(money, coins, p = coins.length - 1, obj = {count:0}) {
  if (money === 0) return obj
  let min, residue = 0
  // 计算当前最少使用纸币数
  for (let i = p; i >= 0; i--) {
    // 计算当前面值张数
    const much = ~~(money / coins[i])
    if (much < 0) continue // 不能多付
    min = min || much
    if (min >= much) {
      // 更新最少张数
      min = much
      // 更新纸币使用面值区间
      p = i
      // 剩余支付
      residue = money % coins[i]
    }
  }
  // 记录使用的纸币
  obj[coins[p]] = min
  obj['count'] += min
  return pay(residue, coins, p, obj)
}
console.log(pay(123, coins)) // {1: 1, 2: 1, 20: 1, 100: 1, count: 4}
```

限制有限张纸币，求支付情况

```条件找零
// 纸币面值以及张数
const coins = [
  [1, 5],
  [2, 2],
  [5, 8],
  [10, 4],
  [20, 5],
  [50, 3],
  [100, 2]
]
// 支付找零
function pay(money, coins, p = coins.length - 1, obj = {
  count: 0
}) {
  if (money === 0) return obj
  let much, residue = 0
  // 计算当前最少使用纸币数
  for (let i = p; i >= 0; i--) {
    // 计算当前面值张数
    much = ~~(money / coins[i][0])
    if (coins[i][1] <= 0) {
      p = i - 1;
      continue // 当前没有面值的纸币
    }
    if (much >= coins[i][1]) { // 当前面值的纸币张数不够
      // 钱不够
      if (coins[i][0] == coins[0][0]) return '钱不够'
      obj[coins[i][0]] = coins[i][1] //记录
      obj['count'] += coins[i][1]
      // 当前不够，看看有没有其他小零钱凑一下
      money -= coins[i][0] * coins[i][1] // 扣掉所有当前面值
      continue
    }
    // 够
    // 更新纸币使用面值区间
    p = i
    // 剩余支付
    money = money % coins[i][0]
    obj[coins[i][0]] = much //记录
    obj['count'] += much
  }
  return obj
}
console.log(pay(328, coins)) // {1: 1, 2: 1, 5: 1, 10: 0, 20: 1, 50: 2, 100: 2, count: 8}
console.log(pay(600, coins)) // 钱不够
```