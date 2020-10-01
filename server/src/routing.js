const { body, param, validationResult } = require('express-validator');
const { db } = require('./database.js');

exports.configureRoutes = function configureRoutes(app) {
    app.get('/api/v1/posts', async (request, response) => {
        const posts = await db.any('SELECT id, name, description FROM POSTS');
        response.send(posts);
    });
    app.post('/api/v1/posts', [
        body('name').isLength({ min: 4, max: 64 }).withMessage('Name must be within 4 and 64 characters'),
        body('description').isLength({ min: 0, max: 256 }).withMessage('Description must be within 0 and 256 characters')
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.array() });
        }

        const body = request.body;
        const post = await db.one('INSERT INTO POSTS(name, description) VALUES($1, $2) RETURNING id, name, description', [body.name, body.description]);
        response.status(201).send(post);
    });
    app.delete('/api/v1/posts/:id', [
        param('id').isInt()
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) { return response.status(422).json({ errors: errors.array() }); }

        const id = request.params.id;
        const post = await db.oneOrNone('DELETE FROM POSTS WHERE id = $1 RETURNING id, name, description', [id]);
        if (post == null) {
            response.status(404).send('Not found');
        } else {
            response.send(post);
        }
    });
}