/* =========================================================
   《庄子梦》逻辑层 v3
   ========================================================= */

function go(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const el = document.getElementById(id);
  el.classList.add('active');
  const bg = el.getAttribute('data-bg') || PAGE_BG[id] || '';
  if(bg) document.getElementById('app').style.backgroundImage = `url('${bg}')`;
  window.scrollTo(0,0);
}

const state = { choice:{1:null,2:null,3:null,4:null} };

function applyAssets(){
  if(BG_MUSIC){ const s=document.createElement('source'); s.src=BG_MUSIC; s.type='audio/mpeg'; bgm.appendChild(s); }
  if(PAGE_BG['s-title']) document.getElementById('app').style.backgroundImage = `url('${PAGE_BG["s-title"]}')`;
}

/* ====== 章节列表（底部按钮，壹贰叁肆）====== */
function renderChapters(){
  const list = document.getElementById('chapterList');
  list.innerHTML = "";
  for(let i=1;i<=4;i++){
    const c = chapters[i]; const done = state.choice[i]!==null;
    const card = document.createElement('div');
    card.className = 'chapter-card';
    card.innerHTML = `
      <div class="idx">${CH_LABELS[i]}</div>
      <div class="card-body"><h3>${c.ttl}</h3><p>${c.hint}</p></div>
      ${done ? `<div class="done-badge" title="已体验 · 心印：${chapters[i][state.choice[i]].leaf}">✓</div>` : ''}`;
    card.onclick = ()=>openChapter(i);
    list.appendChild(card);
  }
  
  /* 改动3：去掉 genBtn，全部完成后自动弹窗 */
  const oldBtn = document.getElementById('genBtn');
  if(oldBtn) oldBtn.remove();
}

/* ====== 打开章节（无标题、无占位图、文案用<p>分段）===== */
function openChapter(i){
  const c = chapters[i];
  if(c.img) document.getElementById('app').style.backgroundImage = `url('${c.img}')`;
  /* 改动4：不渲染 scene-head（标题已隐藏），无 scene-art */
  document.getElementById('chapterBody').innerHTML = `
    <div class="intro">${c.intro}</div>
    <div class="options">
      <div class="option" onclick="choose(${i},'A')"><span class="tag">A</span><span>${c.A.text}</span></div>
      <div class="option" onclick="choose(${i},'B')"><span class="tag">B</span><span>${c.B.text}</span></div>
    </div>`;
  go('s-chapter');
}

/* ====== 选择结果（无标题，心印页背景按章节区分）===== */
function choose(i,opt){
  const c=chapters[i],o=c[opt]; state.choice[i]=opt;
  /* 第四章心印页用猴子背景(ch4.jpg)，其余章节用图一(bg-heart-v5.jpg) */
  const heartBg = (i===4) ? "assets/images/ch4.jpg" : "assets/images/bg-heart-v5.jpg";
  document.getElementById('chapterBody').innerHTML = `
    <div class="result-card" style="background-image:url('${heartBg}')">
      <div class="heart">${LEAF_EMOJI[o.leaf]||'🌿'}</div>
      <div class="heart-name">${o.leaf}</div>
      <div class="heart-desc">${o.leafDesc}</div>
      <div class="seal-divider"></div>
      <div class="result-body">${o.result}</div>
    </div>
    <div style="margin-top:18px;display:flex;gap:10px;justify-content:center;">
      <button class="btn ghost" onclick="backToChapters()">返回</button>
      <button class="btn primary" onclick="continueToChapters()">继续</button>
    </div>`;
  window.scrollTo(0,0);
}

/* 返回/继续：检查是否全部完成 → 自动弹窗 */
function backToChapters(){ renderChapters(); checkAllDone(); go('s-chapters'); }
function continueToChapters(){ renderChapters(); checkAllDone(); go('s-chapters'); }

/* 检查四章是否全部完成 */
function checkAllDone(){
  if([1,2,3,4].every(i=>state.choice[i]!==null)){
    /* 延迟一点弹出，让玩家先看到章节列表的 ✓ 徽章 */
    setTimeout(showGenModal, 400);
  }
}

