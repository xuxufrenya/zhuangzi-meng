#!/usr/bin/env python3
# 《庄子梦》本地服务器 + 图片上传
# 游戏照常跑在 / ，上传页在 /upload
import os, io
from flask import Flask, request, send_from_directory, Response

ROOT = "/workspace"
UPLOAD = {
    "bg_title":      ("assets/images/bg-title.jpg",   "标题页背景图（图·首页）"),
    "bg_chapters":   ("assets/images/bg-chapters.jpg","章节选择页背景图"),
    "ch1":           ("assets/images/ch1.jpg",        "第一章·不材之木 背景"),
    "ch2":           ("assets/images/ch2.jpg",        "第二章·庄周梦蝶 背景"),
    "ch3":           ("assets/images/ch3.jpg",        "第三章·子非鱼 背景"),
    "ch4":           ("assets/images/ch4.jpg",        "第四章·朝三暮四 背景（猴子）"),
    "heart":         ("assets/images/bg-heart-v5.jpg","获得心印页背景图（图一）"),
    "wechat":        ("assets/qrcode/wechat.png",     "微信二维码"),
    "video":         ("assets/qrcode/video.png",      "视频号二维码"),
    "bgm":           ("assets/audio/bgm.mp3",         "背景音乐 bgm.mp3"),
}

app = Flask(__name__, static_folder=None)

# 游戏静态资源
@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path:path>')
def game(path):
    full = os.path.join(ROOT, path)
    if os.path.isfile(full):
        return send_from_directory(ROOT, path)
    return send_from_directory(ROOT, 'index.html')

@app.route('/upload', methods=['GET'])
def upload_page():
    opts = "".join(
        f'<option value="{k}">{v[1]}</option>' for k, v in UPLOAD.items())
    html = f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>庄子梦 · 图片上传</title>
<style>body{{font-family:"Noto Serif SC","Songti SC",serif;max-width:520px;margin:30px auto;padding:0 16px;color:#2b2620;}}
h1{{font-size:20px;}} .box{{border:1px solid #ccc;border-radius:12px;padding:16px;margin:14px 0;}}
label{{display:block;margin:10px 0 4px;font-size:14px;}} select,input{{width:100%;padding:9px;border:1px solid #bbb;border-radius:8px;font-size:14px;}}
button{{margin-top:14px;background:#3f6b54;color:#fff;border:none;border-radius:30px;padding:11px 26px;font-size:15px;cursor:pointer;}}
.msg{{color:#3f6b54;font-size:13px;margin-top:10px;}}</style></head>
<body>
<h1>庄子梦 · 图片上传</h1>
<p style="font-size:13px;color:#5a5043">选好「目标位置」再选图，点上传即可。文件直接覆盖到对应路径，刷新游戏立即生效。</p>
<form method="post" action="/upload" enctype="multipart/form-data">
  <div class="box">
    <label>目标位置</label>
    <select name="slot">{opts}</select>
    <label>选择图片</label>
    <input type="file" name="file" accept="image/*,.mp3" required>
    <button type="submit">上传替换</button>
  </div>
</form>
<div class="msg" id="msg"></div>
<p style="font-size:12px;color:#999">说明：心印页背景=「图一」，第四章背景=「朝三暮四（猴子）」。上传后回游戏刷新即可看到。</p>
</body></html>'''
    return html

@app.route('/upload', methods=['POST'])
def upload_do():
    slot = request.form.get('slot', '')
    f = request.files.get('file')
    if slot not in UPLOAD or not f or not f.filename:
        return '<p style="color:red">参数错误</p><a href="/upload">返回</a>'
    rel, label = UPLOAD[slot]
    dst = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    f.save(dst)
    sz = os.path.getsize(dst)
    return f'''<p style="color:#3f6b54;font-size:15px">✅ 已替换「{label}」<br>
    文件：{rel}（{sz} 字节）</p>
    <p><a href="/upload">继续上传</a> ｜ <a href="/">回游戏</a></p>'''

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001, debug=False, threaded=True)
