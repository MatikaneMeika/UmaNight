/* ============================================================
   UMA-NIGHT 样例兜底数据（角色A独占 · P1）
   作用：引擎数据链第一环。data/nights.js（角色B）就绪后，
   引擎会按夜 id 用其覆盖本文件同 id 夜；本文件始终作为缺字段兜底。
   夜3 全参数抄自 night3-t1.html 的 T1 卡 v1.6 现值，保证
   ?night=3 兜底行为与 T1 一致（plan-A P1 验收标准）。
   ============================================================ */
window.SAMPLE = {
  nights: {
    3: {
      id: 3,
      hourLen: 60,                          /* 每游戏小时秒数（T1：60s/h，单夜 6 分钟） */
      power: {
        start: 100,
        safeHalf: 60,                       /* 00:00-01:00 耗电减半窗口（秒） */
        drain: { base: .05, cam: .10, lock: .5, light: .1, switch: .15, renew: 0, afk: 0 /* v2.0 批次5：失焦挂起已移除，字段空置不删 */ }
      },
      slots: {
        A: { ai: 6, at: '01:00', path: ['hall', 'corrB', 'doorR'], sprintOnJukeDead: true },
        B: { ai: 4, at: '02:00', path: ['shop', 'gym', 'corrB', 'doorR'], bell: { every: [20, 32], roll: 2 } },
        C: { ai: 6, at: '02:00', fast: true, skipChance: .2, path: ['lib', 'pool', 'corrA', 'doorL'] }
      },
      board: {
        mode: 'game', at: '03:00',
        playerTimer: 8, oppInterval: 6.5, grace: 1.5,
        firstStone: 'random',               /* T1：中心或四角随机 */
        blockChance: .5,                    /* T1 现行为为"即胜点必下"；blockChance 由 P2 陪练 AI 消费 */
        winPolicy: 'reeval',                /* 夜3-6：玩家胜=紧急评估（夜7=instant） */
        message: '……是你',                  /* v1.7 §3.4 参数表：夜3 留言 */
        autoReply: '是。',                   /* v1.7 §3.3：自动回写 */
        ghostOpacity: .06                   /* 残影层不透明度（≤8%） */
      },
      juke: {
        start: '00:00', warn: 5,
        battery: { cap: 30, renew: 10 },   /* A-88/B-44 口径：起播充满 30s，点一次 +10s（封顶 cap） */
        staCost: 10,                       /* 续电扣耐力（D39 终值） */
        tracks: [
          { name: '残响安可', len: 120 },
          { name: '星尘回廊', len: 75 },
          { name: '金属梦境', len: 75 },
          { name: '雨后的起跑线', len: 75 }
        ]
      },
      camStatic: ['plaza'],                 /* S1：CAM7 常驻纯雪花 */
      /* 电话字幕通道已废弃（开局信息统一由录音机承载）；字段按契约保留置空，防止样例测试专线泄漏进正式夜3 */
      call: [],
      hints: {
        open: '门边按钮：<b>轻点=灯 · 按住不放=门锁</b>（变红）<br>A/D 转头 · C 监控<br>01:00 点歌机开播 · 03:00 白板亮起 · 撑到 6:00',
        board: '白板亮了。敌方已先手一子。<br><em>关闭监控</em>，点击棋盘落子——你 8 秒一手。',
        sprintMiss: '点歌机停了——「它」正在冲向右门！<br>按住右锁，盯 CAM9 硬撑到天亮。',
        sprintBack: '旋律回来了。它退回了大厅……'
      }
    }
  },
  /* 空 META 骨架：字段名与契约 §3.2 一致；正式值由 data/meta.js（角色B）覆盖 */
  meta: {
    songs: [],
    easterEggs: { firstWinNextDay: '……赢了呀。', secondWinNextDay: '跟麻酱，不用赢的哦。' },
    retry: { copy: ['数据重新聚合中……', '残留数据自检……', '白板已重置。'],
             copySoft: ['……钟又指回了 12 点。', '风扇还在转。什么都没有发生过。', '00:00。又是 00:00。', '这一夜，重来。'] },
    deathCountInCanon: false,
    archives: {},
    endings: {
      standard: { lines: ['[挂起] 无法判定 · 维持挂起'] },
      truth: { dialogue: [], button: '跑吧。', holdSec: 1.5, threeLines: [], epilogue: [] }
    },
    bells: { diary: 'true', decoy: 'detune', comm: 'comm' },
    menu: {
      subtitle: '七 夜 · 值 班 记 录',
      foot: '值班记录实时保存 · 灯请保持常亮',
      play: '继续游戏', back: '返回', nightsTitle: '选择夜班', locked: '▨',
      boot: { clock: 'CLOCK', night: 'NIGHT' },
      columns: { name: 'SYSTEM', spec: 'SPEC' }
    },
    /* 说明页双栏兜底行（正式值 meta.js·B-41）。{xxx} 为引擎占位符，由 CFG 插值（D9），
       缺位时原样保留花括号也不影响可读性。 */
    howTo: {
      rows: [
        { name: '视角', spec: ['A·D／←·→ 转向', '拖动手势 平移画面'] },
        { name: '监控', spec: ['C／底部白条 开关', '地图块 选台'] },
        { name: 'SYS LOG', spec: ['事件即归档', '查阅：主菜单 · 记录'] },
        { name: '答录机', spec: ['00:00 自动播放', '中断：仅 R 键'] },
        { name: '门锁', spec: ['锁钮或 Q·E 切换', '锁定耗电力 {lock}/s'] },
        { name: '灯光', spec: ['灯钮或 Z·X', '点亮 {light}s 仅显剪影'] },
        { name: '进程稳定度', spec: ['盯视 {freeze}s 冻结目标', '开监控 {camOn}/s', '收监控 {camOff}/s', '切台 −{switch}/次', '低于 {low}%：盯视失效', '低于 {crit}%：监控锁定', '归零：僵直 {stun}s 后回 {rec}%'] },
        { name: '点歌机', spec: ['大厅 CAM1 · 胶囊钮续电', '余量 <{warn}s：画面告警', '停机后当夜不可恢复'] },
        { name: '白板', spec: ['落子前提：收起监控', '开监控/近看：倒计时 {mercy}'] },
        { name: '电力', spec: ['待机 {base}/s', '撑至 06:00 仍算幸存'] }
      ]
    },
    result: {
      renew: '续播次数', miss: '错过次数', block: '挡回次数', board: '白板对局',
      power: '电力存量', stamina: '稳定度存量',
      boardValues: { none: '未出现', draw: '平局 · 挂起', win: '胜利 · 已评估', safe: '安全解除', lose: '败北 · 已评估' }
    },
    boardLog: {
      title: '白板留言',
      trueEndLine: '让她把歌唱完。'
    }
  }
};