/* ====== 天赋计算 ====== */
function computeScores(){
  const sc={SP:0,SI:0,CR:0,IN:0,CL:0};
  for(let i=1;i<=4;i++){const opt=state.choice[i];if(!opt)continue;const add=chapters[i][opt].add;for(const k in add)sc[k]+=add[k];}
  return sc;
}
function dominant(sc){let best=DIM_PRIORITY[0],bestV=-1;for(const k of DIM_PRIORITY){if(sc[k]>bestV){bestV=sc[k];best=k;}}return best;}

/* ====== 五边形雷达图 SVG ====== */
function radarSVG(sc){
  const cx=100,cy=100,R=68;
  const maxV=Math.max(...Object.values(sc),1);
  DIM.forEach(k=>sc[k]=sc[k]/maxV);
  let grid="",area="";
  const pts=[];
  for(let i=0;i<5;i++){const a=(i*72-90)*Math.PI/180;pts.push([cx+R*Math.cos(a),cy+R*Math.sin(a)]);}
  for(let lv=1;lv<=4;lv++){const r=R*(lv/4);let gp="";for(let i=0;i<5;i++){const a=(i*72-90)*Math.PI/180;gp+=(cx+r*Math.cos(a))+","+(cy+r*Math.sin(a))+" ";}grid+=`<polygon points="${gp.trim()}" fill="none" stroke="rgba(43,38,32,.10)" stroke-width=".7"/>`;}
  for(let i=0;i<5;i++){grid+=`<line x1="${cx}" y1="${cy}" x2="${pts[i][0]}" y2="${pts[i][1]}" stroke="rgba(43,38,32,.08)" stroke-width=".5"/>`;}
  let dp="";for(let i=0;i<5;i++){const r=R*sc[DIM[i]];const a=(i*72-90)*Math.PI/180;dp+=(cx+r*Math.cos(a))+","+(cy+r*Math.sin(a))+" ";}
  area=`<polygon points="${dp.trim()}" fill="rgba(63,107,84,.20)" stroke="var(--green)" stroke-width="1.6"/>`;
  let dots="",labels="",labelOff=16;
  for(let i=0;i<5;i++){dots+=`<circle cx="${pts[i][0]}" cy="${pts[i][1]}" r="2.8" fill="var(--green)" opacity=".82"/>`;const la=(i*72-90)*Math.PI/200;const lx=cx+(R+labelOff)*Math.cos(la),ly=cy+(R+labelOff)*Math.sin(la)+3;labels+=`<text x="${lx}" y="${ly}" text-anchor="middle" font-size="9" fill="var(--ink-soft)" font-family='"Noto Serif SC","Songti SC",serif'>${DIM_CN[DIM[i]]}</text>`;}
  return `<div class="radar-wrap"><svg width="210" height="195" viewBox="0 0 200 200">${grid}${area}${dots}${labels}<circle cx="${cx}" cy="${cy}" r="1.8" fill="var(--gold)"/></svg><div class="radar-legend">${DIM.map(k=>`<span><i class="dot full"></i>${DIM_CN[k]}</span>`).join('')}</div></div>`;
}

/* ====== 弹窗控制 ====== */
function showGenModal(){document.getElementById('genModal').classList.add('show');window.addEventListener('keydown',escModal);}
function closeModal(e){if(e&&e.target!==e.target)return;document.getElementById('genModal').classList.remove('show');window.removeEventListener('keydown',escModal);}
function escModal(e){if(e.key==='Escape')closeModal();}

