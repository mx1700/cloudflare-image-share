# Cloudflare Image Share
基于 Cloudflare Pages + telegra.ph/R2 实现的私有图片分享(图床)网站。

## 特性
- [X] telegra.ph 支持下的无限图片储存空间
- [X] 可选 Cloudflare R2 存储
- [X] 密码保护，开启后有密码才能上传
- [X] telegra.ph 链接签名保护
- [X] github 部署
- [ ] ctrl+v 上传图片
- [ ] 图片压缩
- [ ] 多文件上传

telegra.ph 是匿名发布，所以图片一旦发布无法删除，永远可以直接通过 telegra.ph 域名访问。

链接签名保护开启下，在 telegra.ph 直接上传的图片无法通过你的服务器代理访问，规避法律风险。

Cloudflare R2 免费空间 10GB，可以手动删除图片。


[//]: # (## 为什么开发这个项目)

## 如何部署
1. fork 项目，在 Cloudflare Pages 创建新项目，选择 GitHub 作为代码仓库。
2. 在“设置构建和部署”页选择“框架预设”为“Next.js”，点击“保存并部署”。
3. 等待部署完成，点击“继续处理项目”进入项目主页 
现在访问项目会报错“Node.JS Compatibility Error”，因为还没设置“兼容性标志”
4. 在 cloudflare pages 项目的 “设置” 页选择左侧菜单函数，
然后找到“兼容性标志”部分，点击“配置生产兼容性标志”，内容填写```nodejs_compat```
5. 重新部署，项目应该可以正常访问了。

## 配置
支持的环境变量
```dotenv
PASSWORD = "123456"             # 访问密码，不设则可以公开上传
SECRET_KEY = "my_secret_key"    # 图片签名密钥，打开图片签名保护时必填
STORAGE_PROVIDER = "telegraph"  # 图片存储方式，目前支持 telegraph 和 r2
TELEGRAPH_SIGN_ENABLED = "true" # 是否开启 telegra.ph 链接签名保护
```

当使用 Cloudflare R2 时，需要配置R2 存储桶绑定，
在 cloudflare pages 项目的 “设置” 页，
左侧菜单选择函数，然后在页面里找到 “R2 存储桶绑定”
填写 R2 存储桶名称```R2_BUCKET```和对应的存储桶，
然后点击 “保存”

## 技术栈
- Next.js 14
- Cloudflare Pages
- Cloudflare R2
- v0.dev

## 开发

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