/**
 * 作者路由
 * 职责：处理HTTP请求，协调Service层
 * 
 * 设计原则：
 * - 薄Controller：只处理HTTP相关逻辑
 * - 业务逻辑委托给Service层
 */

import express, { Request, Response } from 'express';
import { AuthenticationService } from '../services/AuthenticationService.js';
import { EmailAuthService } from '../services/EmailAuthService.js';
import { StoryService } from '../services/StoryService.js';
import { ImageService } from '../services/ImageService.js';
import { 
  FileSystemStoryRepository, 
  FileSystemAuthorRepository,
  FileSystemOperations 
} from '../repositories/FileSystemRepository.js';
import { ValidationError } from '../errors/AppError.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateStoryDataSync } from '../middleware/validator.js';
import type { Story } from '../types/index.js';

const router = express.Router();

// ========== 依赖注入 ==========

const USER_DATA_DIR = process.env.USER_DATA_PATH || 'userdata';

const storyRepo = new FileSystemStoryRepository(USER_DATA_DIR);
const authorRepo = new FileSystemAuthorRepository(USER_DATA_DIR);
const fsOps = new FileSystemOperations();

const storyService = new StoryService(storyRepo);
const authService = new AuthenticationService(authorRepo, fsOps, USER_DATA_DIR, storyService);
const emailAuthService = new EmailAuthService(authorRepo);
const imageService = new ImageService(USER_DATA_DIR);

// ========== 类型定义 ==========

interface LoginBody {
  username: string;
  password: string;
}

interface SaveDraftBody {
  story: Story;
}

interface PublishBody {
  storyId: string;
}

interface DeleteStoryBody {
  storyId: string;
}

interface DeleteAccountBody {
  password: string;
}

interface SendVerificationCodeBody {
  email: string;
}

interface BindEmailBody {
  email: string;
  code: string;
}

interface EmailLoginSendBody {
  email: string;
}

interface EmailLoginVerifyBody {
  email: string;
  code: string;
}

interface UploadImageBody {
  base64Data: string;
  fileName: string;
  width: number;
  height: number;
  originalFormat: string;
}

// ========== 认证路由 ==========

/**
 * POST /login
 * 登录或注册
 */
router.post('/login', asyncHandler(async (req: Request<{}, {}, LoginBody>, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ValidationError('用户名和密码不能为空');
  }

  const result = await authService.login(username, password);

  res.json(result);
}));

/**
 * DELETE /account
 * 删除账户（需要认证）
 */
router.delete('/account', authenticateToken, asyncHandler(async (req: Request<{}, {}, DeleteAccountBody>, res: Response) => {
  const username = req.user!.username;

  await authService.deleteAccount(username);

  res.json({ success: true, message: '账户已删除' });
}));

// ========== 邮箱认证路由 ==========

/**
 * POST /send-verification-code
 * 发送验证码到邮箱（用于绑定邮箱，需要认证）
 */
router.post('/send-verification-code', authenticateToken, asyncHandler(async (req: Request<{}, {}, SendVerificationCodeBody>, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new ValidationError('缺少邮箱地址');
  }

  await emailAuthService.sendVerificationCode(email);

  res.json({ success: true, message: '验证码已发送' });
}));

/**
 * POST /bind-email
 * 绑定邮箱（需要认证）
 */
router.post('/bind-email', authenticateToken, asyncHandler(async (req: Request<{}, {}, BindEmailBody>, res: Response) => {
  const { email, code } = req.body;
  const username = req.user!.username;

  if (!email || !code) {
    throw new ValidationError('缺少邮箱或验证码');
  }

  await emailAuthService.bindEmail(username, email, code);

  res.json({ success: true, message: '邮箱绑定成功' });
}));

/**
 * GET /my-email
 * 获取当前用户绑定的邮箱（需要认证）
 */
router.get('/my-email', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const username = req.user!.username;
  const email = await emailAuthService.getUserEmail(username);

  res.json({ email });
}));

/**
 * DELETE /unbind-email
 * 解绑邮箱（需要认证）
 */
router.delete('/unbind-email', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const username = req.user!.username;

  await emailAuthService.unbindEmail(username);

  res.json({ success: true, message: '邮箱已解绑' });
}));

/**
 * POST /email-login/send
 * 邮箱登录：发送验证码（无需认证）
 */
