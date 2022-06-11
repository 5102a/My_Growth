

# nginx 基础

```sh
location /{
  alias lib/;# 别名,重定向路径
  autoindex on;# 开启静态目录索引
  set $limit_rate 1k;# 限速 
}

log_format main 'xxx' # main命名日志
access_log path main；# 日志记录位置
listen 127.0.0.1:8080;# 只允许本机8080地址

# 上游服务集合
upstream name{
  server 127.0.0.1:8080;# 上游服务器
}
server{
  location /{
    proxy_set_header Host $host;# 设置代理请求头（代理源head）
    proxy_pass http://name;# 代理到name上游
  }
}
```
https://nginx.org/en/docs/http/ngx_http_proxy_module.html

```sh
http {
  proxy_cache_path /tmp/cache levels=1:2 keys_zone=cachename:10m max_size=10g inactive=60m use_temp_path=off;
}
缓存
location /{
  proxy_cache cachename;
  proxy_cache_key $host$args;
  proxy_cache_valid 200 304 1d;缓存请求
}

```

goaccess 日志查看工具