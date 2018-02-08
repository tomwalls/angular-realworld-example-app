import { Component, Input } from '@angular/core';

import { Qualifier } from '../models';

@Component({
  selector: 'app-qualifier-preview',
  templateUrl: './qualifier-preview.component.html'
})
export class QualifierPreviewComponent {
  @Input() qualifier: Qualifier;

  onToggleFavorite(favorited: boolean) {
    this.qualifier['favorited'] = favorited;

    if (favorited) {
      this.qualifier['favoritesCount']++;
    } else {
      this.qualifier['favoritesCount']--;
    }
  }
}
