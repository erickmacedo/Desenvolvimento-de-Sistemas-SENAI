const express = require('express')
const session = require('express-session')
const { use } = require('express/lib/application')
const req = require('express/lib/request')
const app = express()
const Pessoa = require('./models/Pessoa')
const port = 3002
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(session({
    secret: 'turma-88419',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}))

function isAuthenticated(requ,res,next){
    if(req.session.user){
        return next
    }else{
        res.redirect('/')
    }
}

app.post('login', (req, res)=>{
    const {username, password} = req.body

    if(username == 'admin' && password == 'senha'){
        req.session.user = {username}
        res.redirect('/forms')
    }else{
        res.send('Login Invalido')
    }
})

app.get('/', async (req,res)=>{
    try{
        const pessoas = await Pessoa.findAll()
        res.render('index', {pessoas:pessoas})
    }catch(error){

    }
})

app.get('/pessoa/lista',async (req,res)=>{
    try {
        const produtos = await Pessoa.findAll()
        res.status(200).json(produtos)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

app.get('/cadastro', (req, res)=>{
    res.render('forms')
} )

app.post('/pessoa/cadastrar', upload.single('avatar'), async (req, res) => {
    try {
        const { nome, idade, descricao } = req.body;
        const avatarFile = req.file;

        if (!nome || !idade) {
            return res.status(400).json({ message: 'Nome e idade são obrigatórios.' });
        }
        let avatarBase64 = null;

        if (avatarFile) {
            avatarBase64 = avatarFile.buffer.toString('base64');
        }

        const pessoa = await Pessoa.create({
            nome,
            idade: parseInt(idade), // Certifique-se de que 'idade' é um número
            descricao,
            avatar: avatarBase64 || ''
        });

        res.redirect('/');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.delete('/pessoa/deletar-todas', async (req, res) => {
    try {
        await Pessoa.destroy({ where: {}, truncate: true });
        res.status(200).json({ message: 'Todas as pessoas foram deletadas com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(port, ()=>{
    console.log(`Servidor rodando em http://localhost:${port}`)
})