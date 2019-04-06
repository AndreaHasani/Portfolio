## Introduction
In this tutorial, we are going to go through about how to setup Nginx reverse proxy with python flask and uwsgi.
Nginx (pronounced engine-x) is a free, open-source, high-performance HTTP server and reverse proxy, as well as an IMAP/POP3 proxy server. 
It's known for its high performance, stability, rich feature set, simple configuration, and low resource consumption.
The benefit this setup brings is being able to deploy multiple flask applications in one container or have them have separated containers.


## Prerequisites

To follow this tutorial, you will need the following:

* docker
* docker-compose
* nginx
* python
* flask
* uwsgi
* linux


## Step 1 --

First we will write a dockerfile to build our containers. We will use alpine given its low size and add python.

```docker
# dockerfile

FROM alpine

COPY requirements.txt /usr/src/


RUN apk add --virtual build-deps \
	build-deps python3-dev build-base linux-headers 

RUN apk add --no-cache \
    python3 \
    pcre-dev \
    bash && \
    python3 -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip3 install --upgrade pip setuptools && \
    pip3 install -r /usr/src/requirements.txt && \
    rm -r /root/.cache

RUN apk del build-deps

```

## Step 2 --

Now we will need to create an config.ini to configure uwsgi for our sites. Place this file in the root folder where our flask application resides. 
In this example we use run.py to call our application.

```ini
; config.ini
; Nginx will use socket proxy to forward 
; connections to this configuration/application.
; For new flask applications we will need to use a 
; different connection port for example 3032 etc.

[uwsgi]
socket = :3031
chdir = %d
wsgi-file = run.py
callable = app
py-autoreload = 1
disable-logging=1
```

```python
# run.py
# An example of run.py for our flask application.


from flask import Flask

app = Flask(__name__)


@app.route("/")
def hello():
    return "Hello site Flask inside Docker!!"


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
```

## Step 3 --

The next step we need to do is configuring nginx as a reverse proxy for our flask applications. Below we have a standart nginx configuration. 
In this configuration I have two flask applications running. One using port 3031 and the other using port 3032. 
It is important to not use the same name for uwsgi_pass otherwise the nginx will not work properly. 
We set up uwsgi & uwsgi1 names in our next step via docker-compose.yml

```nginx
user  nginx;
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

    # location ^~ /.well-known {
	# allow all;
	# root  /data/letsencrypt/;
    # }


    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    proxy_redirect     off;
    proxy_set_header   Host $host;
    proxy_set_header   X-Real-IP $remote_addr;
    proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Host $server_name;


    server{
	# listen              443 ssl;
	listen              80;
	server_name example1.com;

	# index index.html index.htm;
	# root   /usr/share/nginx/html;

	location /{
	    include uwsgi_params;
	    uwsgi_pass uwsgi:3031;
	}

    }

    server{
	# listen              443 ssl;
	listen              80;
	server_name example1.com;

	# index index.html index.htm;
	# root   /usr/share/nginx/html;

	location /{
	    include uwsgi_params;
	    uwsgi_pass uwsgi1:3032;

	}

    }

#include /etc/nginx/conf.d/*.conf;
}
```
## Step 4 --

Lastly we need to create a docker-compose.yml file so we can start our containers.
In this configuration we are exposing port 3031 and 3032 so we can pass traffic to our applications from nginx.

```docker
version: '3'
services:
    flaskapp1:
        restart: always
        build: ./flask_uwsgi/
        image: flask-app
        volumes:
            - ./sitefolder1:/usr/src/site
        expose:
            - "3031"

        command: uwsgi --ini /usr/src/site/config.ini

        networks:
            - websiteNetwork

    flaskapp2:
        restart: always
        image: flask-app
        volumes:
            - ./sitefolder2:/usr/src/site
        expose:
            - "3032"

        depends_on:
            - flaskapp1

        command: uwsgi --ini /usr/src/site/config.ini

        networks:
            - websiteNetwork

    nginx:
        restart: always
        image: nginx:stable-alpine
        links:
            - flaskapp1:uwsgi
            - flaskapp2:uwsgi1

        ports:
          - 80:80
          - 443:443

        networks:
            - websiteNetwork

networks:
    websiteNetwork:
        driver: "bridge"
```


## Step 5 --

Now we just need to run everything.
First we open a terminal on our project root folder.
After that we need to run the following commands.

```bash
docker-compose up
```
If everything goes well you will see an output like the one below.

