import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Article } from '../services/article/article';
import { ArticleService } from '../services/article/article.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-article-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.css']
})
export class ArticlesListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'hospitalName', 'description', 'type', 'next'];
  dataSource: MatTableDataSource<Article>;
  articles: Article[] = [];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  filter;

  constructor(private articleService: ArticleService, route: ActivatedRoute ) {
    this.filter = route.snapshot.data.filter;
  }

  ngOnInit() {

    console.log(this.filter);
    this.articleService.getAll(this.filter)
    .subscribe((res: any) => {
      this.articles = res;
      this.dataSource = new MatTableDataSource(this.articles);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, err => {
      console.log(err);
    });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



}

