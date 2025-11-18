#!/bin/bash

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Node.js 설치 스크립트${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 현재 Node.js 버전 확인
echo -e "${BLUE}현재 Node.js 버전: ${NC}$(node -v)"
echo ""

# nvm 설치 확인
if command -v nvm &> /dev/null || [ -s "$HOME/.nvm/nvm.sh" ]; then
    echo -e "${GREEN}✓ nvm이 이미 설치되어 있습니다.${NC}"

    # nvm 로드
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

    echo -e "${YELLOW}Node.js 20 설치를 시작합니다...${NC}"
    nvm install 20
    nvm use 20
    nvm alias default 20

    echo ""
    echo -e "${GREEN}✓ Node.js 설치 완료!${NC}"
    echo -e "${BLUE}새로운 버전: ${NC}$(node -v)"
else
    echo -e "${YELLOW}nvm이 설치되어 있지 않습니다.${NC}"
    echo ""
    echo -e "${BLUE}nvm을 설치하시겠습니까? (y/n)${NC}"
    read -r response

    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}nvm 설치 중...${NC}"
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

        echo ""
        echo -e "${GREEN}✓ nvm 설치 완료!${NC}"
        echo ""
        echo -e "${YELLOW}다음 명령어를 실행하여 설정을 완료하세요:${NC}"
        echo ""
        echo -e "${BLUE}  # 터미널 설정 파일 다시 로드${NC}"
        echo "  source ~/.zshrc  # zsh 사용 시"
        echo "  source ~/.bashrc # bash 사용 시"
        echo ""
        echo -e "${BLUE}  # Node.js 20 설치${NC}"
        echo "  nvm install 20"
        echo "  nvm use 20"
        echo "  nvm alias default 20"
        echo ""
    else
        echo ""
        echo -e "${BLUE}Homebrew를 사용하여 Node.js를 설치하시겠습니까? (y/n)${NC}"
        read -r brew_response

        if [[ "$brew_response" =~ ^[Yy]$ ]]; then
            if command -v brew &> /dev/null; then
                echo -e "${YELLOW}Node.js 20 설치 중...${NC}"
                brew install node@20
                brew link node@20 --force --overwrite

                echo ""
                echo -e "${GREEN}✓ Node.js 설치 완료!${NC}"
                echo -e "${BLUE}새로운 버전: ${NC}$(node -v)"
            else
                echo -e "${RED}Homebrew가 설치되어 있지 않습니다.${NC}"
                echo -e "${BLUE}Homebrew 설치: https://brew.sh${NC}"
            fi
        else
            echo -e "${YELLOW}설치를 취소했습니다.${NC}"
        fi
    fi
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}설치가 완료되었습니다!${NC}"
echo -e "${BLUE}========================================${NC}"