router.post('/email-login/send', asyncHandler(async (req: Request<{}, {}, EmailLoginSendBody>, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new ValidationError('缺少邮箱地址');
  }

  // 检查邮箱是否已绑定
  const isBound = await emailAuthService.isEmailBound(email);
  if (!isBound) {
    throw new ValidationError('该邮箱未绑定任何账户');
  }

  await emailAuthService.sendVerificationCode(email);

  res.json({ success: true, message: '验证码已发送' });
}));

/**
 * POST /email-login/verify
 * 邮箱登录：验证验证码并登录（无需认证）
 */
router.post('/email-login/verify', asyncHandler(async (req: Request<{}, {}, EmailLoginVerifyBody>, res: Response) => {
  const { email, code } = req.body;

  if (!email || !code) {
    throw new ValidationError('缺少邮箱或验证码');
  }

  const result = await emailAuthService.loginWithEmail(email, code);

  res.json(result);
}));

// ========== 草稿路由 ==========

/**
 * POST /draft
 * 保存草稿（需要认证，带数据验证和XSS防护）
 */
router.post('/draft', authenticateToken, asyncHandler(async (req: Request<{}, {}, SaveDraftBody>, res: Response) => {
  const { story } = req.body;
  const username = req.user!.username;

  if (!story) {
    throw new ValidationError('缺少故事数据');
  }

  // 验证并清洗数据（XSS防护）
  const validationError = validateStoryDataSync(story);
  if (validationError) {
    throw new ValidationError(validationError);
  }

  await storyService.saveDraft(username, story);

  res.json({ success: true });
}));

/**
 * GET /drafts
 * 获取当前用户的所有草稿（需要认证）
 */
router.get('/drafts', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const username = req.user!.username;
  const drafts = await storyService.getAllDrafts(username);
  res.json(drafts);
}));

/**
 * GET /draft/:storyId
 * 获取单个草稿（需要认证）
 */
router.get('/draft/:storyId', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const { storyId } = req.params;
  const username = req.user!.username;
  const story = await storyService.getDraft(username, storyId);
  res.json(story);
}));

/**
 * DELETE /story
 * 删除故事（草稿和发布版本，需要认证）
 */
router.delete('/story', authenticateToken, asyncHandler(async (req: Request<{}, {}, DeleteStoryBody>, res: Response) => {
  const { storyId } = req.body;
  const username = req.user!.username;

  if (!storyId) {
    throw new ValidationError('缺少storyId');
  }

  // JWT认证已验证用户身份，不再需要密码验证
  await storyService.deleteDraft(username, storyId);

  res.json({ success: true, message: '删除成功' });
}));

// ========== 发布路由 ==========

/**
 * POST /publish
 * 发布游戏（需要认证）
 */
router.post('/publish', authenticateToken, asyncHandler(async (req: Request<{}, {}, PublishBody>, res: Response) => {
  const { storyId } = req.body;
  const username = req.user!.username;

  if (!storyId) {
    throw new ValidationError('缺少storyId');
  }

  // JWT认证已验证用户身份，不再需要密码验证
  const result = await storyService.publish(username, storyId);

  res.json(result);
}));

/**
 * GET /published
 * 获取所有已发布游戏
 */
router.get('/published', asyncHandler(async (_req: Request, res: Response) => {
  const games = await storyService.getAllPublished();
  res.json(games);
}));

/**
 * GET /published/:username/:gameId
 * 获取特定已发布游戏
 */
router.get('/published/:username/:gameId', asyncHandler(async (req: Request, res: Response) => {
  const { username, gameId } = req.params;
  const game = await storyService.getPublished(username, gameId);
  res.json(game);
}));

// ========== 图片上传路由 ==========

/**
 * POST /upload-image
 * 上传图片（需要认证，自动去重）
 */
router.post('/upload-image', authenticateToken, asyncHandler(async (req: Request<{}, {}, UploadImageBody>, res: Response) => {
  const { base64Data, fileName, width, height, originalFormat } = req.body;
  const username = req.user!.username;

  if (!base64Data || !fileName) {
    throw new ValidationError('缺少图片数据或文件名');
  }

  const result = await imageService.uploadImage(
    username,
    base64Data,
    fileName,
    width,
    height,
    originalFormat
  );

  res.json(result);
}));

export default router;
export { authService, storyService, imageService };
