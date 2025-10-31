# Level Fun陷阱

## 设计理念

**明显警告+致命后果，考验玩家是否好奇心害死猫**

Level Fun是"知道危险但还是想看"的设计。

---

## 三层警告系统

### 警告1：环境留言（Level1）

**Level1_CorridorExplore**

```markdown
你探索Level 1时，看到墙上的警告：

> ⚠️⚠️⚠️ 紧急警告 ⚠️⚠️⚠️
> 
> 如果看到：
> - 彩色气球
> - 派对音乐
> - "=)" 符号
> 
> 立即逃离！！！
> 
> Level Fun = 死亡陷阱！
> 一旦被抓住，72小时内转化！
> 无法逆转！！！
> 
> -- 幸存者紧急警告

【文本】
你记住了这个警告。

【变量设置】
knows_fun_warning = true
```

---

### 警告2：入口识别（Level2）

**Level2_FunEntrance**

```markdown
你在Level 2探索时，看到前方有扇门。

【视觉描述】
不是普通的门。

门框涂着明亮的红色、黄色、蓝色条纹。
就像马戏团的门。

门缝下飘出一个黄色气球，印着笑脸"=)"。

里面传来音乐——电子版的《生日快乐歌》。

【如果knows_fun_warning=true】
你想起那个警告：
"彩色气球=Level Fun=死亡"

【感觉】
你的本能在尖叫："不要靠近！"

但...你很好奇。

里面到底是什么？

【选择】
→ 推开门进入（危险！）
→ 透过门缝看看（稍微安全）
→ 立即离开这里（最安全）
```

---

### 选项A：进入（致命）

**LevelFun_Entrance**

```markdown
你推开门。

明亮。极度明亮。

彩色气球飘满天花板。
彩带、横幅、蛋糕、糖果。
墙上贴满笑脸贴纸。

一切看起来...友善？

然后你看到它们。

【Partygoers出现】
黄色人形。块状的腿。
手臂像面条，末端是齿状的嘴。
永恒的笑容（画上去的）。

"来参加派对吧！=)"

它们正在向你移动。

【紧急选择】
→ 立即逃回门口
→ 寻找其他出口
→ 与它们对话（好奇）
```

---

### 陷阱机制

**LevelFun_Trapped**

```markdown
你转身想逃——

门消失了。

你刚进来的门，不见了。

只剩下墙壁。

【绝望】
你被困在Level Fun了。

Partygoers在接近。

"一起玩游戏！=)"

【选择】
→ 寻找其他出口（困难）
→ 尝试Noclip逃脱（需高等级）
→ 接受命运（？）
```

---

### 逃脱判定

**LevelFun_Escape_Attempt**

```markdown
你在房间里疯狂寻找出口。

Partygoers在慢慢靠近（移动速度慢）。

【判定条件】

【如果noclip_level >= 6】
你感知到墙壁的"薄弱点"。

尝试Noclip——

【成功率50%】

成功 → LevelFun_Escape_Success
失败 → LevelFun_Caught
```

**LevelFun_Escape_Success**（极难）:

```markdown
你穿过墙壁！

视野闪烁——

你跌落在Level 1的地板上。

【成功逃脱】

你大口喘气。

太险了。你差点...

【变量设置】
- escaped_level_fun = true
- sanity -= 40（极度恐惧）
- stamina -= 50（精疲力尽）

【成就】
"好奇心害死猫（但你活下来了）"
```

---

### 被抓住（Game Over路线）

**LevelFun_Caught**

```markdown
Partygoer的手臂伸长，抓住了你。

齿口咬入皮肤。

剧痛——然后是...温暖？

【感染】
partygoer_infected = true

"欢迎参加派对！=)"

---

【转化倒计时开始】

（玩家还可以继续游戏，但有72小时限制）
```

---

### 转化过程（多节点）

**Day 1后 - Infection_Day1**

