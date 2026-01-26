/*
 * Sidebark - Your loyal Shiba companion in the browser.
 * Copyright (C) 2026 phine-apps
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

export const translations = {
  en: {
    welcome: 'Welcome to Sidebark!',
    onboardingSub:
      'Your loyal Shiba companion is ready to help you multitask. Pin your favorite sites to get started!',
    pinCurrent: 'Pin Current Tab',
    orManually: 'Or manually',
    addSite: 'Add Site',
    placeholderUrl: 'example.com',
    settings: 'Settings',
    viewMode: 'View Mode',
    mobile: 'Mobile',
    pc: 'PC',
    tabTrigger: 'Tab Trigger',
    triggerErrorStart: 'Must start with @',
    triggerErrorLength: 'Must be at least 3 chars',
    triggerErrorAlnum: 'Alphanumeric only',
    triggerExample: 'e.g. @tab, @link (Alphanumeric only)',
    dataSync: 'Data Sync',
    enabledSync: 'Enabled (Sync)',
    close: 'Close',
    shibaBark: 'Woof! 🐾',
    shibaFound: 'Found a site!',
    shibaSniff: 'Sniff sniff...🐾',
    confirmDelete: 'Are you sure you want to delete? Woof?🐾',
    yes: 'Yes',
    no: 'No',
    limitExceededCount: 'Maximum 30 sites reached! Woof!🐾',
    limitExceededSize: 'Data too large to sync! Woof!🐾',
    duplicateSite: 'Already registered! Woof!🐾',
  },
  ja: {
    welcome: 'Sidebarkへようこそ！',
    onboardingSub:
      '忠実な柴犬があなたのマルチタスクをお手伝いします。お気に入りのサイトをピン留めして始めましょう！',
    pinCurrent: '現在のタブをピン留め',
    orManually: 'または手動で追加',
    addSite: 'サイトを追加',
    placeholderUrl: 'example.com',
    settings: '設定',
    viewMode: '表示モード',
    mobile: 'モバイル',
    pc: 'PC',
    tabTrigger: 'タブ置換トリガー',
    triggerErrorStart: '@で開始してください',
    triggerErrorLength: '3文字以上にしてください',
    triggerErrorAlnum: '英数字のみ使用可能です',
    triggerExample: '例: @tab, @link (英数字のみ)',
    dataSync: 'データ同期',
    enabledSync: '有効 (Sync)',
    close: '閉じる',
    shibaBark: 'ワンッ！🐾',
    shibaFound: 'サイトを見つけたよ！',
    shibaSniff: 'クンクン...🐾',
    confirmDelete: '本当に削除していいの？ ワンッ？🐾',
    yes: 'はい',
    no: 'いいえ',
    limitExceededCount: 'サイトは30個まで登録できるよ！ワンッ！🐾',
    limitExceededSize: 'データが多すぎて同期できないよ！ワンッ！🐾',
    duplicateSite: 'もう登録されているよ！ワンッ！🐾',
  },
  zh: {
    welcome: '欢迎来到 Sidebark！',
    onboardingSub:
      '您忠实的柴犬伴侣已准备好协助您处理多项任务。固定您最喜爱的网站即可开始！',
    pinCurrent: '固定当前标签页',
    orManually: '或手动添加',
    addSite: '添加网站',
    placeholderUrl: 'example.com',
    settings: '设置',
    viewMode: '视图模式',
    mobile: '移动端',
    pc: 'PC端',
    tabTrigger: '标签页触发器',
    triggerErrorStart: '必须以 @ 开头',
    triggerErrorLength: '至少 3 个字符',
    triggerErrorAlnum: '仅限字母数字',
    triggerExample: '例如：@tab, @link（仅限字母数字）',
    dataSync: '数据同步',
    enabledSync: '已启用（同步）',
    close: '关闭',
    shibaBark: '汪！🐾',
    shibaFound: '发现一个网站！',
    shibaSniff: '嗅嗅...🐾',
    confirmDelete: '确定要删除吗？汪？🐾',
    yes: '是',
    no: '否',
    limitExceededCount: '已达到 30 个网站上限！汪！🐾',
    limitExceededSize: '数据太大，无法同步！汪！🐾',
    duplicateSite: '已经注册过了！汪！🐾',
  },
}

export type TranslationKey = keyof typeof translations.en

export const t = (key: TranslationKey): string => {
  const lang = navigator.language
  if (lang.startsWith('ja')) return translations.ja[key]
  if (lang.startsWith('zh')) return translations.zh[key]
  return translations.en[key]
}