/* ====== 生成报告（改动1：普通布局，无固定背景图）===== */
function goReport(){
  closeModal();
  const sc=computeScores(),key=dominant(sc),sp=spirits[key];
  const spiritImg=sp.img?`<img class="spirit-img" src="${sp.img}" alt="${sp.name}" onerror="this.style.display='none'">`:"";
  
  /* 恢复报告页为普通背景 */
  document.getElementById('app').style.backgroundImage = '';
  document.getElementById('s-report').style.cssText = '';

  document.getElementById('reportBody').innerHTML=`
    <div class="spirit-label">你的心灵守护灵兽是</div>
    <div class="spirit-art">${spiritImg}<span class="spirit-emoji">${sp.emoji}</span></div>
    <div class="spirit-name">${sp.name}</div>
    <div class="report-game">庄子梦 · 心灵画像</div>
    <div class="report-founder">
      <span class="brand">本游戏由【徐徐】</span>创始人——前500强大厂设计总监、心灵成长导师，用AI独立创作完成🩵<br>
      想让孩子也用AI创造属于自己的app、游戏艺术作品？<br>
      关注我们，带领你的孩子进入想象力＋创造力的AI艺术世界🎨
    </div>
    <div class="report-qr-row">
      <div class="qr-col">
        <div class="qr-box"><img src="assets/qrcode/wechat.png" alt="微信二维码" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"><span class="qr-tip">微信二维码<br>待替换</span></div>
        <div class="qr-label">微信号：xuxufrenya</div>
      </div>
      <div class="qr-col">
        <div class="qr-box"><img src="assets/qrcode/video.png" alt="视频号二维码" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"><span class="qr-tip">视频号二维码<br>待替换</span></div>
        <div class="qr-label">视频号：徐徐 · 心灵成长陪伴</div>
      </div>
    </div>
    <div class="dim-tag">—— ${sp.tag} ——</div>
    <div class="core-quote">${sp.core.replace(/\n/g,'<br>')}</div>
    ${radarSVG(sc)}
    <div class="final-divider"></div>
    <div class="codex">
      <div class="ct">${sp.codexT}</div>
      <div class="cd">${sp.codexD}</div>
    </div>
    <div class="zhuang-quote">${sp.quote.replace(/\n/g,'<br>')}</div>
    <div class="final-divider"></div>
    <div class="thanks">
      <span class="t">感 恩</span>——理论支持：<br>
      本元医道（公众号同名）<br>
      背景音乐出处：本元同和（视频号、网易云音乐同名）
    </div>
    <div style="text-align:center;margin-top:22px;">
      <button class="btn btn-black" onclick="resetGame()">再玩一次</button>
    </div>`;
  go('s-report');
}

function resetGame(){state.choice={1:null,2:null,3:null,4:null};renderChapters();go('s-chapters');}

/* ====== 音乐 ====== */
const bgm=document.getElementById('bgm'),musicBtn=document.getElementById('musicBtn');let musicOn=false;
musicBtn.onclick=()=>{if(!bgm.querySelector('source')){musicBtn.classList.toggle('on');alert("把音乐命名为 bgm.mp3 放入 assets/audio/ 即可。");return;}if(musicOn){bgm.pause();musicBtn.classList.remove('on');musicOn=false}else{bgm.play().then(()=>{musicOn=true;musicBtn.classList.add('on')}).catch(()=>{});}};

/* ====== 加载进度条 ====== */
function startLoading(){
  const fill=document.getElementById('loadFill'),pct=document.getElementById('loadPct'),tip=document.getElementById('loadTip');
  /* loading提示固定为「正在入梦…」，不再随机轮播 */
  tip.textContent="正在入梦…";
  const imgs=[];for(const i in chapters)if(chapters[i].img)imgs.push(chapters[i].img);for(const k in spirits)if(spirits[k].img)imgs.push(spirits[k].img);if(PAGE_BG['s-title'])imgs.push(PAGE_BG['s-title']);if(PAGE_BG['s-chapters'])imgs.push(PAGE_BG['s-chapters']);
  const total=imgs.length;let loaded=0;
  function setP(v){fill.style.width=v+'%';pct.textContent=v+'%';}
  function finish(){setP(100);setTimeout(()=>go('s-title'),400);}
  if(total===0){let p=0;const sim=setInterval(()=>{p+=Math.ceil(Math.random()*9)+5;if(p>=100){clearInterval(sim);setP(100);finish()}else setP(p)},130);return;}
  let done=false;
  function tick(){const v=Math.round(loaded/total*100);setP(v);if(loaded>=total&&!done){done=true;finish();}}
  imgs.forEach(src=>{const im=new Image();const fin=()=>{if(done)return;loaded++;tick();};im.onload=fin;im.onerror=fin;im.src=src;});
  setTimeout(()=>{if(!done){done=true;finish();}},8000);
}

/* ====== 初始化 ====== */
window.openChapter=openChapter;window.choose=choose;window.goReport=goReport;window.resetGame=resetGame;

applyAssets();renderChapters();
window.addEventListener('load', startLoading);
