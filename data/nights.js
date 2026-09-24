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
   v1.7 §10：日记#001 / 空板（旧划痕可近看）/ 手册"已读（3年前）" / 例行夜
   教程口径=回岗提示（v1.7 §6.5）：全程不出现"第一次/欢迎新员工"。
   批次10 D42（用户指令改版）：**双敌 A+C**（「第一夜就有两个敌方单位」；C 去 fast/skipChance
   特性=裁决⑦，夜2 起解锁）；ai 全线下调至 2（「移动概率、速度…下调」）——旧口径
   「槽位仅 A（例行夜最简）」作废。夜1 另下放 D巡门拜访 1 次（visits；单元D 擦除事件，与麻酱三通道无关——宪章 S2）
   + edge 容忍线收紧 + plazaWatch 起手值。
   【提案】曲单 3 首 [120,90,120]：仅 2 次归零（03:00 / 04:30），末曲播到天亮。 */
{
  id: 1,
  hourLen: 60,
  power: { start: 100, safeHalf: 60,
           drain: { base:.05, cam:.10, lock:.40, light:.1, switch:.15, renew:0, afk:0 } },   // v2.0 批次5：失焦挂起已移除（B-29）；lock .5→.40=B-57/D45-2 夜7 定向加宽（七夜同改，用户四选一仅此一项；base/cam/light/switch/renew/afk 不动）
  slots: {
    A: { ai: 2, at: 30,  path: ['hall','corrB','doorR'], sprintOnJukeDead: true },   // B-48/D42：ai 3→2（速度/移动概率下调）。B-65 豁免注见下行。B-72/批次22：at 60→30（01:00→00:30 触下限）
    C: { ai: 2, at: 90,  path: ['lib','pool','gymn','corrA','doorL'], roam: { ivMul: .55, pAdd: 8 }, corridorAt: '03:39' }   // B-65/批次17（↔A-125）：roam=D55 默认案；corridorAt=现版本该槽首入走廊中位数（被动基线 200 局随机取样，全表+口径见 B-进度 批次17 与 xlsx 附注）；path 只在走廊前加房（gymn=CAM6），corrA→doorL 末段逐字未动。夜1 C 另保留裁决⑦无 fast/skipChance；激活口径 02:30→01:30（B-72 整体提前一游戏小时）。
    // 🔴 槽A 全系豁免游走供值：A 绑点歌机（播放中整段冻结，移动仅随停机冲刺链=直接刷走廊、照旧），
    //    改 path 会改变现网冲刺落点（idx=min(1,len-2)），本批 A 行零动。
  },
  board: { mode: 'none',            // 空板：旧笔迹、擦不净的划痕（残影层既有铺垫，NFX.ghostLayer 绘制）
           ghostOpacity: .05 },     // 【提案】1088 夜旧痕基底层
  juke: { start: '00:00', warn: 5, battery: { cap: 30, renew: 10 }, staCost: 10,   // B-44（D39 终值）：续电=+10s 电量（累加封顶 cap·A-88）·耗体力 10·**耗电力 0（B-46：用户指令取消点击耗电）**——A-88 累加语义下 cap=30 为真上限（余量 ≥20 时点击浪费，合理节奏 ≈20-25s 一下、整夜 14-18 次）；静音超 5s 余量窗=停机
          tracks: [ { name:'残响安可', len:120 },
                    { name:'星尘回廊', len:90 },
                    { name:'金属梦境', len:120 } ] },
  diary: { id: '#001', autoplayAt: '00:00', duration: 65, ruleAt: [3],   // D44补裁2（审查位直改·用户令）：规则教学行号1-based，答录机/记录页红字。批次23 B23：ruleAt 维持 [3]（红字=新第3行夜班句）。
           // B23（09-23 用户手打覆盖·审读版 W-150 斜体三行原文搬运）：原第3行（看监控/守门/按一下/电别用完 版）整行替换为三新行，其后两行逐字保留=7 行新结构；
           // duration 55→65（行数 5→7 膨胀，按 1 行≈8-10s 既有口径 +10s，实算登记 B-进度）。
           text: '——训练日记，第一天。\n' +
                 '接到担当了。她抱着一个人偶，站在训练场门口，声音很轻。\n' +
                 '今晚要负责夜班，就像往常一样看好监控和门，点歌机不能停\n' +
                 '哦对了，窗边的那个孩子怕黑。\n' +
                 '。。。\n' +
                 '我说以后穿玩偶服帮她发传单。她笑了。\n' +
                 '玩偶服应该很热吧。' },
  syslog: [ { at: '00:20', sys: '[记录] 《夜班操作手册》 状态：已读（最后阅读：3 年前 4/1）',
              note: null, caption: false } ],
           // 不主动弹窗，仅细心的玩家会发现——教程在骗你，日志在漏真话（v1.7 §6.5）
  /* 电话字幕通道已废弃（v1.7 §6.5 口径下教程埋点由手册日志+录音机承载）；字段按契约保留置空 */
  call: [],
  // B-48/D42（批次10）· 名称按批次14 S2 修订：D巡门拜访下放夜1（单元D 擦除事件，与麻酱三通道无关——宪章 S2）。
  // 02:50=夜1 唯一安全窗（syslog 仅 00:20、cam9 残影 03:40 起〔批次23 注：本夜 cam9 已整段删除，该避让约束随废〕、白板 mode:'none'——原「避 02:40-03:20」
  // 约束是夜5-7 syslog 群的事，夜1 无该窗占用，B-50 断言已核）。
  visits: { count: 1, at: ['02:50'], react: 2.5 },   // 结构同 B-39 口径；跳脸扣一半耐力+5 电（引擎结算·非致死）
  plazaWatch: 10,   // B-48/A-95：CAM7 广场连续停留 ≥10s → 关监控+抖动标题「你 *被发现了**」→ D 跳脸（夜1 最松档）
  edge: { giveUp: 2, backCd: 12, retreatCd: 30 },    // B-48/D42：仅前两夜下调（3/10/25→2/12/30）；t/knock 留引擎默认。giveUp=2 自批次16 B-64 起全七夜拉平，backCd/retreatCd 收紧仍只此两夜
  winE: { quota: { min: 3, max: 7 } },   // B-67/批次18（↔A-128）：窗户敌登场次数带 夜1-3=[3,7]（用户原话「前几晚不少于3不超过7」）；pSeq/coolSeq 不分夜=不供值、走引擎缺省（.30→.07 单调递减 / 60→30 递减，分夜无设计必要，理由登记 B-进度）；lateAt/roam/nFrom 共用 WIN_E 缺省。⚠️ 登场夜自本批起 1-7 全夜（nFrom=1 引擎侧），夜1 教学夜加 E 的余量带复测见 B-67
  // 批次23 B23（09-23 用户手打覆盖）：本夜 cam9 数组整段删除（原 B-44↔A-88「后半场她登场 3 次=03:40/04:50/05:40」随改制作废）——
  // 麻酱登场改制为夜6 玩偶服单闪一处；温柔红线不变：无音效、无红点、不参与门边逻辑。
  camStatic: [ 'plaza' ]   // S1：CAM7 三女神广场全夜常驻花屏（v1.9 仲裁定稿字段）
},

