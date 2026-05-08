# Landing Site 测试与配置指南

本文档介绍如何本地测试 `gii-cshelpdesk-landing` 站点以及相关的环境配置。

---

## 🌐 Landing Site 本地测试方法

您可以选择以下任一方法在本地启动并测试站点。

### 1. 使用 Vercel CLI (推荐)
这是最接近生产环境的方法，因为它会处理 `vercel.json` 中的重写和头部配置。

```bash
# 安装 Vercel CLI (如未安装)
npm install -g vercel

# 在项目根目录启动开发服务器，并监听 3456 端口
# 注意：不要在 package.json 的 dev 脚本中调用 vercel dev，否则会导致递归执行错误
vercel dev --listen 3456
```
或者，使用我为您准备的备选脚本：
```bash
npm run local-serve
```
之后访问：`http://localhost:3456`

### 2. 使用 VS Code Live Server 插件
如果您使用 Visual Studio Code，这是最简单的方法。

1. 在扩展商店搜索并安装 **Live Server**。
2. 打开 `index.html`。
3. 点击右下角的 **Go Live** 状态栏按钮，或者右键点击 HTML 文件选择 **Open with Live Server**。

### 3. 使用 Python (Mac 自带)
无需安装任何工具，直接使用 macOS 自带的 Python 模块。

```bash
# 在项目根目录运行
python3 -m http.server 3456
```
之后访问：`http://localhost:3456`

### 4. 使用 npx serve
如果您已安装 Node.js，可以使用此命令启动一个快速的静态服务器。

```bash
npx serve .
```

---

## 🔑 Google Login 本地测试说明

由于 Google OAuth 有来源限制（Authorized JavaScript origins），在本地测试 Google 登录时请注意：

1. **设置 Redirect URI**: 在 Google Cloud Console 的凭据设置中，将 `http://localhost:3456` 添加到 **Authorized JavaScript origins**。
2. **API 配置**: 确保 `js/api-config.js` 中的 `googleClientId` 已正确设置。
3. **域名设置**: 本地登录成功后，如果是新用户，系统会引导至 `dashboard.html?setup=shopify-domain`。

---


## 🔧 环境配置具体方法

### 1. Firebase 配置

#### 1.1 创建 Firebase 项目
1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 点击"创建项目"
3. 输入项目名称：`giihelpdesk-agent`
4. 启用 Google Analytics（可选）
5. 创建项目

#### 1.2 启用 Firestore 数据库
1. 在左侧菜单选择"Firestore Database"
2. 点击"创建数据库"
3. 选择"以测试模式开始"（稍后会设置安全规则）
4. 选择数据库位置（建议选择离用户最近的区域）

#### 1.3 获取服务账号密钥
1. 在项目设置中，选择"服务账号"标签
2. 点击"生成新的私钥"
3. 下载 JSON 文件
4. 将文件重命名为 `firebase-service-account.json`

