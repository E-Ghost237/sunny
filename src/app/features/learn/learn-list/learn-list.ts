import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { ContentService } from '../../../core/services/content.service';

@Component({
  selector: 'app-learn-list',
  imports: [RouterLink],
  templateUrl: './learn-list.html',
  styleUrl: './learn-list.scss',
})
export class LearnList {
  private readonly contentService = inject(ContentService);

  protected readonly articlesResource = rxResource({
    stream: () => this.contentService.getArticles(),
  });
}
