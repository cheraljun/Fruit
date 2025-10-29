# DeepSeek API 文档

DeepSeek API 使用与 OpenAI 兼容的 API 格式。

**官方文档**: https://api-docs.deepseek.com/zh-cn/

## 基础配置

| 参数 | 值 |
|------|-----|
| base_url | `https://api.deepseek.com` |
| api_key | 在 [API Keys](https://platform.deepseek.com/api_keys) 页面申请 |

出于兼容性考虑，也可以使用 `https://api.deepseek.com/v1`（此处 v1 与模型版本无关）

## 模型

- **deepseek-chat** - DeepSeek-V3.2-Exp 非思考模式
- **deepseek-reasoner** - DeepSeek-V3.2-Exp 思考模式

## 调用示例

### curl

```bash
curl https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${DEEPSEEK_API_KEY}" \
  -d '{
    "model": "deepseek-chat",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Hello!"}
    ],
    "stream": false
  }'
```

### Python

```python
# 安装: pip3 install openai
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get('DEEPSEEK_API_KEY'),
    base_url="https://api.deepseek.com"
)

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "You are a helpful assistant"},
        {"role": "user", "content": "Hello"}
    ],
    stream=False
)

print(response.choices[0].message.content)
```

### Node.js

```javascript
// 安装: npm install openai
import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY,
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "deepseek-chat",
  });

  console.log(completion.choices[0].message.content);
}

main();
```

## 流式输出

将 `stream` 参数设置为 `true` 即可启用流式输出。

## 更多功能

完整文档请访问: https://api-docs.deepseek.com/zh-cn/

- 推理模型 (deepseek-reasoner)
- 多轮对话
- 对话前缀续写 (Beta)
- FIM 补全 (Beta)
- JSON Output
- Function Calling
- 上下文硬盘缓存
- Anthropic API 兼容
