const request = require('supertest');
const { db } = require('./database.js');
const { app } = require('./server.js')

describe('POSTS tests', () => {
    beforeEach(async (done) => {
        await db.none('TRUNCATE POSTS RESTART IDENTITY');
        done();
    });

    it('should return empty posts', async (done) => {
        const response = await request(app).get('/api/v1/posts');

        expect(response.statusCode).toEqual(200);
        expect(response.body).toStrictEqual([]);

        done();
    });

    it('should return inserted posts', async (done) => {
        const posts = [
            { name: 'Correct name post 1', description: 'Correct name description 1' },
            { name: 'Correct name post 2', description: 'Correct name description 2' }
        ];
        const firstPostResponse = await request(app).post('/api/v1/posts').send(posts[0]);
        const secondPostResponse = await request(app).post('/api/v1/posts').send(posts[1]);
        const firstPost = firstPostResponse.body;
        const secondPost = secondPostResponse.body;

        const indexResponse = await request(app).get('/api/v1/posts');

        expect(indexResponse.statusCode).toEqual(200);
        expect(indexResponse.body).toStrictEqual([firstPost, secondPost]);

        done();
    });

    it('should create new post', async (done) => {
        const post = { name: 'Correct name post', description: 'Correct name description' };
        const response = await request(app).post('/api/v1/posts').send(post);

        expect(response.statusCode).toBe(201);
        expect(response.body).toStrictEqual({ ...post, id: response.body.id });

        done();
    });

    it('should fail to create new post because name validation', async (done) => {
        const post = { name: 'Name too long to be accepted by the express.js validator middleware', description: 'Correct name description' };
        const response = await request(app).post('/api/v1/posts').send(post);

        expect(response.statusCode).toBe(422);

        done();
    });

    it('should fail to create new post because description validation', async (done) => {
        const tooLongDescription = [...Array(257).keys()].join();
        const post = { name: 'Correct name post', description: tooLongDescription };
        const response = await request(app).post('/api/v1/posts').send(post);

        expect(response.statusCode).toBe(422);

        done();
    });

    it('should delete created post', async (done) => {
        const post = { name: 'Correct name post', description: 'Correct name description' };
        const createResponse = await request(app).post('/api/v1/posts').send(post);
        const createdPost = createResponse.body;
        const deleteResponse = await request(app).delete(`/api/v1/posts/${createdPost.id}`);
        const deletedPost = createResponse.body;

        expect(createResponse.statusCode).toBe(201);
        expect(deleteResponse.statusCode).toBe(200);
        expect(deletedPost).toStrictEqual(createdPost);

        done();
    });

    it('should fail to delete post because id validation', async (done) => {
        const invalidId = '3123fadsf';
        const response = await request(app).delete(`/api/v1/posts/${invalidId}`);
        expect(response.statusCode).toBe(422);
        done();
    });

    it('should fail to delete not found post', async (done) => {
        const response = await request(app).delete('/api/v1/posts/-1');
        expect(response.statusCode).toBe(404);
        done();
    });
})