```
Starting website-multi-container_flaskapp1_1 ... done
Starting website-multi-container_flaskapp2_1 ... done
Starting website-multi-container_nginx_1     ... done
Attaching to website-multi-container_flaskapp1_1, website-multi-container_flaskapp2_1, website-multi-container_nginx_1
nginx_1      | 2019/03/30 19:58:10 [warn] 1#1: conflicting server name "example1.com" on 0.0.0.0:80, ignored
nginx_1      | nginx: [warn] conflicting server name "example1.com" on 0.0.0.0:80, ignored
flaskapp2_1  | [uWSGI] getting INI configuration from /usr/src/site/config.ini
flaskapp2_1  | *** Starting uWSGI 2.0.17.1 (64bit) on [Sat Mar 30 19:58:09 2019] ***
flaskapp2_1  | compiled with version: 6.4.0 on 03 November 2018 13:17:14
flaskapp2_1  | os: Linux-5.0.3-arch1-1-ARCH #1 SMP PREEMPT Tue Mar 19 13:09:13 UTC 2019
flaskapp2_1  | nodename: 944fd1aeacbd
flaskapp2_1  | machine: x86_64
flaskapp2_1  | clock source: unix
flaskapp2_1  | pcre jit disabled
flaskapp2_1  | detected number of CPU cores: 6
flaskapp2_1  | current working directory: /
flaskapp2_1  | detected binary path: /usr/bin/uwsgi
flaskapp2_1  | uWSGI running as root, you can use --uid/--gid/--chroot options
flaskapp2_1  | *** WARNING: you are running uWSGI as root !!! (use the --uid flag) *** 
flaskapp2_1  | chdir() to /usr/src/site/
flaskapp2_1  | your memory page size is 4096 bytes
flaskapp2_1  | detected max file descriptor number: 1048576
flaskapp2_1  | lock engine: pthread robust mutexes
flaskapp1_1  | [uWSGI] getting INI configuration from /usr/src/site/config.ini
flaskapp1_1  | *** Starting uWSGI 2.0.17.1 (64bit) on [Sat Mar 30 19:58:09 2019] ***
flaskapp1_1  | compiled with version: 6.4.0 on 03 November 2018 13:17:14
flaskapp1_1  | os: Linux-5.0.3-arch1-1-ARCH #1 SMP PREEMPT Tue Mar 19 13:09:13 UTC 2019
flaskapp1_1  | nodename: 03a162e29637
flaskapp1_1  | machine: x86_64
flaskapp1_1  | clock source: unix
flaskapp1_1  | pcre jit disabled
flaskapp1_1  | detected number of CPU cores: 6
flaskapp1_1  | current working directory: /
flaskapp1_1  | detected binary path: /usr/bin/uwsgi
flaskapp1_1  | uWSGI running as root, you can use --uid/--gid/--chroot options
flaskapp1_1  | *** WARNING: you are running uWSGI as root !!! (use the --uid flag) *** 
flaskapp1_1  | chdir() to /usr/src/site/
flaskapp1_1  | your memory page size is 4096 bytes
flaskapp1_1  | detected max file descriptor number: 1048576
flaskapp1_1  | lock engine: pthread robust mutexes
flaskapp1_1  | thunder lock: disabled (you can enable it with --thunder-lock)
flaskapp2_1  | thunder lock: disabled (you can enable it with --thunder-lock)
flaskapp1_1  | uwsgi socket 0 bound to TCP address :3031 fd 3
flaskapp1_1  | uWSGI running as root, you can use --uid/--gid/--chroot options
flaskapp1_1  | *** WARNING: you are running uWSGI as root !!! (use the --uid flag) *** 
flaskapp2_1  | uwsgi socket 0 bound to TCP address :3032 fd 3
flaskapp2_1  | uWSGI running as root, you can use --uid/--gid/--chroot options
flaskapp2_1  | *** WARNING: you are running uWSGI as root !!! (use the --uid flag) *** 
flaskapp1_1  | Python version: 3.6.6 (default, Aug 24 2018, 05:04:18)  [GCC 6.4.0]
flaskapp1_1  | Python main interpreter initialized at 0x5621c7391020
flaskapp1_1  | uWSGI running as root, you can use --uid/--gid/--chroot options
flaskapp1_1  | *** WARNING: you are running uWSGI as root !!! (use the --uid flag) *** 
flaskapp1_1  | python threads support enabled
flaskapp1_1  | your server socket listen backlog is limited to 100 connections
flaskapp1_1  | your mercy for graceful operations on workers is 60 seconds
flaskapp1_1  | mapped 145840 bytes (142 KB) for 1 cores
flaskapp1_1  | *** Operational MODE: single process ***
flaskapp2_1  | Python version: 3.6.6 (default, Aug 24 2018, 05:04:18)  [GCC 6.4.0]
flaskapp2_1  | Python main interpreter initialized at 0x5583e9d2a020
flaskapp2_1  | uWSGI running as root, you can use --uid/--gid/--chroot options
flaskapp2_1  | *** WARNING: you are running uWSGI as root !!! (use the --uid flag) *** 
flaskapp2_1  | python threads support enabled
flaskapp2_1  | your server socket listen backlog is limited to 100 connections
flaskapp2_1  | your mercy for graceful operations on workers is 60 seconds
flaskapp2_1  | mapped 145840 bytes (142 KB) for 1 cores
flaskapp2_1  | *** Operational MODE: single process ***
flaskapp2_1  | WSGI app 0 (mountpoint='') ready in 0 seconds on interpreter 0x5583e9d2a020 pid: 1 (default app)
flaskapp2_1  | uWSGI running as root, you can use --uid/--gid/--chroot options
flaskapp2_1  | *** WARNING: you are running uWSGI as root !!! (use the --uid flag) *** 
flaskapp2_1  | *** uWSGI is running in multiple interpreter mode ***
flaskapp2_1  | spawned uWSGI master process (pid: 1)
flaskapp2_1  | spawned uWSGI worker 1 (pid: 6, cores: 1)
flaskapp2_1  | Python auto-reloader enabled
flaskapp1_1  | WSGI app 0 (mountpoint='') ready in 0 seconds on interpreter 0x5621c7391020 pid: 1 (default app)
flaskapp1_1  | uWSGI running as root, you can use --uid/--gid/--chroot options
flaskapp1_1  | *** WARNING: you are running uWSGI as root !!! (use the --uid flag) *** 
flaskapp1_1  | *** uWSGI is running in multiple interpreter mode ***
flaskapp1_1  | spawned uWSGI master process (pid: 1)
flaskapp1_1  | spawned uWSGI worker 1 (pid: 6, cores: 1)
flaskapp1_1  | Python auto-reloader enabled
```

To check if nginx works properly we can run the following on the terminal.

```bash
curl -H 'Host: example1.com' 127.0.0.1 

# Output
Hello site 1 Flask inside Docker!
```

```bash
curl -H 'Host: example2.com' 127.0.0.1 

# Output
Hello site 2 Flask inside Docker!
```
