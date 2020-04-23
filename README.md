基于Ant Design Pro 开发 ，项目名：VueOA
Overview
基于 Ant Design of Vue 开发的OA综合管理系统

Vue 开发的OA系统

具有工作流动态审批、加签、会签等工作流功能，可以对工作流程的审批业务进行评论/讨论
具有文档预览、图片预览等功能
具有博客编写、预览、查看、搜索等功能
具有社区、问答等功能
具有OA系统常用功能
具有在线网盘等功能
工作流引擎完全手写且开源，可以类似钉钉/飞书那样，动态选择审批人员。
开发教程
Wiki文档：https://gitee.com/yunwisdoms/oa-front-service/wikis/OA%20System%20介绍

源码地址
github: https://github.com/Miazzy/oa-front-service

gitee: https://gitee.com/yunwisdoms/oa-front-service

注意：由于码云仓库最大只支持5G空间，现在容量不足，已经无法提交，故最新代码提交至github仓库，目前由于开发文档、部署文档尚未编写，在后续将抽空编写

后端项目
gitee: https://gitee.com/yunwisdoms/oa-back-service
依赖项目
https://gitee.com/yunwisdoms/xmysql (数据库API接口Rest服务)
https://gitee.com/kekingcn/file-online-preview.git (文档预览服务)
https://gitee.com/yunwisdoms/imgproxy.git (图片压缩、在线裁剪、在线处理服务)
https://gitee.com/jeecg/jeecg-boot.git (SpringBoot后端服务,本项目的后端是jeecg-boot改造的，用原始的jeecg-boot也是支持)
https://gitee.com/sendya/ant-design-pro-vue.git (本项目前端项目由这个开源项目改造而来)
https://gitee.com/vilson/vue-projectManage.git (本项目的项目管理系统，就是把这个集成过来，尚未完成)
https://gitee.com/miazzy/mili (米粒网开源社区的项目，集成到本项目，提供社区论坛，第三方博客功能)
https://gitee.com/june000/lemon-im (聊天项目，后续集成)
预览地址
http://www.yunwisdom.club zhaoziyu/zhaoziyu@123 admin/admin@123 zhaoziyun/zhaoziyun@123
部署文件
部署本地mysql数据库 （支持mysql5.7/mysql8.0 , 数据库SQL传送门：https://gitee.com/yunwisdoms/jeecg-database-sync , 下载最新的一个sql.gz，然后用vim打开即可）
部署本地redis缓存服务器 （redis-4/redis-5）
部署xmysql (xmysql要配置本地的mysql数据库，xmysql项目有配置教程，传送门：https://gitee.com/yunwisdoms/xmysql)
 ## 使用PM2启动xmysql服务
 pm2 start xmysql -h yourmysqlurl.mysql.rds.aliyuncs.com -u username -p password -d jeecg --watch -i 1
https://www.shengtai.club/apache-tomcat.tar （下载解压缩，修改里面的application-dev.yml里面数据库连接地址,Redis连接地址）
git clone https://gitee.com/yunwisdoms/oa-front-service . (克隆本项目，yarn install后，yarn run serve 运行测试环境，测试环境请修改index.html中的后端服务器、rest服务器连接地址，其他文档预览，图片裁剪的暂时不管)
前端部署打包，在前端项目中运行 yarn run build , 然后将打包后的目录放入Nginx的html文件夹中，配置nginx服务器
部署Nginx ，请先确保安装docker， docker run --name docker-nginx -p 80:80 -p 8080:80 -p 443:443 -p 8443:443 nginx (未安装docker不影响哈，自行在linux上部署nginx即可 ，然后把 打包后的前端目录放入Nginx对应的目录中，修改Nginx配置，在下文中列出了一个线上版本的Nginx配置文件)
前端技术
基础框架：ant-design-vue - Ant Design Of Vue 实现
JavaScript 框架：Vue
Webpack
node
yarn
eslint
@vue/cli 3.2.1
vue-cropper - 头像裁剪组件
@antv/g2 - Alipay AntV 数据可视化图表
Viser-vue - antv/g2 封装实现
项目下载和运行
拉取项目代码
git clone https://gitee.com/yunwisdoms/oa-front-service.git .
安装依赖
yarn install
开发模式运行
yarn run serve
编译项目
yarn run build
Lints and fixes files
yarn run lint
其他说明
项目使用的 vue-cli3, 请更新您的 cli

关闭 Eslint (不推荐) 移除 package.json 中 eslintConfig 整个节点代码

修改 Ant Design 配色，在文件 vue.config.js 中，其他 less 变量覆盖参考 ant design

官方说明

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */

          'primary-color': '#F5222D',
          'link-color': '#F5222D',
          'border-radius-base': '4px',
        },
        javascriptEnabled: true,
      }
    }
  }