/* ================= 夜 2 · 登录残响（否认→怀疑） =================
   v1.7 §10：日记#017 / 03:30 浮现"你是谁"（无格子）/ [接入]+[自检] /
   CAM9 登录冻结 3 秒（批次23 注：本夜 cam9 已整段删除）/ 03:30 梦境 −10%
   批次10 D42（用户指令改版）：**四槽全员就位**（「第二晚开始全部敌方单位就位」；
   D 由夜4 提前至此，C 解锁 fast/skipChance 特性）——旧口径「B 上线」作废。
   曲单 120/85 三首（v1.7 §6/13.8）。归零点：03:00 / 04:25。
   批次23 现状注记（09-23 用户手打覆盖）：夜2 cam9 字段已删（残影→夜6 玩偶服单闪），
   v1.7 §0 C5「CAM9 冻结 vs B 槽观察冻结」两系统之辨随之归档。 */
{
  id: 2,
  hourLen: 60,
  power: { start: 100, safeHalf: 60,
           drain: { base:.05, cam:.10, lock:.40, light:.1, switch:.15, renew:0, afk:0 } },   // v2.0 批次5：失焦挂起已移除（B-29）；lock .5→.40=B-57/D45-2 夜7 定向加宽（七夜同改，用户四选一仅此一项；base/cam/light/switch/renew/afk 不动）
  slots: {   // B-48/D42：四槽全员（用户「第二晚开始全部敌方单位就位」）；数值=审查位提案值，B-51 推演 ±1 内定稿
    A: { ai: 3, at: 30,  path: ['hall','corrB','doorR'], sprintOnJukeDead: true },   // B-72/批次22：at 60→30（01:00→00:30 触下限）
    B: { ai: 2, at: 90,  path: ['shop','gym','hall','corrB','doorR'],
         bell: { every: [20, 32], roll: 2 }, roam: { ivMul: .55, pAdd: 8 }, corridorAt: '03:39' },        // 02:30→01:30 激活（B-72 整体提前一游戏小时；原「B 上线首夜放缓」随全员就位重排）。B-65 游走层↔A-125（口径注见夜1 槽C，下同）
    C: { ai: 3, at: 60,  fast: true, skipChance: .2, path: ['lib','pool','gymn','corrA','doorL'], roam: { ivMul: .55, pAdd: 8 }, corridorAt: '02:39' },   // 夜2 起解锁跳区特性（裁决⑦）；B-65 游走层；B-72：at 120→60
    D: { ai: 1, at: 120, path: ['plaza','roof','lib','corrA','doorL'], edgeKill: 2.5, drainMul: 1.25, roam: { ivMul: .55, pAdd: 8 }, corridorAt: '04:45' }   // D 由夜4 提前；天台新线首装（roof 插在 corrA 前=同侧断言不破）；03:00→02:00 激活（B-72）当夜仍最晚压轴、与 C 压迫间隔 1h→30min；B-65 游走层——本槽基线 200 局仅 114 局入走廊（ai1 慢骰），corridorAt=入者中位，尾部 43%「整夜不进」在新机制下收敛为 04:45 卡点登场（B-进度备案）
  },
  board: { mode: 'message', at: '03:30',
           message: '你是谁？',                       // 大纲原文（她第一次试探）；无格子、无对局、无回写（D44/W-50 补问号）
           ghostOpacity: .06 },
  juke: { start: '00:00', warn: 5, battery: { cap: 30, renew: 10 }, staCost: 10,   // B-44（D39 终值）：续电=+10s 电量（累加封顶 cap·A-88）·耗体力 10·**耗电力 0（B-46：用户指令取消点击耗电）**——A-88 累加语义下 cap=30 为真上限（余量 ≥20 时点击浪费，合理节奏 ≈20-25s 一下、整夜 14-18 次）；静音超 5s 余量窗=停机
          tracks: [ { name:'残响安可', len:120 },
                    { name:'星尘回廊', len:85 },
                    { name:'金属梦境', len:85 } ] },
  diary: { id: '#017', autoplayAt: '00:00', duration: 55, ruleAt: [4],   // D44补裁2（审查位直改·用户令）：规则教学行号1-based，答录机/记录页红字。批次23：ruleAt [4] 不动。
           text: '——日记，第十七天。\n' +
                 '传单发了两小时，感觉流了有三斤汗。她递水过来，没说话。\n' +
                 '今天她状态不好，跑了倒数第二。到终点又多跑一圈，说还能跑。\n' +
                 '他们说看得太久会累。——但是今天的我不想移开视线。\n' +
                 '最好还是量力而行。' },
                 // 批次23 B23（09-23 用户手打覆盖·审读版 W-151 斜体行原文搬运）：第2行加「有」字、第4行整换；用户稿五句=终版（独立末行「量力而行」）口径不变；
                 // 原「体力」名词豁免登记（旧第4行「盯着看会消耗体力」口语域反查标免）随新字面不再含「体力」而**作废**。
  syslog: [ { at: '03:30', sys: '[接入] 外部用户 ASTON_MACHAN · 03:30 接入 · 时长 4 分 12 秒',
              note: '白板上……多了一行字。', beat: '不是你写的字', caption: false },
              // 批次23 B23（09-23 用户手打覆盖·审读版 W-161）：B-68③（批次19 · 09-21 直令换句+beat 置 null）被本轮直令覆盖——
              //   note/beat 即上行回退后的两句（8 字闸不破）。🔴 只改夜2 这条不变：
              //   夜7 03:00『白板上，有什么正在自己画完。』是另一事件（进行体），不得连带改。
              // B-33 叙事节拍（↔A-76）：beat ≤8 字、每夜≤1、只取 note 语域（他的当场声音，中屏一闪即逝，不进可回看的冷档案）
            { at: '03:35', sys: '[自检] 检测到未授权数据波动 · 来源：本进程',
              note: null, caption: false } ],
  // 批次23 B23（09-23 用户手打覆盖）：本夜 cam9 数组整段删除（原「03:30 登录冻结 3 秒+边缘极淡人影」随改制退役）——麻酱登场=夜6 玩偶服单闪一处；红线不变。
  plazaWatch: 10,   // B-48/A-95：夜2 与夜1 同档（最松）；夜3 起收紧
  edge: { giveUp: 2, backCd: 10, retreatCd: 25 },    // B-48/D42：夜2 容忍线（giveUp=2 批次16 B-64 起全七夜同值；backCd/retreatCd 即默认值，显式=前两夜口径）
  winE: { quota: { min: 3, max: 7 } },   // B-67/批次18：口径注见夜1 行
  dream: [ { at: '03:30', dur: 2, stamina: -10 } ],
           // 全屏 2 秒碎影（握笔的手、车站钟、站台边缘）——他做梦的同一分钟，她在接入
  camStatic: [ 'plaza' ],   // S1：CAM7 常驻花屏（v1.9 仲裁定稿字段）
  hints: { open: '' }       // v2.0 批次5 B-24①：开局横幅通道停显（与 A-65 同轮），原句已迁 03:30 syslog note
},

