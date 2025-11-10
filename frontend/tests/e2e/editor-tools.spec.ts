/**
 * 编辑器工具功能 E2E 测试
 * 测试场景：
 * 1. 验证器：检测未连接的选项
 * 2. 自动布局：层次布局
 * 3. 撤销/重做：删除节点后撤销和重做
 */

import { test, expect } from '@playwright/test';

test.setTimeout(60000);

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  await page.click('text=在线使用');
  await page.waitForSelector('input#username', { timeout: 10000 });
  await page.fill('input#username', '2222');
  await page.fill('input#password', '2222');
  await page.click('button.btn-login');
  
  await page.waitForURL('**/app', { timeout: 10000 });
  await page.waitForTimeout(1000);
  
  await page.click('text=创建新作品');
  await page.waitForURL('**/editor/**', { timeout: 10000 });
  await page.waitForSelector('.react-flow', { timeout: 10000 });
  await page.waitForTimeout(1000);
});

test('验证器：检测未连接的选项', async ({ page }) => {
  // 1. 编辑开始节点，添加一个未连接的选项
  await page.locator('.react-flow__node').first().click();
  await page.waitForSelector('[data-testid="bottom-edit-panel"]', { timeout: 5000 });
  
  // 添加第二个选项
  const addChoiceBtn = page.locator('[data-testid="bottom-edit-panel"] button:has-text("添加选项")');
  if (await addChoiceBtn.isVisible()) {
    await addChoiceBtn.click();
    await page.waitForTimeout(300);
  }
  
  await page.locator('[data-testid="bottom-edit-panel"] button').filter({ hasText: '关闭' }).click();
  await page.waitForTimeout(2500); // 等待自动保存
  
  // 2. 点击"验证结构"按钮
  const validateBtn = page.locator('button:has-text("验证故事"), button:has-text("验证结构"), button:has-text("验证")');
  await validateBtn.first().click();
  await page.waitForTimeout(1000);
  
  // 3. 应该显示错误提示（有未连接的选项）
  const pageText = await page.textContent('body');
  
  // 可能显示错误数量或警告
  expect(pageText).toMatch(/错误|警告|未连接/i);
});

test('自动布局：层次布局', async ({ page }) => {
  // 1. 创建多个节点
  for (let i = 0; i < 5; i++) {
    await page.click('button:has-text("添加节点")');
    await page.waitForTimeout(200);
  }
  
  // 2. 打开侧边栏查找自动布局按钮
  const menuBtn = page.locator('button:has-text("☰")');
  if (await menuBtn.isVisible()) {
    await menuBtn.click();
    await page.waitForTimeout(500);
  }
  
  const layoutBtn = page.locator('button:has-text("层次布局")');
  
  // 记录布局前的第一个节点位置
  const firstNode = page.locator('.react-flow__node').first();
  const beforePos = await firstNode.boundingBox();
  
  // 点击自动布局
  await layoutBtn.click();
  await page.waitForTimeout(2000);
  
  // 记录布局后的位置
  const afterPos = await firstNode.boundingBox();
  
  // 验证：位置应该改变
  expect(beforePos).toBeTruthy();
  expect(afterPos).toBeTruthy();
  const posChanged = beforePos!.x !== afterPos!.x || beforePos!.y !== afterPos!.y;
  expect(posChanged).toBe(true);
});

test('撤销/重做：删除节点后撤销和重做', async ({ page }) => {
  // 注意：撤销/重做功能仅支持删除节点操作
  
  // 1. 记录初始节点数量
  const initialCount = await page.locator('.react-flow__node').count();
  
  // 2. 选中一个节点
  await page.locator('.react-flow__node').first().click();
  await page.waitForTimeout(500);
  
  // 3. 打开侧边栏（如果没打开）
  const menuBtn = page.locator('button:has-text("☰")');
  if (await menuBtn.isVisible()) {
    await menuBtn.click();
    await page.waitForTimeout(500);
  }
  
  // 4. 查找并点击删除节点按钮（第一次点击）
  const deleteBtn = page.locator('button:has-text("删除选中节点")');
  await deleteBtn.click();
  await page.waitForTimeout(500);
  
  // 4.5. 第二次点击同一个按钮确认删除
  const confirmBtn = page.locator('button:has-text("确认删除？")');
  await confirmBtn.click();
  await page.waitForTimeout(500);
  
  // 5. 验证：节点被删除
  const afterDeleteCount = await page.locator('.react-flow__node').count();
  expect(afterDeleteCount).toBe(initialCount - 1);
  
  // 6. 点击撤销按钮
  const undoBtn = page.locator('button:has-text("撤销")');
  await undoBtn.click();
  await page.waitForTimeout(1000);
  
  // 7. 验证：节点被恢复
  const afterUndoCount = await page.locator('.react-flow__node').count();
  expect(afterUndoCount).toBe(initialCount);
  
  // 8. 点击重做按钮
  const redoBtn = page.locator('button:has-text("重做")');
  await redoBtn.click();
  await page.waitForTimeout(1000);
  
  // 9. 验证：节点再次被删除
  const afterRedoCount = await page.locator('.react-flow__node').count();
  expect(afterRedoCount).toBe(initialCount - 1);
});
