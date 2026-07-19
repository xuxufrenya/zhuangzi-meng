# 庄子梦 · 心灵天赋测试小游戏

一个文字剧情互动、测试天赋维度的庄子主题小游戏（Demo）。纯静态网页，无需后端，手机/电脑浏览器均可玩。

> 字体：宋体　·　配色：古风宣纸　·　五维天赋：感知力 / 思辨力 / 创造力 / 包容力 / 洞察力

---

## 目录结构

```
.
├── index.html              # 入口页（含加载进度条）
├── css/
│   └── style.css           # 全部样式
├── js/
│   ├── data.js             # 文案 / 章节 / 灵兽 / 计分权重 / 素材路径
│   └── game.js             # 流程 / 计分 / 渲染 / 加载 / 音乐
├── assets/
│   ├── images/             # 场景图、背景图、灵兽头像（见下方清单）
│   ├── audio/              # 背景音乐 bgm.mp3
│   └── qrcode/            # 微信 / 视频号 二维码
└── README.md
```

---

## 本地预览（不部署也能玩）

方式一：直接双击 `index.html` 用浏览器打开即可。

方式二（推荐，避免个别浏览器对本地文件的限制）：

```bash
# 在项目根目录执行
python3 -m http.server 8000
# 浏览器访问 http://localhost:8000
```

---

## 换素材（零改代码）

把所有素材**按以下文件名**放入对应文件夹，刷新即可生效，无需改任何代码：

**`assets/images/`**
| 文件名 | 用途 |
|---|---|
| `bg.jpg` | 整页 / 标题背景图 |
| `ch1.jpg` ~ `ch4.jpg` | 四个章节场景图 |
| `spirit-butterfly.png` | 灵兽·蝴蝶（创造力） |
| `spirit-fish.png` | 灵兽·游鱼（感知力） |
| `spirit-peng.png` | 灵兽·大鹏（思辨力） |
| `spirit-tree.png` | 灵兽·大树（包容力） |
| `spirit-mirror.png` | 灵兽·明镜（洞察力） |

**`assets/audio/`**
| 文件名 | 用途 |
|---|---|
| `bgm.mp3` | 背景音乐（放入后右上角 ♪ 可播放） |

**`assets/qrcode/`**
| 文件名 | 用途 |
|---|---|
| `wechat.png` | 微信 / 个人二维码 |
| `video.png` | 视频号二维码 |

> 如需自定义路径，改 `js/data.js` 顶部的 `BG_IMG` / `BG_MUSIC`，以及各章节/灵兽的 `img` 字段即可。

---

## 部署到 GitHub Pages（永久地址，免费）

1. 在 GitHub 新建一个**空仓库**（例如 `zhuangzi-meng`）。
2. 把本目录所有文件推上去：
   ```bash
   git init
   git add .
   git commit -m "庄子梦 demo"
   git branch -M main
   git remote add origin https://github.com/你的用户名/zhuangzi-meng.git
   git push -u origin main
   ```
3. 进入仓库 **Settings → Pages**，Source 选择 **main** / **/root**，点击 Save。
4. 等待约 1 分钟，访问：
   ```
   https://你的用户名.github.io/zhuangzi-meng/
   ```
   这就是**永久可访问**的游戏地址（之后更新素材只需重新 push）。

> 嫌命令行麻烦，也可直接在 GitHub 网页把文件拖进仓库，再开启 Pages。

---

## 天赋维度计算

四章各有 A / B 两个选项，每个选项对应不同“心印”，并为五个天赋维度加分；
全部完成后，按**主导维度**生成对应的心灵守护灵兽与画像：

| 灵兽 | 主导维度 | 核心心印 |
|---|---|---|
| 🦋 蝴蝶 | 创造力 | 物化之翼 |
| 🐟 游鱼 | 感知力 | 通感之心 |
| 🦅 大鹏 | 思辨力 | 思辨之趣 |
| 🌳 大树 | 包容力 | 包容之量 |
| 🔆 明镜 | 洞察力 | 澄明之智 |

计分权重与映射均在 `js/data.js` 中，可按需微调。