/* ================= 夜 3 · 评估通道启用（怀疑阶段·三线重叠） =================
   参数=night3-t1.html T1 卡现值（总计划 §1 权威 3）+ v1.7 §3.4 参数表。
   三线重叠（v1.7 §6 原口径）在 v2.0 发条模型下不再于 03:00 成立（电量续点每 10s 一档均匀分布·B-44 重做），白板 03:00 照旧；口径变更已登记 B-进度（B-22）。
   ai 字段（新增·信息性）=v1.7 §3.4 的 aiLevel（落子间隔 8−ai×0.3，供引擎/日志取用）。 */
{
  id: 3,
  hourLen: 60,
  power: { start: 100, safeHalf: 60,
           drain: { base:.05, cam:.10, lock:.40, light:.1, switch:.15, renew:0, afk:0 } },   // v2.0 批次5：失焦挂起已移除（B-29）；lock .5→.40=B-57/D45-2 夜7 定向加宽（七夜同改，用户四选一仅此一项；base/cam/light/switch/renew/afk 不动）
  slots: {
    A: { ai: 6, at: 30,  path: ['hall','corrB','doorR'], sprintOnJukeDead: true },   // B-72/批次22：at 60→30（01:00→00:30 触下限）
    B: { ai: 4, at: 60,  path: ['shop','gym','hall','corrB','doorR'],
         bell: { every: [20, 32], roll: 2 }, roam: { ivMul: .55, pAdd: 8 }, corridorAt: '02:39' },   // B-65 游走层（夜3/4/6 同值=同基线中位）；B-72：at 120→60
    C: { ai: 6, at: 60,  fast: true, skipChance: .2, path: ['lib','pool','gymn','corrA','doorL'], roam: { ivMul: .55, pAdd: 8 }, corridorAt: '02:20' }   // B-65 游走层；B-72：at 120→60
  },
  board: { mode: 'game', at: '03:00',
           playerTimer: 8, oppInterval: 6.5, grace: 1.5, ai: 5,
           firstStone: 'random', blockChance: .5,
           message: '……是你', autoReply: '？',   // W-51/D44：回写=一枚问号像素字上屏（A-100 他侧系统字；v1.7『是。』覆盖登记）
           ghostOpacity: .06, winPolicy: 'reeval' },
  juke: { start: '00:00', warn: 5, battery: { cap: 30, renew: 10 }, staCost: 10,   // B-44（D39 终值）：续电=+10s 电量（累加封顶 cap·A-88）·耗体力 10·**耗电力 0（B-46：用户指令取消点击耗电）**——A-88 累加语义下 cap=30 为真上限（余量 ≥20 时点击浪费，合理节奏 ≈20-25s 一下、整夜 14-18 次）；静音超 5s 余量窗=停机
          tracks: [ { name:'残响安可', len:120 },
                    { name:'星尘回廊', len:75 },
                    { name:'金属梦境', len:75 },
                    { name:'雨后的起跑线', len:75 } ] },   // 末曲=安可循环，05:30 起播到天亮
  diary: { id: '#049', autoplayAt: '00:00', duration: 55, ruleAt: [2],   // 批次23 B23（09-23 用户手打覆盖）：新增 ruleAt:[2]=新第2行签约句（用户注「这个要加红」；审读版 W-152 斜体行原文搬运。D44补裁2 口径=1-based，答录机/记录页红字）。
           text: '——日记，第四十九天。\n' +
                 '今天正式签约了。她说想让我教她下棋。\n' +
                 '签完字出来，她眯着眼看了看训练场的灯，问怎么开得这么亮。我说怕大家看不清终点。她说，这样很好。\n' +
                 '白板上走了一盘。我在角落写了几个字。她也写了，折好放进包里。我问写了什么，她说秘密。\n' +
                 '差不多就这些。' },
                 // B-38 唱游线前声（≤2 行·禁直白点题）：「灯要最亮的」起点——她第一次注意到灯；#078 世界级 / 结局三处引用的声源
                 // B-34：删「监控切换要电」清单项（操作说明页已覆盖），保留点歌机句并挂「我替她记着」口径
  syslog: [ { at: '03:00', sys: '[白板] 对局请求 · 先手已落定',
              note: '白板亮起，棋盘格和第一枚先手已经在了。', caption: false },
              // B-24①：原 hints.open 叙事钩子改挂事件实际发生时
            { at: 'post+8',  sys: '[比对] 白板留言笔迹 ↔ 附件#049 一致性 98%', note: null, beat: '98%', caption: false },
            { at: 'post+25', sys: '[检索] 档案A 照片损坏（无底片）', note: null, caption: false } ],
  // 批次23 B23（09-23 用户手打覆盖）：本夜 cam9 数组整段删除（原「对局后 60 秒侧影」v1.7 §5 描述随改制退役）——麻酱登场=夜6 玩偶服单闪一处；红线不变。
  scriptedStamina: [ { at: 'post', delta: -5, reason: '注视留言' } ],
  plazaWatch: 8,   // B-48/A-95：夜3-4 收紧一档（⚠️夜3 无 D 槽=阈值空转、跳脸无主体——按任务书④写值登记待裁：A 消费侧缺 D 应静默忽略；B 不擅删）
  edge: { giveUp: 2 },   // B-64/批次16（A-120 减压让步）：撞门容忍 引擎默认3→2；夜1-2 本就是 2，全七夜拉平（backCd/retreatCd/t/knock 留引擎默认）
  winE: { quota: { min: 3, max: 7 } },   // B-67/批次18：口径注见夜1 行
  /* ===== B-69①（批次19b · ↔A-139/A-140）暗线物品供值 · 契约总注（夜4-6 各行只写差异）=====
     夜3-6 各一件、夜1-2/夜7 **不供**（缺字段=当夜无物品，沿用 winE/roam 的「缺省零变化」契约风格）。
     本文件只供 {key, room} 两键，批次19 的 at / x / y / s 四键全部退役：
       at ⇒ 放行时机不再是一个数值，改为「开局录音播完」（A-140 的 S.item.ready：endDiary / interruptDiary /
            无开场留言夜 startNight 兜底三处置位，置位后整夜不复位）——用户直令：避免物品一直被挡住或来不及发现。
       x / y / s ⇒ 落位改为随机抽框（A-139 的 const YBOX：mapreset 黄框实测 18 框 / 9 房，已夹取进 1.14 镜头下每一帧都看得见的窗），
            物品与玫瑰各自在当夜抽一次框（禁逐帧 random），不再定死那几个位置。
     key=四件白名单 {chess,trophy,flyer,doll}（A-134 按 OFFICE.items 认键，拼错=引擎静默不画）；
     room=当夜出物品的房，CAMORDER 十值之一、🔴禁 plaza（plaza 无 mapreset 参照图、走 camStatic 零绘制，
       放了也永远出不来）。房间分配=D57 用户裁定，本批不动；「房间要不要也随机」交审查位另裁。
     🔴 禁把黄框坐标抄回本文件：落位几何的唯一真源是引擎 uma-night.html 里的 const YBOX（与 SLOTPOS 同类），
        数值表进 nights.js 就是第二真源（批次18「禁双真源」红线在此一并生效）。validate B-69② 见四键任一即 RED。
     🔴 办公室侧累加落位真源同样在 A 侧（OFFICE.items，flat 1024x256），本文件不复制一份。 */
  item: { key: 'chess', room: 'gym' },    // 象棋 @ CAM2 健身房（落位=YBOX 随机抽框，放行=开局录音播完）
  camStatic: [ 'plaza' ],   // S1：CAM7 常驻花屏（v1.9 仲裁定稿字段）
  hints: { open: '' }       // v2.0 批次5 B-24①：开局横幅通道停显（与 A-65 同轮），原句已迁 03:00 syslog；board 提示（计时）板UI已实时显示，删（B-24③）
},

