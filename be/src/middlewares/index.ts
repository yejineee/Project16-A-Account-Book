import Koa from 'koa';
import jwt from 'jsonwebtoken';
import { jwtConfig } from 'config';
import { unAuthroziedError, invalidAccessError } from 'libs/error';
import { UserModel } from 'models/user';

interface IDecodedData {
  id: string | number;
}

export const authorization = async (
  ctx: Koa.Context,
  next: () => Promise<any>,
) => {
  try {
    const key = 'access_token';
    const accessToken = ctx.cookies.get(key);

    if (!accessToken) {
      throw unAuthroziedError;
    }
    const decodedData = jwt.verify(
      accessToken,
      jwtConfig.jwtSecret,
    ) as IDecodedData;
    const user = await UserModel.findOne({ id: decodedData.id });
    if (!user) {
      throw unAuthroziedError;
    }
    ctx.user = user;
    next();
  } catch (e) {
    throw unAuthroziedError;
  }
};

export const verifyAccountAccess = (
  ctx: Koa.Context,
  next: () => Promise<any>,
) => {
  const { accountObjId } = ctx.params;
  if (!ctx.user) {
    throw unAuthroziedError;
  }
  const userHasAccountId = ctx.user.accounts.some(
    (account: string) => account === accountObjId,
  );
  if (!userHasAccountId) {
    throw invalidAccessError;
  }
  next();
};