项目截图
首页，含有我的待办，我的已办，行政公告，红头文件，新闻资讯，市场观察等内容，提交审批后，待处理人会收到我的待办消息，点击进入我的审批详情进行审批操作

输入图片说明

输入图片说明

输入图片说明

输入图片说明

输入图片说明

输入图片说明

输入图片说明

输入图片说明

输入图片说明

输入图片说明

整合问卷调查

整合问卷调查

整合问卷调查

附属文档
Ant Design Vue

报表 viser-vue

Vue

路由/菜单说明

ANTD 默认配置项

其他待补充...

备注
@vue/cli 升级后，eslint 规则更新了。由于影响到全部 .vue 文件，需要逐个验证。既暂时关闭部分原本不验证的规则，后期维护时，在逐步修正这些 rules

前端项目 Nginx配置文件示例
load_module modules/ngx_http_image_filter_module.so;

user  root;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;
    client_max_body_size 200m;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    gzip  on;
    include /etc/nginx/conf.d/*.conf;

    proxy_cache_path ./web_cache levels=1:2 keys_zone=web_cache:1024m inactive=1m max_size=1g;
   
    upstream cwbase {
	server 172.18.231.224:3000 weight=10 max_fails=3 fail_timeout=30s;
    }

    upstream xmysql {
        server 172.18.231.224:3000 weight=10 max_fails=3 fail_timeout=30s;
    }

    upstream fileview {
	#server 172.18.231.224:30000 weight=10 max_fails=3 fail_timeout=30;
        server 172.18.231.224:30001 weight=10 max_fails=3 fail_timeout=30;
        server 172.18.231.224:30002 weight=10 max_fails=3 fail_timeout=30;
    }

    upstream jeecg-api {
	#server 172.18.231.224:8080 weight=10 max_fails=3 fail_timeout=30;
	server 172.18.231.224:8082 weight=10 max_fails=3 fail_timeout=30;

	#server 172.18.201.235:10000 weight=10 max_fails=3 fail_timeout=30;
	#server 172.18.201.235:10002 weight=10 max_fails=3 fail_timeout=30;
    }

    server {
        listen 80;
        listen       443 ssl;
        server_name  www.shengtai.club;

	ssl_certificate /cert/www.shengtai.club.pem;
        ssl_certificate_key /cert/www.shengtai.club.key;
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;

        root /usr/share/nginx/html;

        gzip on;
        gzip_min_length 1k;
        gzip_comp_level 1;
        gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png application/vnd.ms-fontobject font/ttf font/opentype font/x-woff image/svg+xml;

        gzip_vary on;
        gzip_disable "MSIE [1-6]\.";
        gzip_buffers 32 4k;
        gzip_http_version 1.0;


        error_page 400 = /400.html;
        error_page 401 = /401.html;
        error_page 402 = /402.html;
        error_page 403 = /403.html;
        error_page 404 = /404.html;

        error_page 500 = /500.html;
        error_page 501 = /501.html;
        error_page 502 = /502.html;
        error_page 503 = /503.html;
        error_page 520 = /520.html;
        error_page 521 = /521.html;
        error_page 533 = /533.html;

        location ^~ /api {

            rewrite ^/(.*) /$1 break;

            add_header 'Access-Control-Allow-Credentials' 'true';
            add_header 'Access-Control-Allow-Methods' 'OPTION, POST, GET, DELETE, PUT';
            add_header 'Access-Control-Allow-Headers' 'X-Requested-With, Content-Type';

            proxy_redirect off;
            proxy_set_header Host $host;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

            proxy_pass http://cwbase/;

        }

        location ^~ /jeecg-boot {
            proxy_pass              http://jeecg-api/jeecg-boot/;

            proxy_set_header        X-Real-IP $remote_addr;
            proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;

            add_header 'Access-Control-Allow-Credentials' 'true';
            add_header 'Access-Control-Allow-Methods' 'OPTION, POST, GET, DELETE, PUT';
            add_header 'Access-Control-Allow-Headers' 'X-Requested-With, Content-Type';

            proxy_connect_timeout 1800s;
            proxy_send_timeout 1800s;
            proxy_read_timeout 1800s;

        }

        location ^~ /sys/ {

            add_header 'Access-Control-Allow-Credentials' 'true';
            add_header 'Access-Control-Allow-Methods' 'OPTION, POST, GET, DELETE, PUT';
            add_header 'Access-Control-Allow-Headers' 'X-Requested-With, Content-Type';

            proxy_redirect off;
            proxy_set_header Host $host;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

            proxy_pass http://jeecg-api/jeecg-boot/sys/;

        }

        location ^~ /generic/ {
 
            add_header 'Access-Control-Allow-Credentials' 'true';
            add_header 'Access-Control-Allow-Methods' 'OPTION, POST, GET, DELETE, PUT';
            add_header 'Access-Control-Allow-Headers' 'X-Requested-With, Content-Type';
 
            proxy_redirect off;
            proxy_set_header Host $host;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
 
            proxy_pass http://jeecg-api/jeecg-boot/generic/;
 
        }  

        location ^~ /jeecg-boot/sys/common/view {
            alias   /root/jeecg/upFiles/;
            index  index.html index.htm;
        }

        location ^~ /files {
            root   /root/jeecg/upFiles/;
            index  index.html index.htm;

	    add_header 'Access-Control-Allow-Credentials' 'true';
            add_header 'Access-Control-Allow-Methods' 'OPTION, POST, GET, DELETE, PUT';
            add_header 'Access-Control-Allow-Headers' 'X-Requested-With, Content-Type';

        }	

        location / {

            root   /usr/share/nginx/html;
            index  index.html index.htm;

            if (!-e $request_filename) {
                rewrite ^(.*)$ /index.html?s=$1 last;
                break;
            }

            #add_header Cache-Control "no-cache, no-store";
            add_header 'Access-Control-Allow-Credentials' 'true';
            add_header 'Access-Control-Allow-Methods' 'OPTION, POST, GET, DELETE, PUT';
            add_header 'Access-Control-Allow-Headers' 'X-Requested-With, Content-Type';

            proxy_cache web_cache;
            proxy_cache_valid 200 206 304 301 302 10d;
            proxy_cache_key  $scheme$host$request_uri;

	    proxy_connect_timeout  1800s;
	    proxy_send_timeout  1800s;
	    proxy_read_timeout  1800s;
 
	    gzip_static on;

            expires 30d;

        }

    }

    server {
        listen       80;
	listen 443  ssl;
        server_name  thumbor.shengtai.club;
        index index.html index.htm;

	ssl_certificate /cert/thumbor.shengtai.club.pem;
	ssl_certificate_key /cert/thumbor.shengtai.club.key;
	ssl_session_timeout 5m;
	ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
	ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
	ssl_prefer_server_ciphers on;

    	location / {
            add_header Cache-Control no-cache;
            proxy_pass http://120.76.65.212:1000;
            proxy_set_header   Host thumbor.shengtai.club;
            proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
            proxy_set_header   X-Real-IP        $remote_addr;
            proxy_connect_timeout 1800s;
	    proxy_send_timeout  1800s;
	    proxy_read_timeout  1800s;
    	}

    }

    server {

        listen       80;
        listen 443  ssl;
        server_name  fileview.shengtai.club;
        index index.html index.htm;

        ssl_certificate /cert/fileview.shengtai.club.pem;
        ssl_certificate_key /cert/fileview.shengtai.club.key;
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;

        location / {
            add_header Cache-Control no-cache;
            proxy_pass http://fileview/;
	    proxy_connect_timeout  1800s;
	    proxy_send_timeout  1800s;
	    proxy_read_timeout  1800s;
            proxy_set_header   Host fileview.shengtai.club;
            proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
            proxy_set_header   X-Real-IP        $remote_addr;
        }

    }


    server {

        listen 80;
	listen 443 ssl;
        server_name  api.shengtai.club;
 
	ssl_certificate /cert/api.shengtai.club.pem;
	ssl_certificate_key /cert/api.shengtai.club.key;
	ssl_session_timeout 5m;
	ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
	ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
	ssl_prefer_server_ciphers on;

        root /workspace/oa-front-system;
 
        gzip on;
        gzip_min_length 1k;
        gzip_comp_level 1;
        gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png application/vnd.ms-fontobject font/ttf font/opentype font/x-woff image/svg+xml;
 
        gzip_vary on;
        gzip_disable "MSIE [1-6]\.";
        gzip_buffers 32 4k;
        gzip_http_version 1.0;
 
        location ^~ /api {
            rewrite ^/(.*) /$1 break;
 
            add_header 'Access-Control-Allow-Credentials' 'true';
            add_header 'Access-Control-Allow-Methods' 'OPTION, POST, GET, DELETE, PUT';
            add_header 'Access-Control-Allow-Headers' 'X-Requested-With, Content-Type';
 
            proxy_redirect off;
            proxy_set_header Host $host;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
 
            proxy_pass http://cwbase/;
        }
 
    }

}