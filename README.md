# H Village Research Project

慶應SFC隣接の学生寮 **Heta Village** における建物文化と寮生の態度・価値観の関係を明らかにする縦断研究プロジェクトのウェブサイト。

## Overview

H Village では男子寮・女子寮・共学寮（同一フロア型・フロア分離型）の4棟が共存しています。私たちは「住む建物が寮生の態度や価値観にどう影響するか」を、縦断アンケートと統計モデルで明らかにする研究を行っています。

- **Year 1 (2025):** 153名のデータから、回答パターンの違いが性別ではなく建物という社会単位に紐づくことを発見
- **Year 2 (2026):** 7人体制で行動指標や棟間ネットワークの測定を加え、建物文化の形成メカニズムに迫る

## Website

GitHub Pages で公開: `https://rhizobium-gits.github.io/H2026/`

### Tech Stack

- HTML / CSS / JavaScript (フレームワーク不使用)
- Google Fonts (Inter + Noto Sans JP)
- レスポンシブ対応 (モバイル / タブレット / デスクトップ)

### Features

- フルスクリーン Hero with パララックスズーム
- スクロール連動アニメーション (Intersection Observer)
- Bento Grid フォトギャラリー (3D ティルト効果)
- アニメーションカウンター
- Apple / Notion 風ミニマルデザイン

## Local Development

```bash
# クローン
git clone https://github.com/Rhizobium-gits/H2026.git
cd H2026

# ローカルサーバーで確認
python3 -m http.server 8080
# → http://localhost:8080
```

## Project Structure

```
├── index.html          # メインページ
├── style.css           # スタイルシート
├── script.js           # アニメーション・インタラクション
├── images/             # 写真・画像
│   ├── ogp.jpg
│   ├── slide01-05.jpg
│   ├── Tsubasa.jpeg    # メンバー写真
│   ├── Yuta.JPG
│   └── ...
└── README.md
```

## Team

| Name | Role |
|------|------|
| 佐藤 翼 | 研究代表者 (PI) |
| 伊藤 優太 | データ管理者 |
| 小川 嗣人 | データ広報者（全体） |
| 村田 亮 | データ広報者（パプリカ） |
| 村上 千秋 | データ広報者（ターメリック） |
| 安井 ゆうすけ | データ広報者（バジル） |

## Paper

Year 1 のプレプリント論文: [OSF Preprint](https://osf.io/t3nbf_v1)

## License

All rights reserved. &copy; 2025-2026 H Village Research Project, Keio University SFC.
