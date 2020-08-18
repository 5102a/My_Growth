# 字符串匹配算法

主串：原字符串，长度n
模式串：匹配的子串，长度m

## BF

- BF 算法中的 BF 是 Brute Force 的缩写，中文叫作暴力匹配算法，也叫朴素匹配算法,时间复杂度是 O(n*m)
- 我们在主串中，检查起始位置分别是 0、1、2…n-m 且长度为 m 的 n-m+1 个子串，看有没有跟模式串匹配的

![bf](./img/19.jpg)

## RK

- RK 算法的全称叫 Rabin-Karp 算法，是BF算法升级版，时间复杂度是 O(n)
- RK 算法的思路是这样的：我们通过哈希算法对主串中的 n-m+1 个子串分别求哈希值，然后逐个与模式串的哈希值比较大小，如果某个子串的哈希值与模式串相等，那就说明对应的子串和模式串匹配了

![rk](./img/20.jpg)

## BM

- BM（Boyer-Moore）算法，它的性能是著名的KMP 算法的 3 到 4 倍
- BM 算法包含两部分，分别是坏字符规则（bad character rule）和好后缀规则（good suffix shift）

## KMP

- KMP 算法是根据三位作者（D.E.Knuth，J.H.Morris 和 V.R.Pratt）的名字来命名的，算法的全称是 Knuth Morris Pratt 算法，简称为 KMP 算法
- KMP 算法跟 BM 算法的本质是一样的

## Sunday算法

```js
String.prototype.myIndexOf = function myIndexOf(str, fromIndex = 0) {
  if (str === '') return 0
  if (str === null || str === undefined) return -1
  var sIndex = 0, pos = fromIndex, flag = false
  for (var i = fromIndex; i < this.length; i++) {
    if (str[sIndex] !== this[i]) {
      flag = false
      sIndex = 0
      while (this[pos + str.length] !== str[sIndex] && sIndex < str.length) {
        sIndex++
      }
      var index = sIndex >= str.length ? -1 : sIndex
      pos += str.length + (index === -1 ? 1 : -index)
      sIndex = 0
      i = pos - 1
    } else {
      flag = true
      sIndex++
    }
    if (sIndex >= str.length && flag) return pos >= this.length ? -1 : pos
  }
  return -1
}
```