/* ================= 夜 4 · 检索升压（怀疑阶段） =================
   v1.7 §10：[参数]+首条手写备注+[日志]；升压归因=检测到未授权检索。⚠️ D 自批次10（B-48/D42）已提前至夜2 全员就位，
   本夜『D 上线』的节拍口径作废——夜4 起 D ai 抬升（0.5→1 门边 dwell 逐夜收紧）、压迫感上线。
   blockChance .65；playerTimer 7 / oppInterval 5（ai 10）。
   cornerBias：她的首个非封堵落子偏置角落——
   日记#049『我在角落写了几个字』的演出回响；与 §3.4『首子随机』并存（§3.1 规则3）。 */
{
  id: 4,
  hourLen: 60,
  power: { start: 100, safeHalf: 60,
           drain: { base:.05, cam:.10, lock:.40, light:.1, switch:.15, renew:0, afk:0 } },   // v2.0 批次5：失焦挂起已移除（B-29）；lock .5→.40=B-57/D45-2 夜7 定向加宽（七夜同改，用户四选一仅此一项；base/cam/light/switch/renew/afk 不动）
  slots: {
    A: { ai: 6, at: 30,  path: ['hall','corrB','doorR'], sprintOnJukeDead: true },   // B-72/批次22：at 60→30（01:00→00:30 触下限）
    B: { ai: 4, at: 60,  path: ['shop','gym','hall','corrB','doorR'],
         bell: { every: [20, 32], roll: 2 }, roam: { ivMul: .55, pAdd: 8 }, corridorAt: '02:39' },   // B-65 游走层（夜3/4/6 同值=同基线中位）；B-72：at 120→60
    C: { ai: 6, at: 60,  fast: true, skipChance: .2, path: ['lib','pool','gymn','corrA','doorL'], roam: { ivMul: .55, pAdd: 8 }, corridorAt: '02:20' },   // B-65 游走层；B-72：at 120→60
    D: { ai: 2, at: 30,  path: ['plaza','roof','lib','corrA','doorL'], edgeKill: 1.5, drainMul: 1.5,
         moveSfx: 'giggle', doorRush: true, giveUp: 2, roam: { ivMul: .55, pAdd: 8 }, corridorAt: '02:24' }   // 契约示例原值 ai:0（永不移动·批次10 旧值异常）→ B-64 批次16 定稿：ai 0→2、at 120→60→30（B-72/批次22 再提前一小时，01:00→00:30 触下限）、移动播 AU.giggle 提示音（A-119 消费）、末段 corrA→doorL 提速×0.5（doorRush）、撞门两次就走（giveUp=2，键名契约）；B-65 游走层（末段行为零动，走廊前加 lib）
  },
  board: { mode: 'game', at: '03:00',
           playerTimer: 7, oppInterval: 5, grace: 1.5, ai: 10,
           firstStone: 'random', blockChance: .65,
           cornerBias: true,                            // 首个非封堵落子偏置角落（引擎只读本键；firstFreeBias 死字段已删·B-24②）
           message: '你下棋的时候，左手会先动', autoReply: '谁。',   // W-52/D44：大纲长版（v1.7 短版作废；近看折行/缩字归 A）
           ghostOpacity: .06, winPolicy: 'reeval' },
  juke: { start: '00:00', warn: 5, battery: { cap: 30, renew: 10 }, staCost: 10,   // B-44（D39 终值）：续电=+10s 电量（累加封顶 cap·A-88）·耗体力 10·**耗电力 0（B-46：用户指令取消点击耗电）**——A-88 累加语义下 cap=30 为真上限（余量 ≥20 时点击浪费，合理节奏 ≈20-25s 一下、整夜 14-18 次）；静音超 5s 余量窗=停机
          tracks: [ { name:'残响安可', len:120 },
                    { name:'星尘回廊', len:80 },
                    { name:'金属梦境', len:80 },
                    { name:'雨后的起跑线', len:80 } ] },   // 【待定】v1.7 未给夜4 曲长，B 提案
  diary: { id: '#078', autoplayAt: '00:00', duration: 60, ruleAt: [4],   // D44补裁2（审查位直改·用户令）：规则教学行号1-based，答录机/记录页红字。批次23 B23（09-23 用户手打覆盖·审读版 W-153 行4 原文搬运）：第4行整换玫瑰句（词面用「这孩子」不含「她」；D50 已把本行列入 S2 局部解禁位），ruleAt [4] 仍指第4行 ✓。
           text: '——日记，第七十八天。\n' +
                 '她问我的梦想。我说看到她成为世界级吉祥物。她说那她的梦想就是和我一起成为世界第一。\n' +   // 用户直令（2026-09-21 覆盖 09-20 口径）：末句「世界级」→「世界第一」（同轮注「稍微对得上奖杯了」）；
                 // 上半句「成为世界级吉祥物」是**他的**说法、逐字未动；🔴 奖杯不补动机（D57-⑧）——本行与日记任何处都不得出现「奖杯」字样。
                 '我没接话。她跑了。我应该在后面喊点什么的。但我没有。\n' +
                 '如果▓▓█来了，请为这孩子献上玫瑰。大概被放在其他房间了。\n' +
                 '我把路线背了一遍。她要是知道，肯定要说我认真。' },
  syslog: [ { at: '03:00', sys: '[白板] 对局请求 · 首子偏置：角落',
              note: '白板亮了。她的先手落在角落——像被人教过那样。', caption: false },
              // B-24①：原 hints.open 叙事钩子改挂事件实际发生时
            { at: 'post+8',  sys: '[参数] 左手延迟 −0.03s · 来源：用户习惯数据 · 用户：不存在',
              note: '……左手？我没有左▓。', beat: '我没有左手', caption: false },   // 批次23 B23（09-23 用户手打覆盖·审读版 W-163）：note 末三字遮蔽「▓」（beat『我没有左手』不动）
              // TRAINER-00 首条手写备注（v1.7 §6.4 原文）
            { at: 'post+30', sys: '[日志] 4/21 值班记录→已损坏', note: null, caption: false } ],
  // 批次23 B23（09-23 用户手打覆盖）：本夜 cam9 数组整段删除——麻酱登场=夜6 玩偶服单闪一处；红线不变。
  plazaWatch: 8,   // B-48/A-95：夜3-4 收紧一档
  edge: { giveUp: 2 },   // B-64/批次16（A-120 减压让步）：撞门容忍 引擎默认3→2；夜1-2 本就是 2，全七夜拉平（backCd/retreatCd/t/knock 留引擎默认）
  winE: { quota: { min: 5, max: 8 } },   // B-67/批次18：窗户敌登场带 夜4-7=[5,8]（「后几晚不少于5不超过8」；冷却 60→30 递减在引擎 pSeq/coolSeq 缺省，不分夜不供值）
  item: { key: 'trophy', room: 'hall' },   // 奖杯 @ CAM1 大厅（B-69① 契约总注见夜3；🔴 D57 用户令「照旧放夜4、不补动机」——日记/syslog/正文任何处禁补写其由来）
  camStatic: [ 'plaza' ],   // S1：CAM7 常驻花屏（v1.9 仲裁定稿字段）
  hints: { open: '' }       // v2.0 批次5 B-24①：开局横幅通道停显（与 A-65 同轮），原句已迁 03:00 syslog；board 提示删（B-24③）
},

