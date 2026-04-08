// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// Modified Copyright @ 2024-present [ling]. All rights reserved.
// See https://github.com/surpassling/nav
import { signal, computed } from '@angular/core'
import event from 'src/utils/mitt'
import dbJson from '../../data/db.json'
import aiDbJson from '../../data/ai_db.json'
import searchJson from '../../data/search.json'
import settingsJson from '../../data/settings.json'
import tagJson from '../../data/tag.json'
import internalJson from '../../data/internal.json'
import componentJson from '../../data/component.json'
import type {
  ISettings,
  ISearchProps,
  ITagProp,
  InternalProps,
  ITagPropValues,
  INavProps,
  IComponentProps,
} from 'src/types'
import { isSelfDevelop } from 'src/utils/utils'

export const settings = signal<ISettings>({
  ...settingsJson,
  theme: 'Side',
  sideCardStyle: 'webstack'
} as ISettings)

export const search = signal<ISearchProps>(
  isSelfDevelop ? ({} as ISearchProps) : searchJson,
)

export const tagList = signal<Array<ITagPropValues>>(
  isSelfDevelop ? [] : tagJson,
)

export const tagMap = computed<ITagProp>(() => {
  const map: ITagProp = {}
  tagList().forEach((item) => {
    if (item.id) {
      map[item.id] = {
        ...item,
      }
    }
  })
  return map
})

export const internal = signal<InternalProps>(internalJson)

export const isAiNav = signal<boolean>(
  localStorage.getItem('isAiNav') ? localStorage.getItem('isAiNav') === 'true' : true
)

export const navs = signal<INavProps[]>(
  isSelfDevelop ? [] : (isAiNav() ? aiDbJson : dbJson) as INavProps[]
)

export function toggleAiNav() {
  const nextValue = !isAiNav()
  isAiNav.set(nextValue)
  localStorage.setItem('isAiNav', String(nextValue))
  navs.set(isSelfDevelop ? [] : (nextValue ? aiDbJson : dbJson) as INavProps[])
  event.emit('navs_updated', {})
  
  // Also force a reload to make sure all components get the new data properly
  setTimeout(() => {
    window.location.href = window.location.pathname
  }, 100)
}

export const component = signal<IComponentProps>(
  isSelfDevelop ? { zoom: 1, components: [] } : componentJson,
)
