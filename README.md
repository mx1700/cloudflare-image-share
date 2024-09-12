# Cloudflare Image Share
基于 Cloudflare Pages + R2 实现的私有图片分享(图床)网站。

![image](https://t.mx1700.com/file/StRCFKTWynky.jpeg)

## 特性
- [X] ~~telegraph 支持下的无限图片储存空间~~
- [X] 支持 Cloudflare R2 存储
- [X] 密码保护，开启后有密码才能上传
- [X] ~~telegraph 链接签名保护~~
- [X] github 部署
- [X] ctrl+v 上传图片
- [X] 图片压缩
- [ ] 增加暗色模式
- [ ] 视频文件支持
- [ ] 多文件上传
- [ ] S3 后端支持

~~telegraph 是匿名发布，所以图片一旦发布无法删除，永远可以直接通过 telegraph 域名访问。~~

~~链接签名保护开启下，在 telegraph 直接上传的图片无法通过你的服务器代理访问，规避法律风险。~~

目前 telegraph 已经停止图片上传服务，请使用 Cloudflare R2 存储后端。

Cloudflare R2 免费空间 10GB，可以手动删除图片。


[//]: # (## 为什么开发这个项目)

## 如何部署
1. fork 项目，在 Cloudflare Pages 创建新项目，选择 GitHub 作为代码仓库。
2. 在“设置构建和部署”页选择“框架预设”为“Next.js”，点击“保存并部署”。
![image](https://t.mx1700.com/file/203qsPwjltsq.jpeg)
3. 等待部署完成，点击“继续处理项目”进入项目主页 
现在访问项目会报错“Node.JS Compatibility Error”，因为还没设置“兼容性标志”
4. 在 cloudflare pages 项目的 “设置” 页选择左侧菜单函数，
然后找到“兼容性标志”部分，点击“配置生产兼容性标志”，内容填写```nodejs_compat```
![image](https://t.mx1700.com/file/UBwpyo6p3Diu.jpeg)
5. 继续在设置的函数菜单里设置 R2 桶绑定（如果没有桶，请先创建一个），变量名称必须是 ```R2_BUCKET```，
![image](https://t.mx1700.com/file/ZzkSAEyXZv65.png)
6. 重新部署，项目应该可以正常访问了。
![image](https://t.mx1700.com/file/G9Hl66ma73MZ.jpeg)

## 配置
支持的环境变量

注意：修改完环境变量后需要重新部署
```toml
PASSWORD = "123456"                 # 访问密码，不设则可以公开上传
SECRET_KEY = "my_secret_key"        # 图片签名密钥，打开链接签名保护时必填
STORAGE_PROVIDER = "r2"             # 图片存储方式，目前支持 telegraph 和 r2
TELEGRAPH_SIGN_ENABLED = "true"     # 是否开启 telegraph 链接签名保护
MAX_IMAGE_SIZE = "20"               # 可上传的最大大小，单位 MB，默认 20 MB
ENABLE_IMAGE_COMPRESSION = "true"   # 是否开启图片压缩，默认开启
COMPRESSED_IMAGE_MAX_SIZE = "5"     # 压缩后的图片最大大小，单位 MB，默认 5 MB
MAX_IMAGE_WIDTH_OR_HEIGHT = "2560"  # 图片压缩后的最大宽度或高度，默认 2560
```

~~当图片存储使用 telegraph 时，上传的文件最大不能超过 5MB，所以建议打开压缩。~~
默认启用压缩，压缩后大小设置为 5 MB 时，建议宽高限制在 2560 像素。


![image](https://t.mx1700.com/file/EJBhKqdyJ4cs.jpeg)

当使用 Cloudflare R2 时，需要配置R2 存储桶绑定，
在 cloudflare pages 项目的 “设置” 页，
左侧菜单选择函数，然后在页面里找到 “R2 存储桶绑定”
填写 R2 存储桶名称```R2_BUCKET```和对应的存储桶，
然后点击 “保存”。

![image](https://t.mx1700.com/file/Oct63XBFQph5.jpeg)

## 技术栈
- Next.js
- Cloudflare Pages
- Cloudflare R2
- v0.dev

## 开发

复制 wrangler.toml.dev 文件为 wrangler.toml。

启动开发环境:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

访问 [http://localhost:3000](http://localhost:3000) 

## Next.js 部署到 Cloudflare 的兼容性问题

- Cloudflare 所有动态页面和 api 都必须使用 edge 环境
- next.js 的 server actions 为必须导出 async 函数

Cloudflare 运行在 edge 环境，必须在文件内增加 export const runtime = 'edge'，
而 next.js 编译器认为导出了一个同步函数（我认为这是 next.js bug），会导致部署失败，暂时无解，许等待 next.js 解决。

所以目前无法使用 server actions，只能使用 api 来做后端。

## TODO
- [ ] 尝试增加状态管理库 zustand