/* ================= 夜 5 · 确认（他叫出了她的名字） =================
   v1.7 §10：[权限]/[进程]/[评估]；升压归因=回写「小真？」→ 自主活动超基线。
   （批次23 B23 · 09-23 用户手打覆盖：回写换名、取问号版=审读版 W-154/W-173 一致案，D50 歧义裁；升压归因语义随名字换。）
   blockChance .8；playerTimer 6 / oppInterval 3.5（ai 15）。
   槽位 ai 为 B 提案（夜4→5 升压），夜6 回落复刻夜3 节奏。 */
{
  id: 5,
  hourLen: 60,
  power: { start: 100, safeHalf: 60,
           drain: { base:.05, cam:.10, lock:.40, light:.1, switch:.15, renew:0, afk:0 } },   // v2.0 批次5：失焦挂起已移除（B-29）；lock .5→.40=B-57/D45-2 夜7 定向加宽（七夜同改，用户四选一仅此一项；base/cam/light/switch/renew/afk 不动）
  slots: {
    A: { ai: 7, at: 30,  path: ['hall','corrB','doorR'], sprintOnJukeDead: true },   // B-72/批次22：at 60→30（01:00→00:30 触下限）
    B: { ai: 5, at: 60,  path: ['shop','gym','hall','corrB','doorR'],
         bell: { every: [20, 32], roll: 2 }, roam: { ivMul: .55, pAdd: 8 }, corridorAt: '02:29' },   // B-65 游走层；B-72：at 120→60
    C: { ai: 7, at: 60,  fast: true, skipChance: .2, path: ['lib','pool','gymn','corrA','doorL'], roam: { ivMul: .55, pAdd: 8 }, corridorAt: '02:16' },   // B-65 游走层；B-72：at 120→60
    D: { ai: 4, at: 30,  path: ['plaza','roof','lib','corrA','doorL'], edgeKill: 1.5, drainMul: 1.5,
         moveSfx: 'giggle', doorRush: true, giveUp: 2, roam: { ivMul: .55, pAdd: 8 }, corridorAt: '01:43' }   // B-64 批次16：at 120→60→30（B-72 再提前一小时触下限 00:30）+ 新三键（其余口径同夜4；ai 4 不动）；B-65 游走层——基线首入走廊已提前至 01:43（visits 首访 02:20 前在场），卡口与拜访排程同刻无冲突
  },
  board: { mode: 'game', at: '03:00',
           playerTimer: 6, oppInterval: 3.5, grace: 1.5, ai: 15,
           firstStone: 'random', blockChance: .8,
           cornerBias: true,                            // 角落偏置（同夜4；firstFreeBias 死字段已删·B-24②）
           message: '你只要还在就行', autoReply: '小真？',   // 批次23 B23（09-23 用户手打覆盖·审读版 W-154/W-173+D50）：本行旧值换名+换问号；升压归因=夜5 承重墙语义不变、随名字换
           ghostOpacity: .06, winPolicy: 'reeval' },
  juke: { start: '00:00', warn: 5, battery: { cap: 30, renew: 10 }, staCost: 10,   // B-44（D39 终值）：续电=+10s 电量（累加封顶 cap·A-88）·耗体力 10·**耗电力 0（B-46：用户指令取消点击耗电）**——A-88 累加语义下 cap=30 为真上限（余量 ≥20 时点击浪费，合理节奏 ≈20-25s 一下、整夜 14-18 次）；静音超 5s 余量窗=停机
          tracks: [ { name:'残响安可', len:120 },
                    { name:'星尘回廊', len:60 },
                    { name:'金属梦境', len:60 },
                    { name:'雨后的起跑线', len:60 } ] },   // 末曲归零恰落 06:00，按边缘规则豁免（v1.7 §6）
  diary: { id: '#091', autoplayAt: '00:00', duration: 65,   // 批次23 B23：ruleAt 键删除=口径变更（本夜自本批起无红字段——validate 不得再断言夜5 有 ruleAt；registry B23-D50）。
           text: '——日记，第九十一天。\n' +
                 '她说明年春天要去中京。高松宫纪念。短途的，1200 米。她说她想去。\n' +
                 '我说好。我陪你去。\n' +
                 '她走后我把传单翻了一遍。每张背面都有字。最后一张写着：我找到我的梦想了，所以你也要有自己的。\n' +
                 '……我是不是写太多了。' },
                 // 批次23 B23（09-23 用户手打覆盖·审读版 W-154 ⇒行终裁）：第6行（点歌机节奏+仁慈阀假描述）整行删除，节奏教学不再入日记——
                 // 原 B-30 反查注/B-44 节奏注/D40-A 封顶注随删句一并作废（仁慈阀口径已被 B22-A2 覆盖=本就要重供的假描述）。
  syslog: [ { at: '03:00', sys: '[白板] 对局请求 · 先手：随机落定', note: null, caption: false },
              // B-24①：原 hints.open 为纯过程描述无叙事钩子，仅留系统登记
            { at: 'post+8',  sys: '[权限] 账号「夜班训练员」：无此账号', note: null, beat: '无此账号', caption: false },
            { at: 'post+16', sys: '[进程] 本进程 = TRAINER-00 · 残留数据',
              note: 'TRAINER-00……？', caption: false },   // 批次23 B23（09-23 用户手打覆盖·审读版 W-164 斜体行原文搬运）：旧句所多「我」字随删（上行即新句）
            { at: 'post+30', sys: '[评估] 自主活动频率超基线 → 威胁等级↑', note: null, caption: false },
              // B-39 叙事落点：[擦除] 归档条目与 visits 同时刻落记录页（局内零文字=用户裁决，事后可读）。
              // 系统侧视角：目标=TRAINER-00（本夜 post 揭示的残留进程）——D巡门的迫近在冷档案里早已写明在找谁。禁词过：无事故词、D 语境零「她/影子」字（宪章 S2）。
              // B-40 预防性同修：归档条目各错开 1 分钟（同刻=pushSoft 与事件专属音叠两层，visits 时刻不动）。
            { at: '02:21', sys: '[擦除] 单元 D · 例行巡检 · 目标：TRAINER-00', note: '刚才左门灯自己亮了。它没有呼吸。', caption: false },
            { at: '04:41', sys: '[擦除] 单元 D · 例行巡检 · 目标仍驻留', note: null, caption: false } ],
  // 批次23 B23（09-23 用户手打覆盖）：本夜 cam9 数组整段删除——麻酱登场=夜6 玩偶服单闪一处；红线不变。
  visits: { count: 2, at: ['02:20', '04:40'], react: 2.5 },   // B-39/A-81：D 擦除单元门口迫近（第四威胁通道·非致死）；固定左门由引擎按 corrA→doorL 推得，门侧不进数据；跳脸扣一半耐力+5 电（引擎结算）
  plazaWatch: 6,   // B-48/A-95：夜5+ 最紧档（广场常驻位，盯越久越危险）
  edge: { giveUp: 2 },   // B-64/批次16（A-120 减压让步）：撞门容忍 引擎默认3→2；夜1-2 本就是 2，全七夜拉平（backCd/retreatCd/t/knock 留引擎默认）
  winE: { quota: { min: 5, max: 8 } },   // B-67/批次18：窗户敌登场带 夜4-7=[5,8]（「后几晚不少于5不超过8」；冷却 60→30 递减在引擎 pSeq/coolSeq 缺省，不分夜不供值）
  item: { key: 'flyer', room: 'shop' },    // 传单 @ CAM3 商店（B-69① 契约总注见夜3；几何约束随四键退役一并作废，落位归 A 侧 YBOX）
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
           drain: { base:.05, cam:.10, lock:.40, light:.1, switch:.15, renew:0, afk:0 } },   // v2.0 批次5：失焦挂起已移除（B-29）；lock .5→.40=B-57/D45-2 夜7 定向加宽（七夜同改，用户四选一仅此一项；base/cam/light/switch/renew/afk 不动）
  slots: {
    A: { ai: 6, at: 30,  path: ['hall','corrB','doorR'], sprintOnJukeDead: true },   // B-72/批次22：at 60→30（01:00→00:30 触下限）
    B: { ai: 4, at: 60,  path: ['shop','gym','hall','corrB','doorR'],
         bell: { every: [20, 32], roll: 2 }, roam: { ivMul: .55, pAdd: 8 }, corridorAt: '02:39' },   // B-65 游走层（夜3/4/6 同值=同基线中位）；B-72：at 120→60
    C: { ai: 6, at: 60,  fast: true, skipChance: .2, path: ['lib','pool','gymn','corrA','doorL'], roam: { ivMul: .55, pAdd: 8 }, corridorAt: '02:20' },   // B-65 游走层；B-72：at 120→60
    D: { ai: 2, at: 30,  path: ['plaza','roof','lib','corrA','doorL'], edgeKill: 1.5, drainMul: 1.5,
         moveSfx: 'giggle', doorRush: true, giveUp: 2, roam: { ivMul: .55, pAdd: 8 }, corridorAt: '02:24' }   // B-64 批次16：at 120→60→30（B-72 再提前一小时触下限 00:30）+ 新三键（其余口径同夜4；ai 2 不动）；B-65 游走层（夜6 基线与夜4 全同→同值）
  },
  board: { mode: 'game', at: '03:00',
           playerTimer: 8, oppInterval: 6.5, grace: 1.5, ai: 5,
           firstStone: 'center', blockChance: .9,
           message: '该你了', autoReply: '我没忘。',
           ghostOpacity: .07, winPolicy: 'reeval' },
  juke: { start: '00:00', warn: 5, battery: { cap: 30, renew: 10 }, staCost: 10,   // B-44（D39 终值）：续电=+10s 电量（累加封顶 cap·A-88）·耗体力 10·**耗电力 0（B-46：用户指令取消点击耗电）**——A-88 累加语义下 cap=30 为真上限（余量 ≥20 时点击浪费，合理节奏 ≈20-25s 一下、整夜 14-18 次）；静音超 5s 余量窗=停机
          tracks: [ { name:'残响安可', len:120 },
                    { name:'星尘回廊', len:70 },
                    { name:'金属梦境', len:70 },
                    { name:'雨后的起跑线', len:70 } ] },   // 120/70 四首（v1.7 §6）
  diary: { id: '#092', autoplayAt: '00:00', duration: 65,
           text: '——日记，第九十二天。\n' +
                 '今天她正式比赛。我答应会去。\n' +   // D44 补裁：「正式模拟赛→正式比赛」（他去看的是现实赛事；系统域「模拟对手」等非玩家可见行不动）
                 '出门的时候有点赶。玩偶头套挡视野，走路不太方便。我在车站前下了车，看了一眼表。\n' +
                 '还有时间。应该来得及。\n' +
                 '我跑起来的时候没看清左边。\n' +   // 批次23 B23（09-23 用户手打覆盖·审读版 W-155）：第5行补句号
                 '——' },                            // 批次23：末行改单破折号『——』；断篇禁补全红线照旧（末两行不得补全）
  syslog: [ { at: '03:00', sys: '[白板] 对局请求 · 首子：中央',
              note: '白板又亮了——这次的格子像是用手指一笔一笔画出来的。', caption: false },
              // B-24①：原 hints.open 叙事钩子改挂事件实际发生时
            { at: 'post+8',  sys: '[比对] 附件#092 时间线 ↔ 本进程操作日志 重合率 100%',
              note: '全部……对上了。', beat: '全部对上了', caption: false },
            { at: 'post+25', sys: '[归档] 例行归档窗口：开启',
              note: '#092 之后就停了。然后是——', caption: false },
            { at: '05:00', sys: '[例行] 归档窗口巡检：正常', note: null, caption: false },
              // B-39 叙事落点：排程与夜5 全同=例行巡检（重复本身就是系统档案的寒意）；锁门应对只落 note（记录页口径），局内仍零文字。
              // B-40 预防性同修：归档条目各错开 1 分钟（同夜5，visits 时刻不动，固定排程语义由 visits 本体承载）。
            { at: '02:21', sys: '[擦除] 单元 D · 例行巡检 · 目标：TRAINER-00', note: null, caption: false },
            { at: '04:41', sys: '[擦除] 单元 D · 例行巡检 · 目标仍驻留', note: '它到点就来。锁上门，等它走完流程——这也是值班的一部分了。', caption: false } ],
  cam9:  [ { at: 'post+60', type: 'doll', dur: 0.4 } ],   // 批次23 B23（09-23 用户手打覆盖·审读版 W-155 前言+裁定②）：麻酱登场改用玩偶服代指，全七夜仅此一处 post+60 极快单闪 0.4s（旧「残影人形停留更久 4.5s」作废）；温柔红线不变：无音效、无红点、不参与门边逻辑；type='doll' 渲染归 A（B23-A2），本文件只供数据。
  visits: { count: 2, at: ['02:20', '04:40'], react: 2.5 },   // B-39：与夜5 同时刻=例行巡检固定排程（系统程序的机械感，玩家可在夜5 学会后夜6 验证）；其余口径同夜5
  plazaWatch: 6,   // B-48/A-95：夜5+ 最紧档（广场常驻位，盯越久越危险）
  edge: { giveUp: 2 },   // B-64/批次16（A-120 减压让步）：撞门容忍 引擎默认3→2；夜1-2 本就是 2，全七夜拉平（backCd/retreatCd/t/knock 留引擎默认）
  winE: { quota: { min: 5, max: 8 } },   // B-67/批次18：窗户敌登场带 夜4-7=[5,8]（「后几晚不少于5不超过8」；冷却 60→30 递减在引擎 pSeq/coolSeq 缺省，不分夜不供值）
  item: { key: 'doll', room: 'roof' },     // 玩偶 @ CAM10 天台（B-69① 契约总注见夜3；D57 用户已接受「被 D 剪影占位」的观感风险，不单独避让、不改 SLOTPOS）
  camStatic: [ 'plaza' ],   // S1：CAM7 常驻花屏（v1.9 仲裁定稿字段）
  hints: { open: '' }       // v2.0 批次5 B-24①：开局横幅通道停显（与 A-65 同轮），原句已迁 03:00 syslog；board 提示删（B-24③）
},

