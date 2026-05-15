#!/bin/bash

# 获取脚本所在目录的绝对路径
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# 前端项目根目录
FRONTEND_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

# 切换到前端目录
cd "$FRONTEND_DIR" || exit 1

# 创建 logs 目录
mkdir -p logs

# 生成带时间戳的日志文件名
LOG_FILE="logs/frontend-$(date +%Y%m%d-%H%M%S).log"

echo "Starting frontend server..."
echo "Working directory: $(pwd)"
echo "Server will run on: http://localhost:3456"
echo "Logs will be saved to: $LOG_FILE"
echo ""

# 启动服务并记录日志
npm run local-serve 2>&1 | tee "$LOG_FILE"

# Made with Bob
