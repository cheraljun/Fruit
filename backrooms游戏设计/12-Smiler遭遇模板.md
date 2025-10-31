# Smiler遭遇模板

## 设计理念

**3个选择，各有后果，没有完美解**

Smiler遭遇是教学型威胁，教玩家"用光对抗"。

---

## 节点流程

### Level0_SmilerEncounter（遭遇）

```markdown
你转过弯角。

前方走廊尽头，完全的黑暗。

然后你看到了——

一对发光的眼睛。椭圆形的。
下方是一排牙齿组成的笑容。

它在盯着你。

你的手电筒在手里。电量：60%

【选择】
→ 打开手电筒照向它
→ 缓慢后退，不移开视线
→ 转身全速奔跑
```

---

## 三个选择的后果

### 选项A：用手电筒（正确）

**Level0_SmilerDefeat**

```markdown
你打开手电筒，光束直射那个笑容。

Smiler的眼睛和笑容骤然熄灭。

它...消失了。

你听到空气中传来微弱的嘶声，然后是寂静。

【变量设置】
- defeated_smiler = true
- flashlight_battery -= 10%
- knows_smiler_weakness = true

【学习】
"光线可以驱散Smiler。"

【理智影响】-5（恐惧） +5（成功） = 0
```

---

### 选项B：缓慢后退（中等）

**Level0_SmilerRetreat**

```markdown
你保持眼神接触，慢慢后退。

Smiler没有移动，只是盯着你。

一步...两步...三步...

你转过拐角，脱离它的视线。

你加速离开，不敢回头。

【变量设置】
- escaped_smiler = true
- stamina -= 15（紧张消耗）
- sanity -= 10（恐惧）

【文本】
你的心跳还在加速。

那个笑容...你会记住的。
```

---

### 选项C：奔跑（危险）

**Level0_SmilerChase**

```markdown
你转身就跑。

身后传来...什么声音？

你不敢回头。

全速冲刺。

拐角。走廊。又一个拐角。

【判定】体力检定

【如果体力>50】
  → Level0_SmilerEscape（成功逃脱）

【如果体力<50】
  → Level0_SmilerCaught（被追上）
```

**Level0_SmilerEscape**:
```markdown
你跑了5分钟，终于停下。

回头看，什么都没有。

你...逃掉了？

【变量设置】
- escaped_smiler_by_running = true
- stamina -= 30（剧烈消耗）
- sanity -= 20（恐惧+不确定）

【文本】
但你不知道那是什么。

也不知道下次怎么对付它。
```

**Level0_SmilerCaught**:
```markdown
你的体力耗尽，速度变慢。

那个笑容...在你面前。

它更近了。

眼睛发出幽绿色的光。牙齿闪烁。

你感到极度恐惧，脑海一片空白——

然后...它没有攻击你。

它只是盯着你。

吸食你的恐惧。

【变量设置】
- caught_by_smiler = true
- sanity -= 30（理智暴跌）
- stamina = 10（几乎耗尽）

【文本】
几分钟后，它消失了。

你瘫坐在地上，浑身颤抖。

【风险】
如果理智<20，可能精神崩溃。
```

---

## 为什么这样设计

### 教学功能

- **选项A** - 教玩家"用光对抗Smiler"
- **选项B** - 教玩家"保持冷静可以脱身"
- **选项C** - 教玩家"盲目逃跑很危险"

### 知识积累

```javascript
// 第一次遭遇后设置
if (defeated_smiler || escaped_smiler) {
  vars['has_seen_smiler'] = true
}

// 第二次遭遇时，玩家更有准备
if (vars['knows_smiler_weakness']) {
  // 自动提示："你知道手电筒有效"
}
```

### 重玩差异

**第一次玩**:
- 不知道选哪个
- 可能选C导致体力耗尽
- 学到教训

**第二次玩**:
- "我知道要用手电筒！"
- 从容应对
- 成就感

---

## 第二次Smiler遭遇

### Level1_SmilerAgain

```markdown
【如果has_seen_smiler=true】

你看到那熟悉的笑容——Smiler。

这次你知道怎么做了。

【选项】
→ 立即用手电筒（快速解决）
→ 缓慢后退（保存电量）
→ 尝试与它对话（实验选项）

---

【如果has_seen_smiler=false】
（显示第一次遭遇的选项）
```

**新增"对话"选项**（实验）:

```markdown
你尝试说话："你...能听懂我吗？"

Smiler没有反应。

只是盯着你。笑着。

什么都没发生。

你慢慢后退离开。

【变量设置】
- tried_talk_to_smiler = true
- sanity -= 5（无效尝试的失望）

【文本】
看来Smiler不能交流。

它只是...存在。
```

---

## 变体：Greater Smiler

### Level5_GreaterSmiler

```markdown
你看到一个巨大的笑容。

2米宽。

不是Lesser Smiler。这是...Greater。

【警告】
你的手电筒光线突然变暗。

Greater Smiler吸收光线。

【选择】
→ 尝试用手电筒（无效）
→ 立即逃跑（唯一选择）
→ 站着不动（？）
```

**如果选"用手电筒"**:
```markdown
你打开手电筒——

光线被吸收。笑容更亮了。

它在接近。

【强制】
你必须逃跑！

→ 自动跳转到逃跑节点
```

**如果选"逃跑"**:
```markdown
你转身就跑。

不要回头。不要回头。不要——

你回头了。

那个笑容占据了整个走廊。

但你还在跑。

【判定】体力>60 → 成功
       体力<60 → Game Over
```

---

## 实现要点

### 变量设计

```javascript
// 记录遭遇
vars['has_seen_smiler'] = true
vars['defeated_smiler'] = true
vars['knows_smiler_weakness'] = true

// 记录结果
vars['smiler_encounter_count'] += 1
```

### 后续影响

```javascript
// 在Level 4阅览室
if (vars['defeated_smiler']) {
  // 显示额外选项："写下对抗Smiler的建议"
  // 留言给其他幸存者
}
```

### 难度曲线

1. **第一次**: Lesser Smiler，可以驱散
2. **第二次**: Lesser Smiler，更轻松
3. **第三次**: Greater Smiler，必须逃跑
4. **第四次**: 多个Smilers，考验资源管理

---

## 文案技巧

### 氛围营造

```markdown
❌ 不好:
"你看到一个Smiler。你有3个选择。"

✓ 更好:
"黑暗中，那个笑容在盯着你。
发光的牙齿。椭圆形的眼睛。
你的呼吸在颤抖。"
```

### 选项文案

```markdown
❌ 不好:
"→ 选项A: 使用手电筒"

✓ 更好:
"→ 打开手电筒照向它"
（更有画面感，更像动作）
```

### 后果描述

```markdown
✓ 强调感受:
"你的手在颤抖，但光束稳定地照向那个笑容。
Smiler的眼睛熄灭。你...成功了。"

（不只是"理智-5"，而是描述情感）
```