#### 1.4 设置 Firestore 安全规则
在 Firestore 控制台中，设置以下安全规则：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 用户只能访问自己的数据
    match /{domain}/{email} {
      allow read, write: if request.auth != null && 
        request.auth.token.email == email;
    }
    
    // 域名集合 - 只允许已认证用户读取
    match /domains/{domain} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // 用户集合 - 用户只能访问自己的数据
    match /users/{email} {
      allow read, write: if request.auth != null && 
        request.auth.token.email == email;
    }
    
    // 订阅集合 - 用户只能访问自己的订阅
    match /subscriptions/{email} {
      allow read, write: if request.auth != null && 
        request.auth.token.email == email;
    }
    
    // 非ce集合 - 用于存储临时数据
    match /nonces/{nonceId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 2. SendGrid 配置

#### 2.1 创建 SendGrid 账户
1. 访问 [SendGrid](https://sendgrid.com/)
2. 注册免费账户（每月可发送 100 封邮件）
3. 验证邮箱地址

#### 2.2 创建 API 密钥
1. 在左侧菜单选择"Settings" > "API Keys"
2. 点击"Create API Key"
3. 选择"Full Access"或"Restricted Access"（仅邮件发送权限）
4. 复制生成的 API 密钥

#### 2.3 验证发件人域名（推荐）
1. 在左侧菜单选择"Settings" > "Sender Authentication"
2. 选择"Domain Authentication"
3. 按照说明添加 DNS 记录
4. 等待验证完成（通常需要几分钟到几小时）

#### 2.4 创建邮件模板（可选）
1. 在左侧菜单选择"Marketing" > "Templates"
2. 创建以下模板：
   - 邮箱验证模板
   - 密码重置模板
   - 欢迎邮件模板

### 3. Paddle 配置

#### 3.1 创建 Paddle 账户
1. 访问 [Paddle](https://paddle.com/)
2. 注册商家账户
3. 完成身份验证和银行账户设置

#### 3.2 获取 API 凭据
1. 在 Paddle Dashboard 中，选择"Developer Tools" > "API Credentials"
2. 复制以下信息：
   - Auth Code
   - Vendor ID
   - API Key

#### 3.3 配置 Webhook
1. 在"Developer Tools" > "Webhooks"中
2. 添加新的 webhook 端点：`https://your-domain.vercel.app/api/webhooks/paddle`
3. 选择以下事件：
   - `subscription.created`
   - `subscription.updated`
   - `subscription.cancelled`
   - `payment.succeeded`
   - `payment.failed`

#### 3.4 创建产品
1. 在"Catalog" > "Products"中创建产品
2. 设置订阅计划：
   - Free Plan: $0/month
   - Pro Plan: $29/month
   - Team Plan: $99/month
3. 记录每个计划的 Product ID

### 4. 环境变量配置

#### 4.1 本地开发环境
在项目根目录创建 `.env.local` 文件：

```bash
# Firebase 配置
FIREBASE_PROJECT_ID=giihelpdesk-agent
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@giihelpdesk-agent.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40giihelpdesk-agent.iam.gserviceaccount.com

# SendGrid 配置
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=giiHelpdesk
SENDGRID_VERIFICATION_TEMPLATE_ID=d_xxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_PASSWORD_RESET_TEMPLATE_ID=d_xxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_WELCOME_TEMPLATE_ID=d_xxxxxxxxxxxxxxxxxxxxxxxx

# Paddle 配置
PADDLE_VENDOR_ID=your_vendor_id
PADDLE_API_KEY=your_api_key
PADDLE_AUTH_CODE=your_auth_code
PADDLE_WEBHOOK_SECRET=your_webhook_secret
PADDLE_ENVIRONMENT=sandbox  # 或 production

# JWT 配置
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_make_it_long_and_random

# 应用配置
APP_URL=http://localhost:3000
VERIFICATION_BASE_URL=http://localhost:3000/auth/verify
RESET_PASSWORD_BASE_URL=http://localhost:3000/auth/reset

# 日志级别
LOG_LEVEL=DEBUG
```

#### 4.2 Vercel 部署环境
在 Vercel 项目设置中添加环境变量：

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择您的项目
3. 点击"Settings" > "Environment Variables"
4. 添加上述所有环境变量
5. 为生产环境设置不同的值（如 `APP_URL`、`PADDLE_ENVIRONMENT` 等）

### 5. 验证配置

#### 5.1 测试 Firebase 连接
```bash
cd gii-cshelpdesk-agent/serverless-functions
npm install
node -e "
const { initializeFirestore } = require('./lib/firestore');
const { logInfo } = require('./lib/logger');

async function test() {
  try {
    const firestore = await initializeFirestore();
    logInfo('Firebase connection successful');
    console.log('✅ Firebase 连接成功');
  } catch (error) {
    console.error('❌ Firebase 连接失败:', error.message);
  }
}

test();
"
```



#### 5.3 测试 Paddle 连接
```bash
node -e "
const { makePaddleRequest, getProductDetails } = require('./lib/paddle');

async function test() {
  try {
    const products = await makePaddleRequest('product/list_products');
    console.log('✅ Paddle API 连接成功');
    console.log('产品列表:', products);
  } catch (error) {
    console.error('❌ Paddle API 测试失败:', error.message);
  }
}

test();
"
```

### 6. 部署检查清单

- [ ] Firebase 项目创建完成
- [ ] Firestore 数据库启用
- [ ] 服务账号密钥下载
- [ ] 安全规则配置
- [ ] SendGrid 账户创建
- [ ] API 密钥生成
- [ ] 发件人域名验证
- [ ] Paddle 账户创建
- [ ] API 凭据获取
- [ ] Webhook 端点配置
- [ ] 产品计划创建
- [ ] 本地环境变量配置
- [ ] Vercel 环境变量配置
- [ ] 所有连接测试通过

### 7. 常见问题解决

#### 7.1 Firebase 权限错误
```bash
# 确保服务账号有正确的权限
# 在 Firebase Console 中检查 IAM 权限
```

#### 7.2 SendGrid 发送失败
```bash
# 检查 API 密钥是否正确
# 验证发件人邮箱是否已验证
# 检查发送限制（免费账户每月 100 封）
```

#### 7.3 Paddle Webhook 验证失败
```bash
# 确保 webhook 密钥正确
# 检查 webhook 端点是否可访问
# 验证事件类型是否正确配置
```

现在您的环境配置应该已经完成！如果遇到任何问题，请告诉我具体的错误信息，我会帮您解决。