/* ================= 夜 7 · 最终评估（放手） =================
   v1.7 §4：数值——hourLen 70 / power 80 / B/C/D ai 16-20 / 续播窗口 2s；
   融合=A 接入白板评估子系统（C3 修正）：落子者仍是 ASTON_MACHAN（blockChance 1.0 强制平局）；
   CAM7 全夜雪花（camFx）、落子噪点（noiseFx）、03:00 笑脸在雪花中自行画完（smiley）。
   v1.7 §4 续播时序（02:43/03:30/…）随发条模型作废：改为电量续点每 10s 一次（420s 夜≈14-18 次·A-88 累加封顶语义，B-44 重做），曲单计时依旧、穷尽循环回第一首。
   板前淡字「跟平时一样，就好」=board.message（§3.5 埋点4 演出序列：笑脸→格子→中央首子→淡字）；
   夜7 无 autoReply——平局后进入真结局/标准结局流程（§8）。
   diary：乱码三行（1095 为唯一不被噪声吞没的数字）→ #001 播至「……声音很轻。」自停（§6.1）——
   批次5 B-26 曾整段迁局后（corruptAt 'post+0'）；D41 二轮终口径：**完整链收归 00:00 一次**
   （openCorrupt 乱码→#001→stopAt 戛止），局后 corrupt 重播撤销、数据保留仅作记录页重建源。 */
{
  id: 7,
  hourLen: 70,
  power: { start: 80, safeHalf: 60,
           drain: { base:.05, cam:.10, lock:.40, light:.1, switch:.15, renew:0, afk:0 } },   // v2.0 批次5：失焦挂起已移除（B-29）；lock .5→.40=B-57/D45-2 夜7 定向加宽（七夜同改，用户四选一仅此一项；base/cam/light/switch/renew/afk 不动）
  slots: {
    A: { ai: 18, at: 35,  path: ['hall','corrB','doorR'], sprintOnJukeDead: true },   // B-72/批次22：at 60→35（夜7 hourLen=70，00:51→00:30 触下限）
    B: { ai: 16, at: 50,  path: ['shop','gym','hall','corrB','doorR'],
         bell: { every: [20, 32], roll: 2 }, roam: { ivMul: .55, pAdd: 8 }, corridorAt: '01:52' },   // B-65 游走层；夜7 中位 130s=游戏秒，按 hourLen70 折 01:52（非夜1-6 秒值直写）；B-72：at 120→50（−70s）
    C: { ai: 18, at: 50,  fast: true, skipChance: .2, path: ['lib','pool','gymn','corrA','doorL'], roam: { ivMul: .55, pAdd: 8 }, corridorAt: '01:51' },   // B-65 游走层（夜7 折算同上：129s→01:51）；B-72：at 120→50（−70s）
    D: { ai: 20, at: 35,  path: ['plaza','roof','lib','corrA','doorL'], edgeKill: 1.5, drainMul: 1.5,
         moveSfx: 'giggle', doorRush: true, giveUp: 2, roam: { ivMul: .55, pAdd: 8 }, corridorAt: '01:00' }   // B-64 批次16：at 120→60→35（B-72/夜7 −70s 再提前，00:51→00:30 触下限）+ 新三键（其余口径同夜4；ai 20 不动）——visits 首访 01:50 前 D 已在场；B-65 游走层：基线中位 69.5s——夜7 hourLen=70 折 01:00 整（秒值直写=错源，本行按时钟落表）
  },
  board: { mode: 'game', at: '03:00',
           playerTimer: 5, oppInterval: 2, grace: 1.5, ai: 20,
           firstStone: 'center', blockChance: 1.0,
           preFaint: '跟平时一样，就好',          // v1.7 §3.5 埋点4 板前淡字（A-40：与局后留言分离，各归各的时序）
           message: '跟平时一样，就好',
           ghostOpacity: .08, winPolicy: 'instant',
           noiseFx: true, smiley: true },
  juke: { start: '00:00', warn: 3, battery: { cap: 30, renew: 10 }, staCost: 10, finale: true,   // B-44（D39 终值）：+10s/体力10/电力0（B-46 取消点击耗电）；夜7 余量窗 3s（用户裁决）
          tracks: [ { name:'残响安可', len:120 },
                    { name:'星尘回廊', len:55 },
                    { name:'金属梦境', len:55 },
                    { name:'雨后的起跑线', len:55 },
                    { name:'云上圆舞曲', len:55 },
                    { name:'潮水与谢幕曲', len:999, finale: true } ] },   // B-42：谢幕曲定名（用户暂定），真源在此（D33）
                    // 谢幕曲 05:51 起播，无归零点——持续播入终局演出与制作名单（v1.7 §6）
  diary: { id: '#001', autoplayAt: 'post+8', corruptAt: 'post+0', duration: 45,
           // B-47/D41 二轮终口径：**完整链收归 00:00 一次**——真铃→openCorrupt 乱码逐行（铺持续静电噪声）
           // →接 #001→播至 stopAt「……声音很轻。」由 AU.glitchCut 戛然而止（A-94 修订轮消费）。
           // 局后 corrupt 重播撤销：引擎按「openCorrupt 在场 ⇒ post corrupt 让位」消费，
           // **本文件 corrupt/corruptAt 数据不动**——三行仍是记录页《[损坏] ▓▓1095▓▓》正文重建源、validate 引用 corruptAt。
           // autoplayAt 'post+8' 保留为去重锚（开场链已占 answPlayed，post 补放自然跳过）。
           // 数字红线：openCorrupt 含数字但不成完整句——1095 遮蔽为 10▓5；完整 refrain 的揭示由 00:00 链内
           // 接续的 #001 正片段承载（记录页档案=回收残片，与开场新压带两条坏带不同源，叙事成立·B-47②复核结论）。
           // 字符只用现字集（█ ▓ ＠ ＾ ＊ ／ · 与既有 corrupt 两行同源）。
           openCorrupt: [ '[记录] 值班进程 TRAINER-00 · 第 10▓5 夜 · 4/2▓',
                          '[留言] 第 ▓▓▓ 天。麻酱今天▓▓▓▓▓',
                          '嗒……噪声侧＠＾＊／▓▓▓█' ],
           // B23（09-23 审查位收尾令）：#001 复制体随夜1 新七行同步——同一体只留一个词面（旧第3行双源必被后轮当漂移揪出）。
           // 屏上无行为差：开场链按 stopLine 第2行戛止，第3行起本就不出现。
           text: '——训练日记，第一天。\n' +
                 '接到担当了。她抱着一个人偶，站在训练场门口，声音很轻。\n' +
                 '今晚要负责夜班，就像往常一样看好监控和门，点歌机不能停\n' +
                 '哦对了，窗边的那个孩子怕黑。\n' +
                 '。。。\n' +
                 '我说以后穿玩偶服帮她发传单。她笑了。\n' +
                 '玩偶服应该很热吧。',
           corrupt: [ '[████] TRAINER-00 ██████ 1095 ██████',
                      '噪#@＾＊1095＊＆j重#置...../▓▓▓',
                      '[████] ██ 中断 ██ 挂起 ██' ],
           stopAt: '她抱着一个人偶，站在训练场门口，声音很轻。',   // 旧字段保留兼容（缺 stopLine 时整句语义）
           stopLine: '接到担当了。她站在训练场门口，声音很轻。她抱着残破的玩偶服——' },   // W-37/D44：夜7 开场链第2行整行替换（A-103 消费），行末即 glitchCut；其后行不出现；记录页 #001 本体不变
           // 归档条目名见 META.wbTrashName《[损坏] ▓▓1095▓▓》（v1.7 §6.2；B-27② 由 corruptDiaryTitle 改名）
  syslog: [ { at: '03:00', sys: '[白板] 检测到未授权笔迹 · 持续写入中',
              note: '白板上，有什么正在自己画完。', caption: false },
              // B-24①：原 hints.open 叙事钩子改挂事件实际发生时（「雪花里的 CAM7 暗了」一半由 META.camStaticHint.n7 承载）
            { at: '02:40', sys: '[白板] 累计对局 1095 · 平局 1095 · 胜 0 · 负 0', note: null, caption: true },
            { at: '02:46', sys: '[历史] 模拟对手 · 1088 夜前 · 基准：已故训练员战术数据', note: null, caption: false },
            { at: '02:52', sys: '[接入方] 现实侧连续接入 1095 夜 · 训练负荷异常', note: null, caption: false },
            { at: '03:20', sys: '[留言] 第 1095 天。麻酱今天也来了。', note: '该下班了。', beat: '该下班了。', caption: true },
              // B-39 叙事落点：终评前清场——次数与时刻随 visits 收紧；不占 beat（夜7 beat 已归 03:20），最近一条 03:41 在 beat 后 21s。
              // B-40：三条与 visits 同刻会叠两层软音（pushSyslog→pushSoft + 事件专属音同帧）——各错开 1 分钟；
              // 小数秒（01:50.5）被引擎 parseClock 四舍五入吞掉、且 validate atOk 的 \d{1,2}:\d{2} 拒收，故取整分。visits 时刻不动。
            { at: '01:51', sys: '[擦除] 单元 D · 例行巡检 · 目标：TRAINER-00', note: null, caption: false },
            { at: '03:41', sys: '[擦除] 单元 D · 例行巡检 · 目标仍驻留', note: null, caption: false },
            { at: '05:11', sys: '[擦除] 单元 D · 评估前清场 · 目标：TRAINER-00', note: null, caption: false } ],
              // 夜7 beat 在 03:20 固定时点；D41 二轮后 corruptAt 'post+0' 播放让位（完整链已收归 00:00），
              // 本条排程互斥兜底保留无害（A-76 口径；若引擎让位规则变更此注随之作废）。
  // 批次23 B23（09-23 用户手打覆盖）：本夜 cam9 数组整段删除（原 04:00 frontal 正身剪影随改制退役）——麻酱登场=夜6 玩偶服单闪一处；红线不变。
  visits: { count: 3, at: ['01:50', '03:40', '05:10'], react: 2.5 },   // B-39：终评清场升级取上限 3 次；时刻错开 02:40-03:20 syslog 群与 cam9 04:00〔批次23 注：cam9 已删，该避让约束随废〕，末次 05:10 在谢幕曲（05:51）前
  plazaWatch: 6,   // B-48/A-95：夜5+ 最紧档（广场常驻位，盯越久越危险）
  edge: { giveUp: 2 },   // B-64/批次16（A-120 减压让步）：撞门容忍 引擎默认3→2；夜1-2 本就是 2，全七夜拉平（backCd/retreatCd/t/knock 留引擎默认）
  winE: { quota: { min: 5, max: 8 } },   // B-67/批次18：窗户敌登场带 夜4-7=[5,8]（「后几晚不少于5不超过8」；冷却 60→30 递减在引擎 pSeq/coolSeq 缺省，不分夜不供值）
  camStatic: [ 'plaza' ],   // S1 常驻花屏；夜7 加剧由 A-28 引擎逐夜强度常量（原 camFx 按 v1.9 仲裁并入 camStatic，避免重复计）
  hints: { open: '' }       // v2.0 批次5 B-24①：开局横幅通道停显（与 A-65 同轮），原句已迁 03:00 syslog；board 提示删（B-24③）
}
];
