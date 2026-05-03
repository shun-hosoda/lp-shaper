import type { LpTemplate } from '@/types/lp'

/** 撮影・ブランディング × 体験申込（5セクション） */
export const photographyTrial: LpTemplate = {
  id: 'photo-trial',
  name: '撮影体験テンプレート',
  description: 'プロフィール撮影・ブランディング撮影の体験申込LP',
  industry: 'photography-branding',
  goal: 'trial_booking',
  framework: 'PASONA',
  isFree: true,
  defaultSections: [
    {
      type: 'hero',
      variant: 'minimal',
      heading: 'あなたの魅力を引き出す一枚に',
      body: 'プロフィール撮影・ブランディング撮影の体験プランをご用意しています。',
      cta: { label: '体験プランを見る', url: '' },
    },
    {
      type: 'benefits',
      variant: 'card',
      heading: '撮影プランの特徴',
      items: [
        { heading: '自然な表情を引き出す', body: 'リラックスできる撮影環境と丁寧なディレクションで、自然な笑顔を撮影します' },
        { heading: '即日データ納品', body: '撮影当日にセレクト済みの写真データをお渡しします' },
        { heading: 'SNS・名刺に使えるサイズ', body: '縦横各サイズに最適化したデータをすべてお届けします' },
      ],
    },
    {
      type: 'testimonials',
      variant: 'grid',
      heading: 'ご利用者の声',
      items: [
        { heading: 'フリーランスデザイナー 30代', body: 'SNSのプロフィール写真を変えてから問い合わせが2倍になりました。' },
        { heading: 'コンサルタント 40代', body: '名刺とWebサイトの写真を統一できて、ブランドイメージが格段に上がりました。' },
      ],
    },
    {
      type: 'faq',
      variant: 'accordion',
      heading: 'よくある質問',
      items: [
        { heading: '撮影場所はどこですか？', body: 'スタジオ撮影と出張撮影（東京都内）に対応しています。' },
        { heading: '服装は何を着ればいいですか？', body: '事前のヒアリングで目的に合った服装をご提案します。' },
        { heading: '何枚もらえますか？', body: '体験プランでは補正済み10カットをお渡しします。' },
      ],
    },
    {
      type: 'cta_banner',
      variant: 'minimal',
      heading: '撮影の詳細・予約はこちら',
      body: '',
      cta: { label: '体験プランを申し込む', url: '' },
    },
  ],
}

export const photographyTemplates = [photographyTrial]
