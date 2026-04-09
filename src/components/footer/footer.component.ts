// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// Modified Copyright @ 2024-present [ling]. All rights reserved.
// See https://github.com/surpassling/nav

import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { settings } from 'src/store'
import { compilerTemplate } from 'src/utils/utils'
import { SafeHtmlPipe } from 'src/pipe/safeHtml.pipe'
import event from 'src/utils/mitt'

@Component({
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @Input() className: string = ''
  @Input() content: string = ''

  footerContent: string = ''

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.updateContent()

    // Subscribe to nav data changes so the count updates dynamically
    // when we switch between ai_db.json and db.json
    event.on('navs_updated', () => {
      this.updateContent()
    })
  }

  updateContent() {
    this.footerContent = compilerTemplate(
      this.content || settings().footerContent,
    )
    this.cdr.detectChanges()
  }

  ngOnDestroy() {
    const applyWebEls = document.querySelectorAll('#app-footer .applyweb')
    applyWebEls.forEach((el) => {
      el.removeEventListener('click', this.handleApplyWeb)
    })
  }

  handleApplyWeb() {
    event.emit('CREATE_WEB', {})
  }

  ngAfterViewInit() {
    const applyWebEls = document.querySelectorAll('#app-footer .applyweb')
    applyWebEls.forEach((el) => {
      el.addEventListener('click', this.handleApplyWeb)
    })
  }
}
