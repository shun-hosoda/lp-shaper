import type { LpTemplate } from '@/types/lp'

/** コーチング × 体験申込（PASONA 6セクション） */
export const coachingTrial: LpTemplate = {
  id: 'coaching-trial',
  name: '体験申込テンプレート',
  description: '初回体験・お試しセッションへの申込を促進するLP',
  industry: 'coaching',
  goal: 'trial_booking',
  framework: 'PASONA',
  isFree: true,
  defaultSections: [
    {
      type: 'hero',
      variant: 'minimal',
      heading: '〇〇で悩んでいませんか？',
      body: '初回体験セッション無料。まずは30分、お気軽にお試しください。',
      cta: { label: '無料体験を申し込む', url: '' },
    },
    {
      type: 'benefits',
      variant: 'card',
      heading: 'このセッションで得られること',
      items: [
        { heading: '目標の明確化', body: '漠然とした悩みを具体的な行動計画に落とし込みます' },
        { heading: 'プロのフィードバック', body: '実績のあるコーチが現状を客観的に分析します' },
        { heading: '次の一歩が分かる', body: 'セッション後すぐに実践できるアクションをお伝えします' },
      ],
    },
    {
      type: 'social_proof',
      variant: 'numbers',
      heading: '実績',
      items: [
        { heading: '200名以上', body: 'のコーチング実績' },
        { heading: '93%', body: 'の受講者が目標を達成' },
        { heading: '4.9', body: '平均満足度（5点満点）' },
      ],
    },
    {
      type: 'testimonials',
      variant: 'grid',
      heading: 'お客様の声',
      items: [
        { heading: '30代・会社員', body: '半年で副業収入が月10万円になりました。コーチのサポートがなければ諦めていたと思います。' },
        { heading: '40代・経営者', body: '経営の悩みを整理できて、売上が前年比150%に。今後も継続したいです。' },
      ],
    },
    {
      type: 'faq',
      variant: 'accordion',
      heading: 'よくある質問',
      items: [
        { heading: 'オンラインでも受けられますか？', body: 'はい。ZoomまたはGoogle Meetを使ってオンラインでセッションを実施しています。' },
        { heading: '体験後に勧誘はありますか？', body: 'いいえ。体験セッション後に無理な勧誘は一切行いません。継続をご希望の場合のみご案内します。' },
        { heading: '料金はいくらですか？', body: '体験セッション（30分）は無料です。継続コースはセッション後にご案内します。' },
      ],
    },
    {
      type: 'cta_banner',
      variant: 'full-width',
      heading: '今すぐ無料体験を申し込む',
      body: '先着10名限定。お早めにどうぞ。',
      cta: { label: '無料体験を申し込む', url: '' },
    },
  ],
}

/** コーチング × 相談予約（SDS 5セクション） */
export const coachingInquiry: LpTemplate = {
  id: 'coaching-inquiry',
  name: '相談予約テンプレート',
  description: '無料相談・個別相談への予約を促進するLP',
  industry: 'coaching',
  goal: 'inquiry',
  framework: 'SDS',
  isFree: true,
  defaultSections: [
    {
      type: 'hero',
      variant: 'story-driven',
      heading: '無料相談受付中',
      body: 'あなたの現状を聞かせてください。一緒に解決策を考えます。',
      cta: { label: '無料相談を予約する', url: '' },
    },
    {
      type: 'benefits',
      variant: 'list',
      heading: '相談内容の例',
      items: [
        { heading: 'キャリアの方向性が決まらない', body: '' },
        { heading: '副業を始めたいが何から手を付ければいいか分からない', body: '' },
        { heading: '人間関係の悩みを相談したい', body: '' },
      ],
    },
    {
      type: 'testimonials',
      variant: 'grid',
      heading: '相談後のご感想',
      items: [
        { heading: '20代・フリーランス', body: '1時間の相談で頭が整理されました。次のアクションが明確になりました。' },
        { heading: '30代・主婦', body: '話を丁寧に聞いてもらえて、気持ちがとても楽になりました。' },
      ],
    },
    {
      type: 'faq',
      variant: 'accordion',
      heading: 'よくある質問',
      items: [
        { heading: '相談は何回でもできますか？', body: '初回は無料です。2回目以降は有料となります。' },
        { heading: 'どんな悩みでも相談できますか？', body: 'キャリア・副業・人間関係を中心に幅広くお受けしています。' },
      ],
    },
    {
      type: 'cta_banner',
      variant: 'minimal',
      heading: '今すぐ無料相談を予約する',
      body: '',
      cta: { label: '無料相談を予約する', url: '' },
    },
  ],
}

export const coachingTemplates = [coachingTrial, coachingInquiry]
