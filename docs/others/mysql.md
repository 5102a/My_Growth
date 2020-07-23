# Mysql数据库基本操作

## 数据库操作

- 查看全部数据库
`show databases`;
- 匹配数据库 _单符号 %多符号
`show databases like 'parttern_%'`;
- 查看创建的数据库属性
`show create database mysql`;
- 创建数据库
`create database 数据库名`;
- 关键字用反引号``包裹
```js  `number` ```
- 创建时设置数据库的默认编码格式不支持-，原数据不会改变编码
`create database my_project charset utf8`;
- 修改数据库字符集，对已有数据无效
`alter database my_project charset utf8`;
- 删除数据库，不能一次性删除多个数据库
`drop database 数据库名`

## 数据表操作

- 创建数据表，需先指定数据库

```js 创建数据表
create table my_table(
字段名 字段类型[字段属性],
字段名 字段类型[字段属性],
字段名 字段类型[字段属性]
)[表选项];
create table mmy_project(
name varchar(10),
age int
)engine[=]InnoDB;

create table my_project.my_table(...);
```

- 进入数据库
`use 数据库名`;
- 表选项：`存储引擎 engine[=]InnoDB`;

```js 设置默认字符集
create table mmy_project(
name varchar(10),
age int
)default charset=utf8;--设置默认字符集
```

- 查看全部数据表（进入数据库）
`show tables`;
- 模式匹配
`show tables like 'my_table'`;
- 查看表结构
`desc/describe/[show columns from] 表名`;
`desc my_table`;
`show columns from my_table`;
- 查看创建表属性\G 纵向查看
`show create table my_table`;
- 更改数据表名
`rename table 旧表名 to 新表名`;
- 字段 charset 也可改但怕乱码
- 增加
`alter table my_table add [column 列] 字段名 字段类型[属性]`
`alter table my_table add column number varchar(10)`;
- 修改字段名
`alter table my_table change column number varchar(10)`;
- 修改类型
`alter table my_table modify number int`;
- 删除数据字段
`alter table my_table drop school_number`;
- 修改字段位置
`alter table my_table add number int after age`;
`alter table my_table add number int first`;
- 数据表删除
`drop table 表名,表名2...`;
- 如果不存在会出现错误
`drop table if exists 表名`;
- 查看错误
`show warnings`;

## 数据操作

- 增加一条完整数据
`insert into 表名 values (字段1对应值,字段2对应值,..)`;
- 全部插入，全字段插入
`insert into my_table values('00001','20','lim')`;
- 指定插入
`insert into my_table(name,number) values('tim','20')`;
- 多条插入
`insert into my_table values('00001','20','lim'),
('00001','220','him')`;
- 开发中多用全字段插入
- 查询全部数据
`select * from 表名`;
- 查看指定字段数据
`select name,number from 表名`;
- 顺序查看desc降序，asc升序
`select name,number from 表名 order by name`;
- 条件查询
`select * from 表名 where age>20`;
- 更新数据,全部更新
`update 表名 set 字段名 = 新值`;
`update my_table set age =30,page=2`;
- 指定更新
`update my_table set age =30 where name='lili'`;
`update 表名 set 字段名 = 新值 where 表达式`;
- 删除全部数据
`delete from 表名 where 表达式`;
- 删除指定条件数据
`delete from 表名 where number='1'`;

- 显示支持字符集
`show character set`;
- 显示字符集变量
`show variables like 'character%'`;
- 改变编码
`set character_set_client=utf8`;
`set character_set _result=utf8`;
`set character_set _connection=utf8`;
- 全部设置
`set names utf8`;

<Vssue title="其他 issue" />