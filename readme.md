# CS-AI Agent Landing Page

专为Shopify商家设计的智能客服AI助手的产品介绍页面。

## 功能特性

- 响应式设计，支持桌面和移动端
- 现代化UI设计
- 产品功能介绍
- 使用步骤说明
- 联系方式和支持信息

## 技术栈
- 纯HTML/CSS/JavaScript
- 响应式设计
- 部署在Vercel

### 3.1 页面结构
- `/`           主图演示,功能说明
- `/features`   功能对比表（vs Zendesk、Gorgias）
- `/pricing`    3 个 Plan（见下）
- `/case`       展示多个 Shopify 商家故事（姓名 + GMV + 节省 %），每次下拉追加3个新item
- `/about`      团队介绍 + 推特链接
- `/privacy`    GDPR/CCPA 合规条款

### 3.2 定价与席位购买
| Plan   | Price      | Seats | Limit         |
|--------|------------|-------|--------------|
| Free   | 14 天试用  | 1     | 50 封/月      |
| Pro    | $79/月     | 1     | 1000 封/月    |
| Team   | $199/月    | 不限     | 5000 封/月    |

- Paddle 支付 → 创建 `subscription_id`
- Webhook → Cloud Function 写入 Firestore
  - `users/{email}/subscription = {planId, expiry, seats}`
- 试用到期逻辑：Cloud Scheduler 每天 00:00 跑批，超期 → 降级计划
- 封禁逻辑：滥用 API 返回 429，前端提示升级

### 3.3 技术细节
- Paddle webhook 验证：`/webhook/paddle`
- 计费维度：以「Google 登录账号」为 1 个 seat，无需关心邮箱后缀
- 权限隔离：每个客服看到的邮件内容实时，但草稿/标签操作记录写入 userProperties，天然区分操作人
- 上线 checklist：在网站 FAQ 中说明「支持 Gmail 及 Google Workspace 自定义域名邮箱」
###  合规清单
- OAuth Scope 最小：`gmail.readonly`, `gmail.modify`
- 隐私政策：明确“我们**不存储**任何邮件内容”
- DPA：Paddle 自动签署

## Summary
 最小数据留存 + 最小 OAuth 范围，把“AI 客服实习生”塞进 Gmail 边栏，14 天免费试用，主攻北美 Shopify 小 B 


 ----------kimi---------------

# 🔧 Cursor Prompt：

# giiHelpdeskAgent Landing Page（Shopify 智能客服 AI）

## 1️⃣ 项目定位
为北美 Shopify 小 B 商户打造的「AI 客服实习生」产品介绍与购买站点。  
核心卖点：14 天免费试用 → Paddle 付费 → 直接插入 Gmail 边栏，最小数据留存，开箱即用。
限制：纯英文内容网站。以gii-cshelpdesk-Landing为项目目录，public目录下的文件保留。

## 2️⃣ 技术约束
- 纯 HTML / CSS / JavaScript（不许用框架）
- 100 % 响应式，桌面 + 移动端
- 部署在 Vercel（根目录提供 `vercel.json`）
- 目录规范：
  /
  ├─ index.html            主页（功能介绍 + 主图演示）
  ├─ features.html         功能对比表（vs Zendesk / Gorgias）
  ├─ pricing.html          3 个 Plan 卡片 + Paddle Checkout
  ├─ case.html             商家案例瀑布流，下拉追加3条
  ├─ about.html            团队介绍 + 推特链接
  ├─ privacy.html          GDPR / CCPA 合规条款
  ├─ /css/style.css
  ├─ /js/
  │   ├─ paddle.js         Paddle 初始化 + Checkout（占位 VENDOR_ID & PRODUCT_IDs）
  │   ├─ cases.js          案例瀑布流加载逻辑（IntersectionObserver）
  │   └─ common.js         头部/底部注入 + 导航高亮
  └─ vercel.json           重定向 & 路由

## 3️⃣ 页面需求逐条拆解

### 3.1 主页 `/`
- Hero：一句话价值主张 + 主图演示（gif / mp4 占位）
- 三段式功能介绍（图标 + 标题 + 1 行描述）
- 14 天免费试用按钮（跳转到 pricing.html#free）

### 3.2 功能对比 `/features.html`
- 表格：行 = 功能，列 = 我们 vs Zendesk vs Gorgias
- 最后一列高亮我们独有的绿色勾
- 响应式：手机端左右滑动

