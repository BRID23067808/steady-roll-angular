import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ArticleService } from '../services/article/article.service';
import { Router } from '@angular/router';
import { Article } from '../services/article/article';
import { TokenStorageService } from '../services/token-storage/token-storage.service';


@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css'],
})
export class AddArticleComponent implements OnInit {
  article: Article;
  hospitalId: String;
  public articleFrom: FormGroup;
  labelPosition: string;
  choix: string[] = ['donner', 'vendre'];
  constructor(private router: Router, private formBuilder: FormBuilder, private articleService: ArticleService, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    //this.hospitalId = this.tokenStorage.getUser().hospitalId;
    this.hospitalId = "98c1aaab290e9023c9c2e3f52716fbfc";
    console.log(this.hospitalId);
    this.article = new Article;
    this.articleFrom = this.formBuilder.group({
      articleType: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      expirationDate: ['', Validators.required],
      // hospitalName: ['', Validators.required],
      condition: ['', Validators.required],
      offerType: ['', Validators.required],
      quantity: [null, Validators.required],
      price: [null, Validators.required],
    })
    this.articleFrom.get('name').valueChanges.subscribe(data => {
      this.article.name = data;
    });
    this.articleFrom.get('articleType').valueChanges.subscribe(data => {
      this.article.articleType = data;
    });
    this.articleFrom.get('description').valueChanges.subscribe(data => {
      this.article.description = data;
    });
    // this.articleFrom.get('hospitalName').valueChanges.subscribe(data => {
    //   this.article.hospitalName = data ;
    // });
    this.articleFrom.get('condition').valueChanges.subscribe(data => {
      this.article.condition = data;
    });
    this.articleFrom.get('quantity').valueChanges.subscribe(data => {
      this.article.quantity = data;
    });
    this.articleFrom.get('expirationDate').valueChanges.subscribe(data => {
      this.article.expirationDate = data;
    });
    this.articleFrom.get('offerType').valueChanges.subscribe(data => {
      this.article.offerType = data;
      console.log('offerType', data)
    });
    this.articleFrom.get('price').valueChanges.subscribe(data => {
      this.article.price = data;
    });
    console.log('this.article', this.article)

  }
  submit() {

    this.articleService.addArticle(this.article).subscribe(data => {
      const id = data._id;
      console.log('id', id);
      console.log('data', data)
      console.log('this.articleFrom.value', this.articleFrom.value);
      this.router.navigate(['/home']);

    })
  }
}
export class DatepickerCustomIconExample { }
export class RadioOverviewExample { }
