# webpack-static-project
纯静态前端webpack5打包脚手架,只适合多页面纯html开发，不使用VUE或REACT框架。本脚手架已经简单支持使用ES6，less，模块化，热加载，eslint等功能。


## Build Setup

``` bash
# 安装依赖
npm install

# 开发的时候在本地启localhost:9001，并开始热加载
npm run dev

# production的发布时打包
npm run build

```


## 目录结构

```

└─src                                      // src 文件夹
│    ├─views                               // 页面文件夹
│    │  ├─about
│    │  │      about.html
│    │  │      about.js
│    │  │      about.less
│    │  │
│    │  ├─contact
│    │  │      contact.css
│    │  │      contact.html
│    │  │      contact.js
│    │  │
│    │  └─home
│    │          index.html
│    │          index.js
│    │          index.less
│    │
│    └─tools                          // 工具文件夹
│            utils.js
│
│  .babelrc                         // babel的配置文件
│  .eslintignore
│  .eslintrc.js                     // eslint的配置文件
│  .gitignore
│  package.json
│  page.config.js                   // 页面的配置文件
│  README.md
│  webpack.config.dev.js            // 开发环境的webpack配置文件
└─ webpack.config.prod.js           // 生成环境的webpack配置文件


```

## 开发流程

如果增加新页面，只需两步，不需要改webpack等配置文件

1. 在views中新增一个文件夹
2. 在page.config.js中添加这个页面的信息即可

比如
```
  {
    name: 'contact',
    html: 'contact/contact.html',
    jsEntry: 'contact/contact.js'
  }

```