### 3.3 定价 `/pricing.html`
| Plan | Price | Seats | Limit |
|---|---|---|---|
| Free | 14 天试用 | 1 | 50 封/月 |
| Pro | $79/月 | 1 | 1000 封/月 |
| Team | $199/月 | 不限 | 5000 封/月 |

- 每卡片包含：
  - Plan 名 + Badge（Free 为「14-day trial」）
  - Price 大号字体
  - Paddle Checkout 按钮（`<button class="paddle-btn" data-plan="free|pro|team">`）
- Paddle 脚本：`<script src="https://cdn.paddle.com/paddle/paddle.js"></script>`  
  Paddle.Initialize('YOUR_VENDOR_ID')  
  点击按钮 → Paddle.Checkout.open({ product: planId })

### 3.4 商家案例 `/case.html`
- 初始加载 3 条案例：
  ```
  { avatar, name, store, gmv, saved }
  ```
- 下拉到底自动追加 3 条（无限滚动）
- 卡片布局：头像 + 姓名 + 店铺名 + "GMV: $X, Saved Y%"

### 3.5 关于我们 `/about.html`
- 简约介绍团队，侧重技术

### 3.6 隐私政策 `/privacy.html`
- 直接引用 GDPR + CCPA 标准模板
- 关键句加粗：「我们不存储任何邮件内容」

## 4️⃣ 计费 & 合规提示（仅前端文案）
- FAQ 第一条：「支持 Gmail 及 Google Workspace 自定义域名邮箱」
- 隐私声明：OAuth 最小权限（gmail.readonly + gmail.modify），无邮件内容留存
- DPA：由 Paddle 自动签署

## 5️⃣ 样式 & 交互
- 主色：#0A75FF（科技蓝）
- 圆角：8px
- 按钮 hover：亮度 110 %
- 移动端断点：768px
- 案例瀑布流使用 CSS Grid + IntersectionObserver 加载

## 6️⃣ 开发顺序（Cursor 请按此迭代）
1. 建立目录结构 + 空文件
2. 写全局 CSS 变量（颜色 / 圆角 / 字体）
3. index.html  功能介绍
4. pricing.html 搭卡片 + Paddle Checkout（占位 vendor_id）
5. features.html & about.html & privacy.html 纯静态
6. case.html 完成无限滚动（mock 数据）
7. 响应式细节 & Lighthouse 100 分
8. 输出 README：如何本地 serve / 如何替换 Paddle vendor_id / 如何部署 Vercel

## 7️⃣ 命名约定
- class 名：BEM（block__element--modifier）
- 图片放 `/assets/img/`
- JS 变量 camelCase
- 注释用英文

## 8️⃣ 交付检查单
- [ ] 全部页面 Lighthouse 100
- [ ] 移动端手势无横向滚动
- [ ] Paddle Checkout 按钮正确弹出
- [ ] 案例瀑布流无限加载
- [ ] 隐私条款可打印
- [ ] README 完整

完成以上即视为项目 ready for Vercel deploy。

---

## 本地预览

1. 在项目根目录运行一个静态服务器（任选其一）：

```bash
npx http-server . -p 5173
# 或
python3 -m http.server 5173
```
# CROS 
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --disable-web-security --user-data-dir="/Users/huoward/temp"

## Web Server
live-server .
npx http-server . -p 5173
## function server
node local-dev.js


2. 打开浏览器访问 `http://localhost:5173/gii-cshelpdesk-landing/`。

## Paddle 配置

- 编辑 `js/paddle.js`：
  - 设置 `PADDLE_VENDOR_ID = '你的 Vendor ID'`
  - 设置 `PRODUCT_IDS.free | pro | team` 为真实的 Product ID
- 在 `pricing.html` 已引入官方脚本：

```html
<script src="https://cdn.paddle.com/paddle/paddle.js" defer></script>
```

未设置 Vendor ID 或 Product ID 时，按钮会提示“未配置”。

## 部署 Vercel

1. 安装并登录 Vercel CLI：

```bash
npm i -g vercel
vercel login
```

2. 在仓库根目录执行：

```bash
vercel --prod
```

`vercel.json` 已配置 `cleanUrls` 与通用安全头。404 请保留你已创建的 `404.html`。