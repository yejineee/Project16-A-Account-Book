import { Context } from 'koa';
import * as userService from 'services/user';

export const titleByAccountId = async (ctx: Context) => {
  const { accountId } = ctx.query;
  const title = await userService.titleByAccountId(accountId);
  ctx.status = 200;
  ctx.response.body = title;
};

export const putUser = async (ctx: Context) => {
  await userService.putUser(
    ctx.request.body.user,
    ctx.request.body.StartOfWeek,
  );
  ctx.status = 200;
  ctx.body = { success: true };
};

export const getUserList = async (ctx: Context) => {
  const userList = await userService.getUserList();
  ctx.status = 200;
  ctx.body = userList;
};

export const getUserByAccessToken = async (ctx: Context) => {
  ctx.status = 200;
  ctx.body = ctx.request.body.user;
};

export const getInvitation = async (ctx: Context) => {
  const { user } = ctx.request.body;
  const accounts = await userService.getInvitation(user);
  const invitations = accounts.map((account: any, idx) => ({
    accountObjId: account._id,
    title: account.title,
    ownerName: account.ownerName,
    host: user.invitations[idx].host,
    imageUrl: account.imageUrl,
  }));
  ctx.body = invitations;
};

export const deleteInvitation = async (ctx: Context) => {
  const { user } = ctx.request.body;
  const { accountObjId } = ctx.params;
  await userService.denyInvitation(user, accountObjId);
  ctx.status = 204;
  ctx.res.end();
};

export const agreeInvitation = async (ctx: Context) => {
  const { user } = ctx.request.body;
  const { accountObjId } = ctx.params;
  await userService.agreeInvitaion(user, accountObjId);

  ctx.status = 204;
  ctx.res.end();
};
export default titleByAccountId;
