/**
 * HTML导出功能 E2E 测试
 * 测试场景：
 * 1. 导出HTML文件
 * 2. 验证文件名正确
 * 3. 验证导出的HTML包含故事数据
 */

import { test, expect } from '@playwright/test';
import path from 'path';

test.setTimeout(60000);

test.beforeEach(async ({ page }) => {
  // 访问首页
  await page.goto('http://localhost:5173');
  
  // 登录
  await page.click('text=在线使用');
  await page.waitForSelector('input#username', { timeout: 10000 });
  await page.fill('input#username', '2222');
  await page.fill('input#password', '2222');
  await page.click('button.btn-login');
  
  // 等待跳转到Dashboard
  await page.waitForURL('**/app', { timeout: 10000 });
  await page.waitForTimeout(1000);
  
  // 创建新故事
  await page.click('text=创建新作品');
  await page.waitForURL('**/editor/**', { timeout: 10000 });
  await page.waitForSelector('.react-flow', { timeout: 10000 });
  await page.waitForTimeout(1000);
  
  // 修改故事标题（方便识别）
  const titleInput = page.locator('input[placeholder="我的互动小说"]').or(page.locator('label:has-text("标题") + input')).first();
  await titleInput.click();
  await titleInput.press('Control+A');
  await titleInput.pressSequentially('导出测试故事', { delay: 30 });
  
  // 等待自动保存
  await page.waitForTimeout(2500);
  
  // 返回Dashboard
  await page.click('button:has-text("返回仪表盘")');
  await page.waitForURL('**/app', { timeout: 10000 });
  await page.waitForTimeout(1000);
});

test('导出HTML：基础导出功能', async ({ page }) => {
  console.log('准备导出HTML...');
  
  // 1. 先找到"导出测试故事"这个故事卡片（可能有多个，取第一个）
  const storyCard = page.locator('.story-card').filter({ hasText: '导出测试故事' }).first();
  
  // 2. 在这个卡片内找HTML导出按钮
  const exportButton = storyCard.locator('button[title="导出为HTML"]');
  
  // 监听下载事件
  const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
  
  await exportButton.click();
  
  // 等待下载
  const download = await downloadPromise;
  
  // 验证文件名
  const fileName = download.suggestedFilename();
  console.log('下载的文件名:', fileName);
  
  expect(fileName).toContain('.html');
  expect(fileName).toContain('导出测试故事');
  
  // 获取下载的文件路径
  const filePath = await download.path();
  console.log('文件保存路径:', filePath);
  
  expect(filePath).toBeTruthy();
});

test('导出HTML：验证导出数据完整性', async ({ page }) => {
  // 1. 先找到"导出测试故事"这个故事卡片（可能有多个，取第一个）
  const storyCard = page.locator('.story-card').filter({ hasText: '导出测试故事' }).first();
  
  // 2. 在这个卡片内找HTML导出按钮
  const exportButton = storyCard.locator('button[title="导出为HTML"]');
  
  // 监听下载事件
  const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
  
  await exportButton.click();
  
  const download = await downloadPromise;
  const filePath = await download.path();
  
  expect(filePath).toBeTruthy();
  
  // 读取下载的HTML文件
  const fs = await import('fs/promises');
  const htmlContent = await fs.readFile(filePath!, 'utf-8');
  
  // 验证：HTML包含故事数据
  expect(htmlContent).toContain('window.STORY_DATA');
  expect(htmlContent).toContain('导出测试故事');
  
  // 验证：包含React和ReactFlow等依赖
  expect(htmlContent).toContain('<script');
  
  console.log('HTML内容验证通过');
});

