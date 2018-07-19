'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hi, egg'+this.ctx.params.id +this.ctx.query.name;
  }
  async form(){
    this.ctx.body= `body: ${JSON.stringify(this.ctx.request.body)}`;
  }
}
async login() {
  this.ctx.validate({
    account: { type: 'string'},
    password: { type: 'string', min: 8, max: 20 },
    rememberMe: { type: 'boolean', required: false },
  });
  const {
    account,
    password,
    rememberMe,
  } = this.ctx.request.body;
  const response = await this.userService.login(account, password);
  if (response.error) this.ctx.status = 403;
  if (!response.error && rememberMe) this.ctx.session.maxAge = ms('30d');
  this.ctx.body = response;
}
async logout() {
  this.ctx.session = null;
  this.ctx.body = '退出成功';
}
async register() {
  this.ctx.validate({
    account: { type: 'string'},
    password: { type: 'string', min: 8, max: 20 },
    nickname: {type: 'string', min: 1, max: 20 , required: false },
    avatar: {type: 'url', required: false },
    signature:{type: 'string', min: 0, max: 200,required:false}
  });
  const {
    account ,
    password,
    nickname = 'guest',
    avatar = null,
    signature = '这个人很懒,什么都没有留下',
  } = this.ctx.request.body;
  // const {userList} = this.ctx.request.body;
  const response = await this.userService.register(account,password,nickname,avatar,signature);
  if (response.error) this.ctx.status = 409;
  this.ctx.body = response;
}
module.exports = HomeController;