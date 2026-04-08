// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// Modified Copyright @ 2024-present [ling]. All rights reserved.
// See https://github.com/surpassling/nav

import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import type { IComponentItemProps } from 'src/types'
import { component } from 'src/store'
import { SwiperComponent } from 'src/components/swiper/index.component'

@Component({
  standalone: true,
  imports: [SwiperComponent, CommonModule],
  selector: 'app-carousel',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class CarouselComponent {
  @Input() data!: IComponentItemProps

  readonly component = component()

  constructor() {}
}
