#!/usr/bin/env python3
import shutil
from pathlib import Path

ROOT = Path(__file__).parent

# 递归删除目录
for item in ROOT.rglob('*'):
    if '.git' in item.parts:
        continue
    if item.is_dir():
        # 固定名称的目录
        if item.name in {'node_modules', 'dist', '.cache', 'playwright-report', 'test-results', 'userdata'}:
            shutil.rmtree(item)
            print(f'删除: {item.relative_to(ROOT)}')
        # test-temp- 开头的临时测试目录
        elif item.name.startswith('test-temp-'):
            shutil.rmtree(item)
            print(f'删除: {item.relative_to(ROOT)}')

# 删除特定目录
for path in ['frontend/public/templates', 'packager-win/temp', 'packager-win/output']:
    full = ROOT / path
    if full.exists():
        shutil.rmtree(full)
        print(f'删除: {path}')

# 删除编译产物文件
for pattern in ['**/*.d.ts', '**/*.d.ts.map', '**/*.js.map', '**/*.tsbuildinfo', '**/.DS_Store', '**/Thumbs.db']:
    for f in ROOT.rglob(pattern):
        if '.git' not in f.parts and 'node_modules' not in f.parts:
            f.unlink()
            print(f'删除: {f.relative_to(ROOT)}')

print('清理完成')
