'use strict';
/* ============================================================
   UMA-NIGHT 七夜版 · 叙事演出绘制模块（角色B 独占文件）· 全量 B10
   契约：work/00-总计划.md §3.3 —— 引擎侧调用守卫：
     window.NFX && NFX.x && NFX.x(...)
   调用约定（给 A）：
   - 所有函数在传入的 ctx g 上绘制；引擎先把 g setTransform 到
     逻辑 384×216 坐标系（与 night3-t1.html 的 SQ 变换一致）。
   - 纯函数：无内部状态、无副作用、不发声；确定性伪随机，截图/回放可复现。
   - 全部输入容错：g 缺失 / 未知 type / 未知 scene 时安全返回。
   - 温柔红线：本模块全部输出无威胁性——残影无音效、无红点、不参与门边逻辑；
     人形轮廓柔和、无关节噪声，与 SLOT 系列严格区分（v1.7 §5）。
   ============================================================ */

window.NFX = (function () {

  /* 确定性伪随机 */
  function prand(seed) {
    var s = (seed * 1103515245 + 12345) & 0x7fffffff;
    return ((s >> 16) & 0xffff) / 0xffff;
  }
  var clamp01 = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };

  /* ============================================================
     1) 白板残影层 —— ghostLayer(g, board)
     board.ghosts（可选·新增字段提案）：历夜留言字符串数组（旧→新），
     引擎逐夜累积传入；每层 ≤8%（取 board.ghostOpacity），逐夜叠加成地层。
     缺省时绘制 1088 夜旧划痕（夜1 空板铺垫，v1.7 §3.3）。
     ============================================================ */
  function ghostLayer(g, board) {
    if (!g || !board) return;
    var op = Math.min(.08, board.ghostOpacity || 0);
    if (op <= 0) return;
    var ghosts = board.ghosts;
    if (ghosts && ghosts.length) {
      g.save();
      for (var i = 0; i < ghosts.length; i++) {
        g.globalAlpha = op;
        g.fillStyle = '#3a3a44';
        g.font = '9px "Courier New",monospace';
        /* 旧层微歪斜：越旧的越淡越斜，呈考古地层感 */
        g.save();
        g.translate(8, 20 + i * 13);
        g.rotate(((prand(i + 1) - .5) * .05));
        g.fillText(String(ghosts[i]), 0, 0);
        g.restore();
      }
      g.restore();
      return;
    }
    /* 通用旧划痕：擦不净的浅痕 + 一处半擦残块 */
    g.save();
    g.strokeStyle = '#3a3a44';
    g.lineWidth = 1;
    for (var k = 0; k < 7; k++) {
      g.globalAlpha = op * (.6 + prand(k) * .4);
      g.beginPath();
      var y = 8 + k * 9;
      g.moveTo(6 + prand(k) * 8, y);
      g.lineTo(40 + prand(k + 9) * 34, y + (prand(k + 3) - .5) * 3);
      g.stroke();
    }
    g.globalAlpha = op * .8;
    g.fillStyle = '#3a3a44';
    g.font = '8px "Courier New",monospace';
    g.fillText('▓▓ ', 14, 62);            // 半擦残块：读不出内容的旧字
    g.restore();
  }

  /* ============================================================
     2) 故障字幕 / 乱码渲染 —— glitchCaption(g, text, t)
     前 1 秒重噪声（▓▒█ 替换+大幅抖动）→ 1-2 秒断裂 → 2 秒后重组稳定。
     中屏停留 3-5 秒由引擎控制；非阻塞、不吞输入（v1.7 §6.3）。
     ============================================================ */
  function glitchCaption(g, text, t) {
    if (!g || !text) return;
    t = t || 0;
    var wob = Math.floor(t * 12);
    var corrupt = t < 1 ? .5 : t < 2 ? .25 : .08;
    var blocks = '▓█▒░#/＊＆';
    g.save();
    g.font = 'bold 10px "Courier New",monospace';
    g.textAlign = 'left';
    var w = g.measureText(text).width;
    var x0 = 192 - w / 2, y = 64;
    g.fillStyle = 'rgba(0,0,0,.55)';
    g.fillRect(x0 - 8, y - 12, w + 16, 20);
    g.strokeStyle = 'rgba(140,150,160,.25)';
    g.strokeRect(x0 - 8.5, y - 12.5, w + 17, 21);
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      var jx = (prand(i * 7 + wob) - .5) * (t < 1 ? 3 : 1.2);
      var jy = (prand(i * 13 + wob) - .5) * (t < 1 ? 2 : .8);
      if (c !== ' ' && prand(i * 3 + wob * 5) < corrupt) {
        c = blocks[Math.floor(prand(i + wob) * blocks.length)];
        g.fillStyle = '#8a9aa8';
      } else {
        g.fillStyle = '#c8d4dc';
      }
      g.fillText(c, x0 + g.measureText(text.slice(0, i)).width + jx, y + jy);
    }
    g.restore();
  }

  /* ============================================================
     3) CAM9 残影 —— cam9(g, type, t, progress)
     freeze    ：画面滞涩 + 边缘极淡人影（夜2 登录残响，3 秒）
     silhouette：柔和侧影（夜3-6 局后 60 秒窗口，2-3 秒；夜6 停留更久）
     frontal   ：正面静立剪影（夜7 04:00，4 秒，正对镜头）
     人形 = 头 + 肩 + 躯干的软边剪影，无四肢关节、无贴图、无描边框；
     永远无害：不移动到镜头前、不闪烁红光、不伴随音效。
     ============================================================ */
  function cam9(g, type, t, progress) {
    if (!g) return;
    t = t || 0;
    var p = clamp01(progress || 0);
    if (type === 'freeze') {
      /* 登录残响：滞涩感（横向拉丝）+ 右缘极淡立影 */
      g.save();
      g.fillStyle = 'rgba(10,14,20,.18)';
      g.fillRect(0, 0, 384, 216);
      for (var i = 0; i < 5; i++) {
        g.fillStyle = 'rgba(160,170,180,.05)';
        g.fillRect(0, (prand(i * 3 + Math.floor(t * 2)) * 216) | 0, 384, 1);
      }
      figure(g, 348, 118, 1, .06 + prand(Math.floor(t * 3)) * .02, t * .5, false);
      g.restore();
    } else if (type === 'silhouette') {
      /* 侧影：立于中景，轻呼吸浮动；progress 控制淡入淡出由引擎掌握 */
      var sway = Math.sin(t * 1.1) * 1.5;
      figure(g, 150 + sway, 112, 1, .13 * Math.max(.25, p), t, false);
    } else if (type === 'frontal') {
      /* 正面静立：更完整、正对镜头，几乎不动（仅极轻呼吸） */
      var br = Math.sin(t * .9) * .8;
      figure(g, 186, 106, 1.25, .18 * Math.max(.25, p), t + br, true);
    }
  }

  /* 柔和人形剪影：头圆 + 颈肩梯形 + 躯干圆角矩形，径向软边 */
  function figure(g, x, y, scale, alpha, t, frontal) {
    if (!g || alpha <= 0) return;
    g.save();
    g.translate(x, y + Math.sin(t * 1.3) * .8);
    g.scale(scale, scale);
    var grad = g.createRadialGradient(0, -20, 4, 0, 0, 64);
    grad.addColorStop(0, 'rgba(8,10,16,' + alpha + ')');
    grad.addColorStop(1, 'rgba(8,10,16,0)');
    g.fillStyle = grad;
    /* 头 */
    g.beginPath(); g.arc(0, -34, 9, 0, Math.PI * 2); g.fill();
    /* 肩与躯干（无关节：一整块圆角形） */
    g.beginPath();
    g.moveTo(-13, -22);
    g.quadraticCurveTo(0, -28, 13, -22);
    g.quadraticCurveTo(17, -6, 15, 30);
    g.quadraticCurveTo(0, 36, -15, 30);
    g.quadraticCurveTo(-17, -6, -13, -22);
    g.fill();
    if (frontal) {
      /* 正面：轮廓内再压一层浅色，呈「正对镜头」体积感（仍是剪影，无五官） */
      g.globalAlpha = .35;
      g.fillStyle = 'rgba(120,128,140,' + alpha * .5 + ')';
      g.beginPath(); g.arc(0, -34, 6.5, 0, Math.PI * 2); g.fill();
      g.globalAlpha = 1;
    }
    g.restore();
  }

  /* ============================================================
     4) 梦境碎影 —— dream(g, t)   夜2 03:30，全屏 2 秒
     三元素轮闪：握笔的手 → 车站钟 → 站台边缘（v1.7 §5）。
     黑场线稿 + 颗粒，闪回质感；纯演出、无音效。
     ============================================================ */
  function dream(g, t) {
    if (!g) return;
    t = t || 0;
    g.save();
    g.fillStyle = 'rgba(0,0,0,.84)';
    g.fillRect(0, 0, 384, 216);
    /* 手持镜头感：整体极轻晃动 */
    g.translate((prand(Math.floor(t * 8)) - .5) * 2, (prand(Math.floor(t * 8) + 9) - .5) * 2);
    var phase = Math.floor(t * 3) % 3;
    var fade = 1 - (t * 3) % 1 * .4;                 // 每拍尾部轻淡出
    g.strokeStyle = 'rgba(200,206,218,' + (.5 * fade) + ')';
    g.fillStyle = 'rgba(200,206,218,' + (.5 * fade) + ')';
    g.lineWidth = 1.5;
    g.lineCap = 'round';
    if (phase === 0) {
      /* 握笔的手：手背两笔 + 笔杆 + 正在写出的短弧 */
      var wp = clamp01((t * 3) % 1 * 1.6);
      g.beginPath(); g.moveTo(150, 132); g.quadraticCurveTo(176, 112, 196, 118); g.stroke();
      g.beginPath(); g.moveTo(166, 142); g.quadraticCurveTo(186, 128, 202, 134); g.stroke();
      g.beginPath(); g.moveTo(196, 118); g.lineTo(216, 92); g.stroke();   // 笔杆
      if (wp > 0) {                                        // 落笔弧随拍推进
        g.beginPath(); g.arc(224, 84, 12, Math.PI * .55, Math.PI * .55 + Math.PI * 1.1 * wp); g.stroke();
      }
    } else if (phase === 1) {
      /* 车站钟：圆盘、双针、时刻牌「4/21」若隐若现（冷档案词允许） */
      g.beginPath(); g.arc(192, 92, 34, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.moveTo(192, 92); g.lineTo(192, 68); g.stroke();
      g.beginPath(); g.moveTo(192, 92); g.lineTo(212, 100); g.stroke();
      for (var i = 0; i < 12; i++) {
        var a = i * Math.PI / 6;
        g.fillRect(192 + Math.cos(a) * 28 - 1, 92 + Math.sin(a) * 28 - 1, 2, 2);
      }
      g.font = '9px "Courier New",monospace';
      g.textAlign = 'center';
      g.fillText('4/21', 192, 146);
    } else {
      /* 站台边缘：地平线 + 警示条 + 两条透视收线 */
      g.beginPath(); g.moveTo(24, 148); g.lineTo(360, 148); g.stroke();
      for (var k = 0; k < 12; k++) g.fillRect(56 + k * 24, 154, 10, 3);
      g.beginPath(); g.moveTo(120, 148); g.lineTo(96, 196); g.stroke();
      g.beginPath(); g.moveTo(264, 148); g.lineTo(288, 196); g.stroke();
    }
    /* 颗粒 */
    g.fillStyle = 'rgba(255,255,255,.05)';
    for (var n = 0; n < 40; n++) {
      g.fillRect(prand(n * 7 + Math.floor(t * 10)) * 384, prand(n * 11 + Math.floor(t * 10)) * 216, 1, 1);
    }
    g.restore();
  }

  /* ============================================================
     5) 夜7 落子噪点 / 重影 —— boardNoise(g, t)
     传输噪点：棋盘区（逻辑坐标 292-348 × 100-156，与 T1 板位一致）
     的 1-2px 位错重影 + 横向撕裂条 + 散点。纯演出，不改判定。
     ============================================================ */
  function boardNoise(g, t) {
    if (!g) return;
    var wob = Math.floor(t * 10);
    g.save();
    /* 棋盘重影：网格线位错复制 */
    g.strokeStyle = 'rgba(200,204,210,.12)';
    g.lineWidth = 1;
    var ox = (prand(wob) - .5) * 3, oy = (prand(wob + 4) - .5) * 2;
    for (var i = 1; i < 3; i++) {
      g.beginPath(); g.moveTo(292 + ox + i * 18, 102 + oy); g.lineTo(292 + ox + i * 18, 154 + oy); g.stroke();
      g.beginPath(); g.moveTo(294 + ox, 102 + oy + i * 18); g.lineTo(346 + ox, 102 + oy + i * 18); g.stroke();
    }
    /* 横向撕裂条 */
    for (var k = 0; k < 3; k++) {
      if (prand(k + wob * 3) < .5) continue;
      g.fillStyle = 'rgba(180,188,196,.10)';
      g.fillRect(288, 104 + prand(k * 5 + wob) * 48, 64, 1);
    }
    /* 全屏散点 */
    g.fillStyle = 'rgba(20,20,26,.5)';
    for (var n = 0; n < 14; n++) {
      g.fillRect(prand(n * 31 + wob) * 384, prand(n * 17 + wob) * 216, 1.5, 1.5);
    }
    g.restore();
  }

  /* ============================================================
     6) 夜7 03:00 笑脸 —— smiley(g, x, y, progress)
     雪花中自行画完：圆脸 → 双眼 → 嘴弧；缺口=雪花吞没，逐帧换位再补全。
     progress 0-1；画完后由引擎接「格子→中央首子→淡字」序列（§3.5 埋点4）。
     ============================================================ */
  function smiley(g, x, y, progress) {
    if (!g) return;
    var p = clamp01(progress || 0);
    g.save();
    g.strokeStyle = 'rgba(216,222,224,.85)';
    g.fillStyle = 'rgba(216,222,224,.85)';
    g.lineWidth = 2;
    g.lineCap = 'round';
    var gap = prand(Math.floor(p * 20)) * .12;   // 雪花吞掉的缺口，逐帧换位
    var arc = function (cx, cy, r, a0, a1, pp) {
      if (pp <= 0) return;
      g.beginPath();
      g.arc(cx, cy, r, a0, a0 + (a1 - a0) * pp);
      g.stroke();
    };
    arc(x, y, 14, -Math.PI / 2, Math.PI * 1.5 - gap, Math.min(1, p * 3));
    if (p > .35) {
      g.fillRect(x - 7, y - 5, 2, 4);
      g.fillRect(x + 5, y - 5, 2, 4);
    }
    arc(x, y, 8, Math.PI * .15, Math.PI * .85, Math.max(0, (p - .6) / .4));
    g.restore();
  }

  /* ============================================================
     7) 真结局尾声 2D · 终端视角四镜 —— epilogue(g, scene, t)
     disconnect：连接中断提示（窗口 + CONNECTION LOST + 光标停闪）
     board    ：白板特写——板擦从右往左推，留言逐字消失，擦到角落「你」停住（40% 残留）
     turn     ：转板对镜头——「第 1095 天。麻酱今天也来了。」占满画面
     close    ：关闭终端——窗口缩小熄灭，残光 4% 后全暗
     每镜引擎自定时长；t=该镜经过秒。谢幕曲续播由引擎负责（本模块不发声）。
     ============================================================ */
  var TURN_LINE = '第 1095 天。麻酱今天也来了。';
  function epilogue(g, scene, t) {
    if (!g) return;
    t = t || 0;
    g.save();
    g.fillStyle = '#000';
    g.fillRect(0, 0, 384, 216);
    if (scene === 'disconnect') {
      var blink = Math.floor(t * 2) % 2 === 0;
      g.strokeStyle = 'rgba(140,150,160,.6)';
      g.strokeRect(96, 78, 192, 54);
      g.fillStyle = 'rgba(60,66,76,.6)';
      g.fillRect(96, 78, 192, 10);
      g.fillStyle = 'rgba(180,188,196,.8)';
      g.font = '10px "Courier New",monospace';
      g.textAlign = 'center';
      g.fillText('CONNECTION LOST', 192, 110);
      if (blink) g.fillRect(236, 116, 6, 8);          // 光标停闪
      g.fillStyle = 'rgba(120,128,138,.55)';
      g.font = '8px "Courier New",monospace';
      g.fillText('- - - - - - - - - - - -', 192, 124);
    } else if (scene === 'board') {
      /* 白板特写：字行从右往左被板擦吞掉，角落「你」以 40% 残留（v1.7 §3.3） */
      var wp = clamp01(t / 3);                        // 擦除进度
      /* B-40 附带判断（2026-09-20）：此处 #c8c8cc 是白板本体表面（画幅外圈仍铺黑），
         非 A-72 所去的装饰性白底——大特写里白板就该是亮的，保留。 */
      g.fillStyle = '#c8c8cc';
      g.fillRect(48, 36, 288, 144);
      g.fillStyle = '#5a5a64';
      for (var i = 0; i < 8; i++) {                   // 原有字行（抽象笔迹块）
        g.font = '9px "Courier New",monospace';
        g.fillText('▓▓▓▓ ▓▓▓▓▓ ▓▓ ▓▓▓▓▓▓ ▓▓▓', 60, 56 + i * 15);
      }
      g.fillStyle = '#c8c8cc';                        // 板擦推进：右侧已被擦净
      g.fillRect(336 - 288 * wp, 36, 288 * wp, 144);
      g.fillStyle = '#8a8a92';                        // 板擦本体
      g.fillRect(336 - 288 * wp - 10, 96, 10, 24);
      if (wp >= 1) {                                  // 停在角落：「你」40%
        g.globalAlpha = .4;
        g.fillStyle = '#3a3a44';
        g.font = '16px "Courier New",monospace';
        g.fillText('你', 66, 168);
        g.globalAlpha = 1;
      }
    } else if (scene === 'turn') {
      var tp = clamp01(t / 1.2);
      g.globalAlpha = tp;
      g.fillStyle = '#d8d8dc';
      g.textAlign = 'center';
      g.font = 'bold 13px "Courier New",monospace';
      g.fillText(TURN_LINE, 192, 104);
      g.globalAlpha = tp * .7;
      g.font = '9px "Courier New",monospace';
      g.fillText('（板面缓缓转向镜头）', 192, 126);
      g.globalAlpha = 1;
    } else if (scene === 'close') {
      var sp = clamp01(t / 2.2);                      // 窗口缩小
      var w = 240 * (1 - sp) + 2, h = 150 * (1 - sp) + 1;
      g.strokeStyle = 'rgba(140,150,160,.6)';
      g.strokeRect(192 - w / 2, 100 - h / 2, w, h);
      var glow = Math.max(0, .04 * (1 - Math.max(0, (t - 2.2))));   // 4% 残光
      if (glow > 0) {
        g.fillStyle = 'rgba(200,206,214,' + glow + ')';
        g.fillRect(0, 0, 384, 216);
      }
    }
    g.restore();
  }

  return {
    ghostLayer: ghostLayer,
    glitchCaption: glitchCaption,
    cam9: cam9,
    dream: dream,
    boardNoise: boardNoise,
    smiley: smiley,
    epilogue: epilogue
  };
})();
