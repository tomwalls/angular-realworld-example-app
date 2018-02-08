import { Component, Input } from '@angular/core';

import { Qualifier } from '../models';

@Component({
  selector: 'app-qualifier-meta',
  templateUrl: './qualifier-meta.component.html'
})
export class QualifierMetaComponent {
  @Input() qualifier: Qualifier;
}
