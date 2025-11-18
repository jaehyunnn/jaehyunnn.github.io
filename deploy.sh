#!/bin/bash

echo "🚀 GitHub Pages 배포 스크립트"
echo "================================"
echo ""

# 현재 디렉토리 확인
if [ ! -f "package.json" ]; then
    echo "❌ 오류: mobile_invitation 폴더에서 실행해주세요!"
    exit 1
fi

# Git 설정 확인
if ! git config user.name > /dev/null 2>&1; then
    echo "📝 Git 사용자 설정"
    read -p "이름을 입력하세요: " git_name
    read -p "이메일을 입력하세요: " git_email
    git config --global user.name "$git_name"
    git config --global user.email "$git_email"
    echo "✅ Git 설정 완료"
    echo ""
fi

# 빌드 테스트
echo "🔨 빌드 테스트 중..."
if ! npm run build; then
    echo "❌ 빌드 실패! 오류를 수정한 후 다시 시도하세요."
    exit 1
fi
echo "✅ 빌드 성공!"
echo ""

# Git remote 확인
echo "🔗 Git 저장소 연결 확인..."
if git remote | grep -q "origin"; then
    current_remote=$(git remote get-url origin)
    echo "현재 연결된 저장소: $current_remote"
    read -p "이 저장소로 배포하시겠습니까? (y/n): " confirm
    if [ "$confirm" != "y" ]; then
        read -p "새 저장소 URL을 입력하세요: " new_remote
        git remote remove origin
        git remote add origin "$new_remote"
    fi
else
    read -p "GitHub 저장소 URL을 입력하세요 (예: https://github.com/jaehyunnn/jaehyunnn.github.io.git): " remote_url
    git remote add origin "$remote_url"
fi
echo ""

# Git add, commit, push
echo "📦 변경사항 커밋 중..."
git add .
read -p "커밋 메시지 (엔터 시 기본값 사용): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Update: $(date '+%Y-%m-%d %H:%M:%S')"
fi
git commit -m "$commit_msg"
echo ""

echo "🚀 GitHub에 푸시 중..."
read -p "강제 푸시하시겠습니까? 기존 내용이 삭제됩니다! (y/n): " force_push
if [ "$force_push" = "y" ]; then
    git push -f origin main
else
    git branch -M main
    git push -u origin main
fi

echo ""
echo "✅ 배포 완료!"
echo ""
echo "📌 다음 단계:"
echo "1. GitHub 저장소 → Settings → Pages"
echo "2. Source를 'GitHub Actions'로 설정"
echo "3. Actions 탭에서 배포 확인 (2-5분)"
echo ""
echo "🌐 배포 URL 확인: GitHub Settings → Pages"
