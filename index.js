const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const pool = require('./db');

// parse json request body
app.use(express.json());
// enable cors
app.use(cors());
app.options('*', cors());

// create todo
app.post('/api/todo', async (req, res) => {
    try {
        const { title, content } = req.body;
        const todo = await pool.query("INSERT INTO todos (title, content) VALUES($1, $2) RETURNING *", [title, content]);
        res.json(todo.rows[0]);
    } catch (err) {
        console.log(err);
    }
});

// get all todos
app.get('/api/todo', async (req, res) => {
    try {
        const todos = await pool.query("SELECT * FROM todos ORDER BY todo_id DESC");
        res.json(todos.rows);
    } catch (err) {
        console.log(err);
    }
});

// get single todo
app.get('/api/todo/:id', async (req, res) => {
    try {
        const todo = await pool.query('SELECT * FROM todos WHERE todo_id = $1', [req.params.id]);
        res.json(todo.rows);
    } catch (err) {
        console.log(err);
    }
});

// Update single todo
app.put('/api/todo/:id', async (req, res) => {
    try {
        const { title, content } = req.body;
        await pool.query('UPDATE todos SET title = $1, content = $2 WHERE todo_id = $3', [title, content, req.params.id]);
        res.json('Todo Updated');
    } catch (err) {
        console.log(err);
    }
});

// delete
app.delete('/api/todo/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM todos WHERE todo_id = $1', [req.params.id]);
        res.json('Todo has been deleted');
    } catch (err) {
        console.log(err)
    }
})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

