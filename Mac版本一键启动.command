#!/bin/bash
# 本文档由小乙老师编写
# MoScript 互动小说编辑器 - Mac版启动脚本
# 功能：
# 1. 检测端口占用
# 2. 设置环境变量
# 3. 启动后端服务
# 4. 打开浏览器

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
PORT=3001
HOST="localhost"
URL="http://${HOST}:${PORT}"

# 路径配置
# 优先使用系统Node.js，如果没有则尝试使用内置的Node.js
if command -v node >/dev/null 2>&1; then
    NODEJS_PATH="node"
    NODEJS_TYPE="系统"
else
    NODEJS_PATH="$SCRIPT_DIR/nodejs/node.exe"
    NODEJS_TYPE="内置"
    # 检查是否有Wine或类似工具可以运行.exe文件
    if ! command -v wine >/dev/null 2>&1; then
        echo "警告: 没有找到系统Node.js和Wine，可能无法运行内置的Windows版Node.js"
    fi
fi
LAUNCHER_PATH="$SCRIPT_DIR/app/launcher.js"
USER_DATA_PATH="$SCRIPT_DIR/userdata"
PID_FILE="$SCRIPT_DIR/app.pid"

# 打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 检查必要的文件
check_files() {
    print_message $BLUE "正在检查必要文件..."
    
    if [[ "$NODEJS_PATH" == "node" ]]; then
        print_message $GREEN "使用系统Node.js ✓"
    else
        if [[ ! -f "$NODEJS_PATH" ]]; then
            print_message $RED "错误: 找不到 Node.js ($NODEJS_PATH)"
            print_message $YELLOW "请安装Node.js或确保项目文件完整"
            exit 1
        fi
        print_message $GREEN "使用内置Node.js ✓"
    fi
    
    if [[ ! -f "$LAUNCHER_PATH" ]]; then
        print_message $RED "错误: 找不到应用文件 ($LAUNCHER_PATH)"
        print_message $YELLOW "请确保项目文件完整"
        exit 1
    fi
    
    print_message $GREEN "必要文件检查完成 ✓"
}

# 检测端口是否被占用
check_port() {
    print_message $BLUE "检测端口 $PORT..."
    
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_message $RED "错误: 端口 $PORT 已被占用！"
        print_message $YELLOW ""
        print_message $YELLOW "可能的原因："
        print_message $YELLOW "  1. MoScript 已经在运行"
        print_message $YELLOW "  2. 其他程序占用了该端口"
        print_message $YELLOW ""
        print_message $YELLOW "解决方法："
        print_message $YELLOW "  1. 关闭已有的终端窗口"
        print_message $YELLOW "  2. 或直接访问: $URL"
        print_message $YELLOW ""
        exit 1
    fi
    
    print_message $GREEN "端口可用 ✓"
}

# 确保用户数据目录存在
ensure_userdata() {
    if [[ ! -d "$USER_DATA_PATH" ]]; then
        mkdir -p "$USER_DATA_PATH"
        print_message $BLUE "已创建用户数据目录: $USER_DATA_PATH"
    fi
}

# 打开浏览器
open_browser() {
    print_message $BLUE "正在打开浏览器: $URL"
    
    # Mac 使用 open 命令
    if command -v open >/dev/null 2>&1; then
        # 检查是否在终端环境中运行
        if [[ -t 1 ]]; then
            # 在终端中，使用open命令
            open "$URL" 2>/dev/null || {
                print_message $YELLOW "无法自动打开浏览器，请手动访问: $URL"
            }
        else
            # 非终端环境（如双击运行），尝试使用open命令
            open "$URL" 2>/dev/null || {
                print_message $YELLOW "无法自动打开浏览器，请手动访问: $URL"
            }
        fi
    else
        print_message $YELLOW "无法自动打开浏览器，请手动访问: $URL"
    fi
}

# 等待服务就绪
wait_for_server() {
    local max_attempts=30
    local attempts=0
    
    print_message $BLUE "等待服务就绪..."
    
    while [[ $attempts -lt $max_attempts ]]; do
        if curl -s "$URL/health" >/dev/null 2>&1; then
            print_message $GREEN "服务就绪 ✓"
            return 0
        fi
        
        attempts=$((attempts + 1))
        sleep 0.5
    done
    
    print_message $RED "服务器启动超时"
    return 1
}

# 优雅退出
cleanup() {
    print_message $YELLOW ""
    print_message $YELLOW "正在关闭服务..."
    
    if [[ -f "$PID_FILE" ]]; then
        local pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid" 2>/dev/null
        fi
        rm -f "$PID_FILE"
    fi
    
    print_message $GREEN "服务已关闭"
    exit 0
}

# 设置信号处理
trap cleanup SIGINT SIGTERM

# 主启动流程
main() {
    clear
    print_message $BLUE ""
    print_message $BLUE "MoScript 互动小说编辑器 - 桌面版"
    print_message $BLUE ""
    
    # 1. 检查文件
    check_files
    echo ""
    
    # 2. 检测端口
    check_port
    echo ""
    
    # 3. 确保用户数据目录存在
    ensure_userdata
    echo ""
    
    # 4. 启动应用
    print_message $BLUE "启动应用服务..."
    
    # 设置环境变量
    export NODE_ENV="production"
    export PORT="$PORT"
    export HOST="$HOST"
    export DESKTOP_MODE="true"
    export CORS_ORIGIN="$URL"
    export FRONTEND_PATH="$SCRIPT_DIR/app/frontend/dist"
    export USER_DATA_PATH="$USER_DATA_PATH"
    
    # 启动应用
    "$NODEJS_PATH" "$LAUNCHER_PATH" &
    APP_PID=$!
    
    # 等待服务就绪
    if wait_for_server; then
        echo ""
        print_message $GREEN "启动成功！"
        echo ""
        print_message $GREEN "  访问地址: $URL"
        print_message $GREEN "  数据目录: userdata/"
        echo ""
        print_message $YELLOW "  关闭此窗口将停止服务"
        echo ""
        
        # 打开浏览器
        open_browser
        
        # 等待应用进程
        wait $APP_PID
    else
        print_message $RED "启动失败"
        exit 1
    fi
}

# 执行主函数
main