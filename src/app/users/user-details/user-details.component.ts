import { Component, Input } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})

export class UserDetailsComponent {
  @Input()
  user: User;

  @Input()
  createHandler: Function;
  @Input()
  updateHandler: Function;
  @Input()
  deleteHandler: Function;

  constructor(private userService: UserService) { }

  createUser(user: User) {
    this.userService.createUser(user).then((newUser: User) => {
      this.createHandler(newUser);
    });
  }

  updateUser(user: User): void {
    this.userService.updateUser(user).then((updatedUser: User) => {
      this.updateHandler(updatedUser);
    });
  }

  deleteUser(userId: string): void {
    this.userService.deleteUser(userId).then((deletedUserId: string) => {
      this.deleteHandler(deletedUserId);
    });
  }

}
