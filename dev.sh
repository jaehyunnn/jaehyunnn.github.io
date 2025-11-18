#!/bin/bash

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

REQUIRED_NODE_VERSION="20.9.0"

# Node 버전 체크 함수
check_node_version() {
    CURRENT_VERSION=$(node -v | sed 's/v//')
    REQUIRED_VERSION=$1

    # 버전 비교
    if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$CURRENT_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
        return 1
    fi
    return 0
}

echo -e "${BLUE}Starting development server...${NC}"

# nvm 로드 시도
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

# .nvmrc 파일이 있고 nvm이 설치되어 있으면 자동으로 버전 전환
if [ -f ".nvmrc" ] && command -v nvm &> /dev/null; then
    echo -e "${BLUE}Switching to Node.js version from .nvmrc...${NC}"
    nvm use
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}Installing required Node.js version...${NC}"
        nvm install
        nvm use
    fi
fi

# Node.js 버전 체크
if ! check_node_version "$REQUIRED_NODE_VERSION"; then
    echo -e "${RED}Error: Node.js version $(node -v) is not supported.${NC}"
    echo -e "${YELLOW}Required: Node.js >= v${REQUIRED_NODE_VERSION}${NC}"
    echo ""
    echo -e "${BLUE}Please upgrade Node.js using one of these methods:${NC}"
    echo ""
    echo -e "${GREEN}Option 1: Using nvm (recommended)${NC}"
    echo "  # nvm 설치"
    echo "  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "  # 터미널 재시작 후"
    echo "  nvm install 20"
    echo "  nvm use 20"
    echo ""
    echo -e "${GREEN}Option 2: Using Homebrew${NC}"
    echo "  brew install node@20"
    echo "  brew link node@20"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ Node.js version: $(node -v)${NC}"

# node_modules가 없으면 먼저 설치
if [ ! -d "node_modules" ]; then
    echo -e "${GREEN}Installing dependencies...${NC}"
    npm install
fi

# dev 서버 실행
echo -e "${GREEN}Running Next.js dev server...${NC}"
npm run dev
