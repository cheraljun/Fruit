#!/usr/bin/env python3
"""
Git提交前清理脚本
职责：备份用户数据、清理构建产物、临时文件、运行时数据
"""

import shutil
from pathlib import Path
from typing import List
from datetime import datetime

ROOT = Path(__file__).parent

# 需要完全删除的目录
DIRS_TO_REMOVE = [
    'backend/dist',
    'backend/node_modules',
    'backend/userdata',
    'frontend/dist',
    'frontend/node_modules',
    'shared/node_modules',
    'player-standalone/terminal/dist',
    'player-standalone/terminal/node_modules',
    'player-standalone/visual-novel/dist',
    'player-standalone/visual-novel/node_modules',
    'frontend/public/templates',
    'node_modules',
    '.cache',
    # 打包工具
    'packager/node_modules',
    'packager/temp',
    'packager/output',
]

# 需要递归删除的文件模式
FILE_PATTERNS = [
    '**/*.d.ts',
    '**/*.d.ts.map',
    '**/*.js.map',
    '**/*.tsbuildinfo',
    '**/.DS_Store',
    '**/Thumbs.db',
]

# 排除的目录（不扫描）
EXCLUDE = {'node_modules', '.git', '.vscode', 'public', 'libs'}


def backup_userdata() -> None:
    """备份用户数据到项目根目录"""
    userdata_paths = [
        ROOT / 'backend' / 'dist' / 'backend' / 'userdata',
        ROOT / 'backend' / 'userdata',
    ]
    
    source_path = None
    for path in userdata_paths:
        if path.exists() and path.is_dir():
            source_path = path
            break
    
    if not source_path:
        print('userdata目录不存在')
        return
    
    if not any(source_path.iterdir()):
        print('userdata目录为空')
        return
    
    backup_path = ROOT / 'userdata_backup'
    
    if backup_path.exists():
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_path = ROOT / f'userdata_backup_{timestamp}'
    
    try:
        shutil.copytree(source_path, backup_path)
        print(f'userdata已备份: {backup_path.name}')
    except Exception as e:
        print(f'备份失败: {e}')


def remove_dir(path: str) -> None:
    """删除目录"""
    full_path = ROOT / path
    if full_path.exists() and full_path.is_dir():
        shutil.rmtree(full_path)
        print(f'已删除: {path}')


def remove_files(pattern: str) -> None:
    """递归删除匹配的文件"""
    count = 0
    for f in ROOT.rglob(pattern):
        if any(e in f.parts for e in EXCLUDE):
            continue
        if f.is_file():
            f.unlink()
            count += 1
    if count > 0:
        print(f'已删除{count}个{pattern}文件')


def check_env_files() -> None:
    """检查环境变量文件"""
    env_files = [
        'backend/.env',
        'frontend/.env',
    ]
    
    missing = []
    for env in env_files:
        if not (ROOT / env).exists():
            missing.append(env)
    
    if missing:
        print(f'缺少环境变量文件: {", ".join(missing)}')


def show_reinstall_commands() -> None:
    backup_paths = list(ROOT.glob('userdata_backup*'))
    if backup_paths:
        latest_backup = max(backup_paths, key=lambda p: p.stat().st_mtime)
        print('恢复用户数据:')
        print(f'cp -r {latest_backup.name}/* backend/userdata/')


def main() -> None:
    """主函数"""
    print('开始清理')
    backup_userdata()
    for d in DIRS_TO_REMOVE:
        remove_dir(d)
    for pattern in FILE_PATTERNS:
        remove_files(pattern)
    check_env_files()
    print('清理完成')
    show_reinstall_commands()


if __name__ == '__main__':
    main()