```markdown
你逃出了Level Fun（或被放出？）。

但伤口周围的皮肤...在变黄。

你试图清洗，但颜色不会消失。

【文本】
你闻到自己身上有甜腻的气味。

像蛋糕。

【选择】
→ 前往Level 4寻求帮助
→ 寻找传说中的治疗方法
→ 接受命运
```

**Day 3后 - Infection_Day3**

```markdown
你的手臂在变长。

皮肤完全变黄。

你不再感到饥饿或口渴。

【理智影响】
你的思维开始改变。

"派对...派对很好玩..."

不！你不该这么想！

【关键选择】
→ 喝下10瓶杏仁水（治疗尝试）
→ 放弃抵抗
```

**如果"喝杏仁水"**（传说治疗）:

```markdown
你喝下10瓶杏仁水。

身体开始剧烈反应。

呕吐。发烧。剧痛。

【判定】50%成功率

成功 → 感染清除，黄色褪去
失败 → 转化继续

【如果成功】
你醒来，皮肤恢复正常。

杏仁水...真的有效。

你活下来了。

【变量重置】
partygoer_infected = false
```

**Day 7后 - Transformation_Complete**（Game Over）:

```markdown
你站在Level Fun的门口。

身体完全是黄色。
手臂像面条。
末端是齿状的嘴。

你的脸...永恒的笑容。

"来参加派对吧！=)"

这不再是你的声音。

你成为了它们的一员。

**Game Over: Transformation**

Days Survived: [天数]
Ending: Partygoer

"好奇心最终吞噬了你。"
```

---

## 选项B：透过门缝看（安全）

**LevelFun_Peek**

```markdown
你蹲下，透过门缝往里看。

【描述】
派对房间。明亮的装饰。
桌上的蛋糕和糖果。

还有...那些黄色人形。

Partygoers。

它们在"跳舞"，僵硬地摇摆。

【文本】
其中一个转头，"看"向门口。

虽然它没有眼睛，但你感觉到——

它知道你在这里。

它开始向门口移动。

【紧急】
→ 立即后退离开
```

**LevelFun_Peek_Escape**:

```markdown
你后退50米，远离那扇门。

【安全】
Partygoer没有追出来。

但你看到了。你知道了。

Level Fun真的存在。
警告不是开玩笑。

【变量设置】
- peeked_level_fun = true
- sanity -= 10（恐惧）

【文本】
你永远不会进入那扇门。

永远。
```

---

## 选项C：立即离开（最安全）

**Level2_FunAvoid**

```markdown
你看到那扇彩色的门，想起警告。

不。

你转身离开。

好奇心可以杀死人。

【变量设置】
- avoided_level_fun = true
- sanity += 5（正确决策的安心）

【文本】
你做出了正确的选择。

生存比满足好奇心更重要。
```

---

## 为什么这样设计

### 充分警告

✓ 墙上留言提前警告  
✓ 入口特征明显（彩色、气球、音乐）  
✓ 玩家明知危险还要进 = 自己选择

### 不惩罚好奇

✓ 可以"透过门缝看"而不必进入  
✓ 即使进入,高等级Noclip可以逃脱  
✓ 即使被感染,杏仁水可能治愈

### 制造两难

```
好奇心 vs 安全

"里面到底是什么？"
"警告说很危险..."
"但我就看一眼..."
```

---

## 实现要点

### 变量跟踪

```javascript
// 警告系统
vars['knows_fun_warning'] = true

// 行为选择
vars['entered_level_fun'] = true
vars['peeked_level_fun'] = true
vars['avoided_level_fun'] = true

// 感染状态
vars['partygoer_infected'] = true
vars['infection_day'] = 1
```

### 倒计时机制

```javascript
// 每个节点检查感染
if (vars['partygoer_infected']) {
  vars['infection_day'] += 1
  
  if (vars['infection_day'] >= 7) {
    // 强制跳转到转化结局
  }
}
```

### 治疗判定

```javascript
// 使用10瓶杏仁水治疗
if (vars['almond_water_count'] >= 10) {
  随机判定(50%) → 成功/失败
}
```

