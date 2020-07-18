export class Order {
  _id: string;
hospitalId: string;
hospitalName: string;
userId: string;
userName: string;
orderDate: string;
status: string;
articles: [{
  _id: string;
  articleType: string;
  name: string;
  description: string;
  expirationDate: string;
  hospitalName: string;
  hospitalId: string;
  condition: string;
  offerType: string;
  qty: number;
  price: number;
  }];
}
