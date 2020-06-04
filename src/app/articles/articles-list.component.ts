import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../services/articles.service';
import { Article } from '../services/article';

@Component({
  selector: 'app-article-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.css']
})
export class ArticlesListComponent implements OnInit {

  articles: Article[] = [];
  columnsToDisplay: string[] = ['name', 'description'];
  isLoadingResults = true;

  constructor(private articleService: ArticleService) { }

  ngOnInit(): void {

    this.articleService.getAll()
    .subscribe((res: any) => {
      this.articles = res;
      console.log(this.articles);
      this.isLoadingResults = false;
    }, err => {
      console.log(err);
      this.isLoadingResults = false;
    });

  }

}
