import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

const messages = [
    {
      id: uuidv4(),
      text: "Hi there!",
      user: "Amando",
      added: new Date()
    },
    {
      id: uuidv4(),
      text: "Hello World!",
      user: "Charles",
      added: new Date()
    }
  ];
  

app.get('/', (req, res) => {
    res.render('index', { messages: messages });
});

app.get('/new', (req, res) => {
    res.render('form');
});

app.get('/details/:id', (req, res) => {
    const message = messages.find(message => message.id === req.params.id);
    if (message) {
        res.render('details', { message: message });
    } else {
        res.status(404).send('Message not found');
    }
});

app.post('/new', (req, res) => {
    if(req.body.message === "" || req.body.user === "")
    {
        console.error("Please fill required fields"); 
        res.redirect('/new'); 
    }
    else{
        messages.push({
            id: uuidv4(),
            text: req.body.message,
            user: req.body.user,
            added: new Date()
        });
        res.redirect('/');
    }

});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
