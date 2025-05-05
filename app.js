import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
  

app.get('/', async(req, res) => {
    try{
        const results = await pool.query('SELECT * FROM messages ORDER BY added DESC');
        res.render('index', { messages: results.rows });
    }catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/new', (req, res) => {
    res.render('form');
});

app.get('/details/:id', async (req, res) => {
try {
    const result = await pool.query('SELECT * FROM messages WHERE id = $1', [req.params.id]);
    if (result.rows.length > 0) {
        res.render('details', { message: result.rows[0] });
    } else {
        res.status(404).send('Message not found');
    }
} catch (error) {
    console.error('Error fetching message details:', error);
    res.status(500).send('Internal Server Error');  
}
});

app.post('/new', async (req, res) => {
    const {message, user} = req.body;
    if (!message || !user) {
        return res.status(400).send('Message and user are required');
        return res.redirect('/new?error=Message and user are required');
    }
    try{
        await pool.query('INSERT INTO messages (id, message, "user", added) VALUES ($1, $2, $3, NOW())',
            [uuidv4(), message, user]
        );
        res.redirect('/');
    } catch (error) {   
        console.error('Error inserting message:', error);
        res.redirect('/new?error=Error inserting message');
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
