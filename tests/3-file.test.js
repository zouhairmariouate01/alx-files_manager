import {
    expect, use, should, request,
  } from 'chai';
  import chaiHttp from 'chai-http';
  import sinon from 'sinon';
  import { ObjectId } from 'mongodb';
  import app from '../server';
  import dbClient from '../utils/db';
  import redisClient from '../utils/redis';
  
  use(chaiHttp);
  should();
  
  // User Endpoints ==============================================
  
  describe('testing User Endpoints', () => {
    const credentials = 'Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=';
    let token = '';
    let userId = '';
    const user = {
      email: 'bob@dylan.com',
      password: 'toto1234!',
    };
  
    before(async () => {
      await redisClient.client.flushall('ASYNC');
      await dbClient.usersCollection.deleteMany({});
      await dbClient.filesCollection.deleteMany({});
    });
  
    after(async () => {
      await redisClient.client.flushall('ASYNC');
      await dbClient.usersCollection.deleteMany({});
      await dbClient.filesCollection.deleteMany({});
    });
  
    // users
    describe('pOST /users', () => {
      it('returns the id and email of created user', async () => {

