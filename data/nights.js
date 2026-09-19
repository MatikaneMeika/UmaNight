'use strict';
/* ============================================================
   UMA-NIGHT 七夜版 · 夜数据（角色B 独占文件）
   契约：work/00-总计划.md §3.1（字段不得删除/改名；可新增字段）
   数值来源：doc/游戏机制大纲.md v1.7 §10 节拍总表 + §3.4 参数表
             + game/night3-t1.html（T1 卡 v1.6，夜3 现值基底）
   文案来源：doc/游戏剧情大纲.md（日记全文、留言原文）
   —— 加载顺序：data/_sample.js → data/nights.js → data/meta.js → js/nfx.js
   —— at 一律 'H:MM'（游戏时钟）或 'post' / 'post+N'（白板对局结束后 N 秒）
   ============================================================ */

window.NIGHTS = [

/* ================= 夜 1 · 例行夜（否认阶段） =================
   v1.7 §10：日记#001 / 空板（旧划痕可近看）/ 手册"已读（3年前）" / 无残影 / 例行夜
   教程口径=回岗提示（v1.7 §6.5）：全程不出现"第一次/欢迎新员工"。
   【提案】槽位仅 A（例行夜最简）；A ai 3（T1 夜3 为 6，教程夜放缓）。
   【提案】曲单 3 首 [120,90,120]：仅 2 次归零（03:00 / 04:30），末曲播到天亮。 */
{
  id: 1,
  hourLen: 60,
  power: { start: 100, safeHalf: 60,
           drain: { base:.05, cam:.10, lock:.5, light:.1, switch:.15, renew:.5, afk:.5 } },
  slots: {
    A: { ai: 3, at: 60, path: ['hall','corrB','doorR'], sprintOnJukeDead: true }
  },
  board: { mode: 'none',            // 空板：旧笔迹、擦不净的划痕（残影层既有铺垫，NFX.ghostLayer 绘制）
           ghostOpacity: .05 },     // 【提案】1088 夜旧痕基底层
  juke: { start: '00:00', warn: 5, battery: { cap: 30, renew: 30 },   // v2.0 发条模型：开局自动播，续播=续 30s 电量，静音超 5s 余量窗=停机
          tracks: [ { name:'残响安可', len:120 },
                    { name:'星尘回廊', len:90 },
                    { name:'金属梦境', len:120 } ] },
  diary: { id: '#001', autoplayAt: '00:00', duration: 55,
           text: '嗒——训练日记，第一天。\n' +
                 '拿到担当了。她抱着一个人偶，站在训练场门口，声音很轻。\n' +
                 '管理员教了夜班操作。看监控、守门、点歌机响了按一下。电力别用完。\n' +
                 '我说以后穿玩偶服帮她发传单。她笑了。\n' +
                 '玩偶服应该很热吧。' },
  syslog: [ { at: '00:20', sys: '[记录] 《夜班操作手册》 状态：已读（最后阅读：3 年前 4/1）',
              note: null, caption: false } ],
           // 不主动弹窗，仅细心的玩家会发现——教程在骗你，日志在漏真话（v1.7 §6.5）
  /* 电话字幕通道已废弃（v1.7 §6.5 口径下教程埋点由手册日志+录音机承载）；字段按契约保留置空 */
  call: [],
  camStatic: [ 'plaza' ]   // S1：CAM7 三女神广场全夜常驻花屏（v1.9 仲裁定稿字段）
},

/* ================= 夜 2 · 登录残响（否认→怀疑） =================
   v1.7 §10：日记#017 / 03:30 浮现"你是谁"（无格子）/ [接入]+[自检] /
   CAM9 登录冻结 3 秒 / 03:30 梦境 −10% / B 上线
   曲单 120/85 三首（v1.7 §6/13.8）。归零点：03:00 / 04:25。
   注意：夜2 的 CAM9 冻结（她的登录残响）与 B 槽的观察冻结是两个系统（v1.7 §0 C5）。 */
{
  id: 2,
  hourLen: 60,
  power: { start: 100, safeHalf: 60,
           drain: { base:.05, cam:.10, lock:.5, light:.1, switch:.15, renew:.5, afk:.5 } },
  slots: {
    A: { ai: 4, at: 60,  path: ['hall','corrB','doorR'], sprintOnJukeDead: true },
    B: { ai: 3, at: 120, path: ['shop','gym','corrB','doorR'],
         bell: { every: [20, 32], roll: 2 } }        // 【提案】B 上线首夜 ai 放缓（夜3 起 4）
  },
  board: { mode: 'message', at: '03:30',
           message: '你是谁',                        // 大纲原文（她第一次试探）；无格子、无对局、无回写
           ghostOpacity: .06 },
  juke: { start: '00:00', warn: 5, battery: { cap: 30, renew: 30 },   // v2.0 发条模型：开局自动播，续播=续 30s 电量，静音超 5s 余量窗=停机
          tracks: [ { name:'残响安可', len:120 },
                    { name:'星尘回廊', len:85 },
                    { name:'金属梦境', len:85 } ] },
  diary: { id: '#017', autoplayAt: '00:00', duration: 55,
           text: '嗒——日记，第十七天。\n' +
                 '传单发了两小时，三斤汗。她递水过来，没说话。\n' +
                 '今天跑了倒数第二。到终点又多跑一圈，说还能跑。\n' +
                 '监控盯久了耐力会掉。不看的时候能回。得省着用。\n' +
                 '不能一直盯。得学会什么时候看，什么时候不看。' },
  syslog: [ { at: '03:30', sys: '[接入] 外部用户 ASTON_MACHAN · 03:30 接入 · 时长 4 分 12 秒',
              note: '白板上……多了一行不是你写的字。', caption: false },
              // B-24①：原 hints.open 叙事钩子改挂事件实际发生时（03:30 板上浮现「你是谁」的同分钟）
            { at: '03:35', sys: '[自检] 检测到未授权数据波动 · 来源：本进程',
              note: null, caption: false } ],
  cam9:  [ { at: '03:30', type: 'freeze', dur: 3 } ],
           // 画面冻结 3 秒 + 边缘极淡人影（她的登录残响）；无音效、无红点、不参与门边逻辑
  dream: [ { at: '03:30', dur: 2, stamina: -10 } ],
           // 全屏 2 秒碎影（握笔的手、车站钟、站台边缘）——他做梦的同一分钟，她在接入
  camStatic: [ 'plaza' ],   // S1：CAM7 常驻花屏（v1.9 仲裁定稿字段）
  hints: { open: '' }       // v2.0 批次5 B-24①：开局横幅通道停显（与 A-65 同轮），原句已迁 03:30 syslog note
},

/* ================= 夜 3 · 评估通道启用（怀疑阶段·三线重叠） =================
   参数=night3-t1.html T1 卡现值（总计划 §1 权威 3）+ v1.7 §3.4 参数表。
   三线重叠（v1.7 §6 原口径）在 v2.0 发条模型下不再于 03:00 成立（电量续点每 30s 均匀分布），白板 03:00 照旧；口径变更已登记 B-进度（B-22）。
   ai 字段（新增·信息性）=v1.7 §3.4 的 aiLevel（落子间隔 8−ai×0.3，供引擎/日志取用）。 */
{
  id: 3,
  hourLen: 60,
  power: { start: 100, safeHalf: 60,
           drain: { base:.05, cam:.10, lock:.5, light:.1, switch:.15, renew:.5, afk:.5 } },
  slots: {
    A: { ai: 6, at: 60,  path: ['hall','corrB','doorR'], sprintOnJukeDead: true },
    B: { ai: 4, at: 120, path: ['shop','gym','corrB','doorR'],
         bell: { every: [20, 32], roll: 2 } },
    C: { ai: 6, at: 120, fast: true, skipChance: .2, path: ['lib','pool','corrA','doorL'] }
  },
  board: { mode: 'game', at: '03:00',
           playerTimer: 8, oppInterval: 6.5, grace: 1.5, ai: 5,
           firstStone: 'random', blockChance: .5,
           message: '……是你', autoReply: '是。',
           ghostOpacity: .06, winPolicy: 'reeval' },
  juke: { start: '00:00', warn: 5, battery: { cap: 30, renew: 30 },   // v2.0 发条模型：开局自动播，续播=续 30s 电量，静音超 5s 余量窗=停机
          tracks: [ { name:'残响安可', len:120 },
                    { name:'星尘回廊', len:75 },
                    { name:'金属梦境', len:75 },
                    { name:'雨后的起跑线', len:75 } ] },   // 末曲=安可循环，05:30 起播到天亮
  diary: { id: '#049', autoplayAt: '00:00', duration: 55,
           text: '嗒——日记，第四十九天。\n' +
                 '正式签约。她递来一张传单，背面画了井字棋。\n' +
                 '白板上下了一盘。我在角落写了几个字。她也写了，折好放进包里。我问写了什么，她说秘密。\n' +
                 '点歌机红点闪的时候要按一下。不按会出事。监控切换要电，关掉不要。\n' +
                 '差不多就这些。' },
  syslog: [ { at: '03:00', sys: '[白板] 对局请求 · 先手已落定',
              note: '白板亮起，棋盘格和第一枚先手已经在了。', caption: false },
              // B-24①：原 hints.open 叙事钩子改挂事件实际发生时
            { at: 'post+8',  sys: '[比对] 白板留言笔迹 ↔ 附件#049 一致性 98%', note: null, caption: false },
            { at: 'post+25', sys: '[检索] 档案A 照片损坏（无底片）', note: null, caption: false } ],
  cam9:  [ { at: 'post+60', type: 'silhouette', dur: 2.5 } ],
           // v1.7 §5：对局结束起 60 秒内查看 CAM9 可见 2-3 秒侧影（奖励看监控的玩家）
  scriptedStamina: [ { at: 'post', delta: -5, reason: '注视留言' } ],
  camStatic: [ 'plaza' ],   // S1：CAM7 常驻花屏（v1.9 仲裁定稿字段）
  hints: { open: '' }       // v2.0 批次5 B-24①：开局横幅通道停显（与 A-65 同轮），原句已迁 03:00 syslog；board 提示（计时）板UI已实时显示，删（B-24③）
},

/* ================= 夜 4 · D 上线（怀疑阶段） =================
   v1.7 §10：[参数]+首条手写备注+[日志]；升压归因=检测到未授权检索→D 上线（C 保持）。
   blockChance .65；playerTimer 7 / oppInterval 5（ai 10）。
   cornerBias：她的首个非封堵落子偏置角落——
   日记#049『我在角落写了几个字』的演出回响；与 §3.4『首子随机』并存（§3.1 规则3）。 */
{
  id: 4,
  hourLen: 60,
  power: { start: 100, safeHalf: 60,
           drain: { base:.05, cam:.10, lock:.5, light:.1, switch:.15, renew:.5, afk:.5 } },
  slots: {
    A: { ai: 6, at: 60,  path: ['hall','corrB','doorR'], sprintOnJukeDead: true },
    B: { ai: 4, at: 120, path: ['shop','gym','corrB','doorR'],
         bell: { every: [20, 32], roll: 2 } },
    C: { ai: 6, at: 120, fast: true, skipChance: .2, path: ['lib','pool','corrA','doorL'] },
    D: { ai: 0, at: 120, path: ['plaza','corrA','doorL'], edgeKill: 1.5, drainMul: 1.5 }  // 契约示例原值
  },
  board: { mode: 'game', at: '03:00',
           playerTimer: 7, oppInterval: 5, grace: 1.5, ai: 10,
           firstStone: 'random', blockChance: .65,
           cornerBias: true,                            // 首个非封堵落子偏置角落（引擎只读本键；firstFreeBias 死字段已删·B-24②）
           message: '左手会先动', autoReply: '谁。',
           ghostOpacity: .06, winPolicy: 'reeval' },
  juke: { start: '00:00', warn: 5, battery: { cap: 30, renew: 30 },   // v2.0 发条模型：开局自动播，续播=续 30s 电量，静音超 5s 余量窗=停机
          tracks: [ { name:'残响安可', len:120 },
                    { name:'星尘回廊', len:80 },
                    { name:'金属梦境', len:80 },
                    { name:'雨后的起跑线', len:80 } ] },   // 【待定】v1.7 未给夜4 曲长，B 提案
  diary: { id: '#078', autoplayAt: '00:00', duration: 60,
           text: '嗒——日记，第七十八天。\n' +
                 '她问我的梦想。我说看到她成为世界级吉祥物。她说那她的梦想就是和我一起。\n' +
                 '我没接话。她跑了。我应该在后面喊点什么的。但我没有。\n' +
                 'D 那个门边停得特别短，门锁耗电也快。灯只是照明，挡不住。\n' +
                 '我把路线背了一遍。她要是知道，肯定要说我认真。' },
  syslog: [ { at: '03:00', sys: '[白板] 对局请求 · 首子偏置：角落',
              note: '白板亮了。她的先手落在角落——像被人教过那样。', caption: false },
              // B-24①：原 hints.open 叙事钩子改挂事件实际发生时
            { at: 'post+8',  sys: '[参数] 左手延迟 −0.03s · 来源：用户习惯数据 · 用户：不存在',
              note: '……左手？我没有左手。', caption: false },
              // TRAINER-00 首条手写备注（v1.7 §6.4 原文）
            { at: 'post+30', sys: '[日志] 4/21 值班记录→已损坏', note: null, caption: false } ],
  cam9:  [ { at: 'post+60', type: 'silhouette', dur: 2.5 } ],
  camStatic: [ 'plaza' ],   // S1：CAM7 常驻花屏（v1.9 仲裁定稿字段）
  hints: { open: '' }       // v2.0 批次5 B-24①：开局横幅通道停显（与 A-65 同轮），原句已迁 03:00 syslog；board 提示删（B-24③）
},

/* ================= 夜 5 · 确认（他叫出了她的名字） =================
   v1.7 §10：[权限]/[进程]/[评估]；升压归因=回写「麻酱。」→ 自主活动超基线。
   blockChance .8；playerTimer 6 / oppInterval 3.5（ai 15）。
   槽位 ai 为 B 提案（夜4→5 升压），夜6 回落复刻夜3 节奏。 */
{
  id: 5,
  hourLen: 60,
  power: { start: 100, safeHalf: 60,
           drain: { base:.05, cam:.10, lock:.5, light:.1, switch:.15, renew:.5, afk:.5 } },
  slots: {
    A: { ai: 7, at: 60,  path: ['hall','corrB','doorR'], sprintOnJukeDead: true },
    B: { ai: 5, at: 120, path: ['shop','gym','corrB','doorR'],
         bell: { every: [20, 32], roll: 2 } },
    C: { ai: 7, at: 120, fast: true, skipChance: .2, path: ['lib','pool','corrA','doorL'] },
    D: { ai: 4, at: 120, path: ['plaza','corrA','doorL'], edgeKill: 1.5, drainMul: 1.5 }
  },
  board: { mode: 'game', at: '03:00',
           playerTimer: 6, oppInterval: 3.5, grace: 1.5, ai: 15,
           firstStone: 'random', blockChance: .8,
           cornerBias: true,                            // 角落偏置（同夜4；firstFreeBias 死字段已删·B-24②）
           message: '你只要还在就行', autoReply: '麻酱。',
           ghostOpacity: .06, winPolicy: 'reeval' },
  juke: { start: '00:00', warn: 5, battery: { cap: 30, renew: 30 },   // v2.0 发条模型：开局自动播，续播=续 30s 电量，静音超 5s 余量窗=停机
          tracks: [ { name:'残响安可', len:120 },
                    { name:'星尘回廊', len:60 },
                    { name:'金属梦境', len:60 },
                    { name:'雨后的起跑线', len:60 } ] },   // 末曲归零恰落 06:00，按边缘规则豁免（v1.7 §6）
  diary: { id: '#091', autoplayAt: '00:00', duration: 65,
           text: '嗒——日记，第九十一天。\n' +
                 '她说明年春天要去中京。高松宫纪念。短途的，1200 米。她说她想去。\n' +
                 '我说好。我陪你去。\n' +
                 '她走后我把传单翻了一遍。每张背面都有字。最后一张写着：我的梦想是自己的了，所以你也要有自己的。\n' +
                 '……我是不是写太多了。\n' +
                 '切出去的话电会一直掉。断电了也别慌，撑一会儿就行。' },
  syslog: [ { at: '03:00', sys: '[白板] 对局请求 · 先手：随机落定', note: null, caption: false },
              // B-24①：原 hints.open 为纯过程描述无叙事钩子，仅留系统登记
            { at: 'post+8',  sys: '[权限] 账号「夜班训练员」：无此账号', note: null, caption: false },
            { at: 'post+16', sys: '[进程] 本进程 = TRAINER-00 · 残留数据',
              note: 'TRAINER-00……我？', caption: false },
            { at: 'post+30', sys: '[评估] 自主活动频率超基线 → 威胁等级↑', note: null, caption: false } ],
  cam9:  [ { at: 'post+60', type: 'silhouette', dur: 2.5 } ],
  camStatic: [ 'plaza' ],   // S1：CAM7 常驻花屏（v1.9 仲裁定稿字段）
  hints: { open: '' }       // v2.0 批次5 B-24①：开局横幅通道停显（与 A-65 同轮）；原句纯过程描述，不迁；board 提示删（B-24③）
},

/* ================= 夜 6 · 接受（第一天的节奏） =================
   v1.7 §3.4：参数完整复刻夜3（8s/6.5s），但 blockChance .9——「她这次不让我赢了」；
   firstStone center（指画棋盘 + 中央首子）；§10：[比对]100% + 备注增多 + 残影停留更久。
   槽位回落至夜3 量级 + D 保持在场（B 提案）。 */
{
  id: 6,
  hourLen: 60,
  power: { start: 100, safeHalf: 60,
           drain: { base:.05, cam:.10, lock:.5, light:.1, switch:.15, renew:.5, afk:.5 } },
  slots: {
    A: { ai: 6, at: 60,  path: ['hall','corrB','doorR'], sprintOnJukeDead: true },
    B: { ai: 4, at: 120, path: ['shop','gym','corrB','doorR'],
         bell: { every: [20, 32], roll: 2 } },
    C: { ai: 6, at: 120, fast: true, skipChance: .2, path: ['lib','pool','corrA','doorL'] },
    D: { ai: 2, at: 120, path: ['plaza','corrA','doorL'], edgeKill: 1.5, drainMul: 1.5 }
  },
  board: { mode: 'game', at: '03:00',
           playerTimer: 8, oppInterval: 6.5, grace: 1.5, ai: 5,
           firstStone: 'center', blockChance: .9,
           message: '该你了', autoReply: '我没忘。',
           ghostOpacity: .07, winPolicy: 'reeval' },
  juke: { start: '00:00', warn: 5, battery: { cap: 30, renew: 30 },   // v2.0 发条模型：开局自动播，续播=续 30s 电量，静音超 5s 余量窗=停机
          tracks: [ { name:'残响安可', len:120 },
                    { name:'星尘回廊', len:70 },
                    { name:'金属梦境', len:70 },
                    { name:'雨后的起跑线', len:70 } ] },   // 120/70 四首（v1.7 §6）
  diary: { id: '#092', autoplayAt: '00:00', duration: 65,
           text: '嗒——日记，第九十二天。\n' +
                 '今天她正式模拟赛。我答应会去。\n' +
                 '出门的时候有点赶。玩偶头套挡视野，走路不太方便。我在车站前下了车，看了一眼表。\n' +
                 '还有时间。应该来得及。\n' +
                 '我跑起来的时候没看清左边。\n' +
                 '——日记到这里断了。' },
  syslog: [ { at: '03:00', sys: '[白板] 对局请求 · 首子：中央',
              note: '白板又亮了——这次的格子像是用手指一笔一笔画出来的。', caption: false },
              // B-24①：原 hints.open 叙事钩子改挂事件实际发生时
            { at: 'post+8',  sys: '[比对] 附件#092 时间线 ↔ 本进程操作日志 重合率 100%',
              note: '全部……对上了。', caption: false },
            { at: 'post+25', sys: '[归档] 例行归档窗口：开启',
              note: '#092 之后就停了。然后是——', caption: false },
            { at: '05:00', sys: '[例行] 归档窗口巡检：正常', note: null, caption: false } ],
  cam9:  [ { at: 'post+60', type: 'silhouette', dur: 4.5 } ],   // 残影停留更久（v1.7 §10 夜6）
  camStatic: [ 'plaza' ],   // S1：CAM7 常驻花屏（v1.9 仲裁定稿字段）
  hints: { open: '' }       // v2.0 批次5 B-24①：开局横幅通道停显（与 A-65 同轮），原句已迁 03:00 syslog；board 提示删（B-24③）
},

/* ================= 夜 7 · 最终评估（放手） =================
   v1.7 §4：数值——hourLen 70 / power 80 / B/C/D ai 16-20 / 续播窗口 2s；
   融合=A 接入白板评估子系统（C3 修正）：落子者仍是 ASTON_MACHAN（blockChance 1.0 强制平局）；
   CAM7 全夜雪花（camFx）、落子噪点（noiseFx）、03:00 笑脸在雪花中自行画完（smiley）。
   v1.7 §4 续播时序（02:43/03:30/…）随发条模型作废：改为电量续点每 30s 一次（420s 夜≈14 次），曲单计时依旧、穷尽循环回第一首。
   板前淡字「跟平时一样，就好」=board.message（§3.5 埋点4 演出序列：笑脸→格子→中央首子→淡字）；
   夜7 无 autoReply——平局后进入真结局/标准结局流程（§8）。
   diary：乱码三行（1095 为唯一不被噪声吞没的数字）→ #001 播至「……声音很轻。」自停（§6.1）。 */
{
  id: 7,
  hourLen: 70,
  power: { start: 80, safeHalf: 60,
           drain: { base:.05, cam:.10, lock:.5, light:.1, switch:.15, renew:.5, afk:.5 } },
  slots: {
    A: { ai: 18, at: 60,  path: ['hall','corrB','doorR'], sprintOnJukeDead: true },
    B: { ai: 16, at: 120, path: ['shop','gym','corrB','doorR'],
         bell: { every: [20, 32], roll: 2 } },
    C: { ai: 18, at: 120, fast: true, skipChance: .2, path: ['lib','pool','corrA','doorL'] },
    D: { ai: 20, at: 120, path: ['plaza','corrA','doorL'], edgeKill: 1.5, drainMul: 1.5 }
  },
  board: { mode: 'game', at: '03:00',
           playerTimer: 5, oppInterval: 2, grace: 1.5, ai: 20,
           firstStone: 'center', blockChance: 1.0,
           preFaint: '跟平时一样，就好',          // v1.7 §3.5 埋点4 板前淡字（A-40：与局后留言分离，各归各的时序）
           message: '跟平时一样，就好',
           ghostOpacity: .08, winPolicy: 'instant',
           noiseFx: true, smiley: true },
  juke: { start: '00:00', warn: 3, battery: { cap: 30, renew: 30 }, finale: true,   // v2.0 发条模型；夜7 余量窗 3s（用户裁决）
          tracks: [ { name:'残响安可', len:120 },
                    { name:'星尘回廊', len:55 },
                    { name:'金属梦境', len:55 },
                    { name:'雨后的起跑线', len:55 },
                    { name:'云上圆舞曲', len:55 },
                    { name:'长长的安可', len:999, finale: true } ] },
                    // 谢幕曲 05:51 起播，无归零点——持续播入终局演出与制作名单（v1.7 §6）
  diary: { id: '#001', autoplayAt: '00:00', duration: 45,
           text: '嗒——训练日记，第一天。\n' +
                 '拿到担当了。她抱着一个人偶，站在训练场门口，声音很轻。\n' +
                 '管理员教了夜班操作。看监控、守门、点歌机响了按一下。电力别用完。\n' +
                 '我说以后穿玩偶服帮她发传单。她笑了。\n' +
                 '玩偶服应该很热吧。',
           corrupt: [ '[████] TRAINER-00 ██████ 1095 ██████',
                      '噪#@＾＊1095＊＆j重#置...../▓▓▓',
                      '[████] ██ 中断 ██ 挂起 ██' ],
           stopAt: '她抱着一个人偶，站在训练场门口，声音很轻。' },
           // 归档条目名见 META.corruptDiaryTitle《[损坏] ▓▓1095▓▓》（v1.7 §6.2）
  syslog: [ { at: '03:00', sys: '[白板] 检测到未授权笔迹 · 持续写入中',
              note: '白板上，有什么正在自己画完。', caption: false },
              // B-24①：原 hints.open 叙事钩子改挂事件实际发生时（「雪花里的 CAM7 暗了」一半由 META.camStaticHint.n7 承载）
            { at: '02:40', sys: '[白板] 累计对局 1095 · 平局 1095 · 胜 0 · 负 0', note: null, caption: true },
            { at: '02:46', sys: '[历史] 模拟对手 · 1088 夜前 · 基准：已故训练员战术数据', note: null, caption: false },
            { at: '02:52', sys: '[接入方] 现实侧连续接入 1095 夜 · 训练负荷异常', note: null, caption: false },
            { at: '03:20', sys: '[留言] 第 1095 天。麻酱今天也来了。', note: '该下班了。', caption: true } ],
  cam9:  [ { at: '04:00', type: 'frontal', dur: 4 } ],
  camStatic: [ 'plaza' ],   // S1 常驻花屏；夜7 加剧由 A-28 引擎逐夜强度常量（原 camFx 按 v1.9 仲裁并入 camStatic，避免重复计）
  hints: { open: '' }       // v2.0 批次5 B-24①：开局横幅通道停显（与 A-65 同轮），原句已迁 03:00 syslog；board 提示删（B-24③）
}
];
