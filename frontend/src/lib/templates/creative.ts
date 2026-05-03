import type { LpTemplate } from '@/types/lp'

/** 受託制作 × 相談予約（SDS 5セクション） */
export const creativeInquiry: LpTemplate = {
  id: 'creative-inquiry',
  name: '制作相談テンプレート',
  description: 'Web・デザイン・動画制作の無料相談予約LP',
  industry: 'creative-service',
  goal: 'inquiry',
  framework: 'SDS',
  isFree: true,
  defaultSections: [
    {
      type: 'hero',
      variant: 'minimal',
      heading: 'ホームページ・デザイン制作の無料相談',
      body: 'まずは現状とご要望をお聞かせください。最適なご提案をします。',
      cta: { label: '無料相談を申し込む', url: '' },
    },
    {
      type: 'benefits',
      variant: 'card',
      heading: '制作実績・対応範囲',
      items: [
        { heading: 'Webサイト制作', body: 'LP・コーポレートサイト・ECサイトまで対応' },
        { heading: 'グラフィックデザイン', body: 'ロゴ・バナー・チラシ・名刺なども対応' },
        { heading: '動画制作', body: 'プロモーション動画・SNS用ショート動画' },
      ],
    },
    {
      type: 'social_proof',
      variant: 'numbers',
      heading: '制作実績',
      items: [
        { heading: '150件以上', body: 'の納品実績' },
        { heading: '平均4.8', body: '満足度（5点満点）' },
        { heading: '3営業日', body: '以内に初回見積り提出' },
      ],
    },
    {
      type: 'faq',
      variant: 'accordion',
      heading: 'よくある質問',
      items: [
        { heading: '予算が少なくても相談できますか？', body: 'はい。予算に合わせた最適なプランをご提案します。まずはお気軽にご相談ください。' },
        { heading: '納期はどのくらいかかりますか？', body: '案件の規模によりますが、LPは最短5営業日〜対応可能です。' },
        { heading: '修正は何回できますか？', body: '基本プランで3回まで無料修正対応しています。' },
      ],
    },
    {
      type: 'cta_banner',
      variant: 'minimal',
      heading: '無料相談・お見積りはこちら',
      body: '返信は24時間以内。まずはお気軽にどうぞ。',
      cta: { label: '無料相談を申し込む', url: '' },
    },
  ],
}

/** 受託制作 × 資料DL（4セクション） */
export const creativeDownload: LpTemplate = {
  id: 'creative-download',
  name: '制作実績・料金表ダウンロードテンプレート',
  description: '制作実績や料金表の資料請求LP',
  industry: 'creative-service',
  goal: 'download',
  framework: 'AIDA',
  isFree: true,
  defaultSections: [
    {
      type: 'hero',
      variant: 'minimal',
      heading: '制作実績・料金表を無料でダウンロード',
      body: 'ポートフォリオと価格表をまとめた資料を無料でお送りします。',
      cta: { label: '資料を無料でもらう', url: '' },
    },
    {
      type: 'benefits',
      variant: 'list',
      heading: 'この資料でわかること',
      items: [
        { heading: '実際の制作サンプル（10件以上）', body: '' },
        { heading: 'LP・サイト・動画別の料金目安', body: '' },
        { heading: '制作フローとスケジュール例', body: '' },
      ],
    },
    {
      type: 'social_proof',
      variant: 'numbers',
      heading: '資料ダウンロード実績',
      items: [
        { heading: '500名以上', body: 'がダウンロード済み' },
        { heading: '4.7', body: '資料の満足度' },
      ],
    },
    {
      type: 'cta_banner',
      variant: 'full-width',
      heading: '今すぐ無料でダウンロード',
      body: 'メールアドレスのご登録のみ。30秒で完了します。',
      cta: { label: '無料ダウンロード', url: '' },
    },
  ],
}

export const creativeTemplates = [creativeInquiry, creativeDownload]
