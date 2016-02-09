import { Component } from 'angular2/core';

@Component({
  selector: 'user-manager',
  template: `
    <h1>User Management</h1>
    <div class="ucp-input-group">
      <label>Email</label>
      <input class="ucp-input" type="text" />
    </div>
    <div class="ucp-input-group">
      <label>Password</label>
      <input class="ucp-input" type="password" />
    </div>
    <div class="ucp-input-group">
      <label>Confirm Password</label>
      <input class="ucp-input" type="password" />
    </div>
    <button class="ucp-btn">Save Changes</button>
  `
})
export class UserManager {
  constructor() { }
}
