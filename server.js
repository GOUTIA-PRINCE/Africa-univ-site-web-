const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'votre_cle_secrete_super_secure';

app.use(cors());
app.use(express.json());

// Path to public/assets/image (where Angular serves static files)
const UPLOAD_DIR = path.join(__dirname, 'public', 'assets', 'image');
const DB_FILE = path.join(__dirname, 'db.json');

// Serve static files from the public/assets directory
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

// Ensure upload directory exists
fs.ensureDirSync(UPLOAD_DIR);

// Ensure db.json exists
if (!fs.existsSync(DB_FILE)) {
    fs.writeJsonSync(DB_FILE, { products: [] });
}

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const data = fs.readJsonSync(DB_FILE);

        // Check if user already exists
        if (data.users.find(u => u.email === email)) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: Date.now(),
            firstName,
            lastName,
            email,
            password: hashedPassword
        };

        data.users.push(newUser);
        fs.writeJsonSync(DB_FILE, data);

        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'inscription', error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = fs.readJsonSync(DB_FILE);

        const user = data.users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

        res.json({
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
    }
});

// Routes
app.get('/api/products', (req, res) => {
    const data = fs.readJsonSync(DB_FILE);
    res.json(data.products);
});

app.get('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = fs.readJsonSync(DB_FILE);
    const product = data.products.find(p => p.id === id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Product not found');
    }
});

app.post('/api/products', upload.single('image'), (req, res) => {
    const productData = JSON.parse(req.body.product);
    const data = fs.readJsonSync(DB_FILE);

    const newProduct = {
        ...productData,
        id: data.products.length > 0 ? Math.max(...data.products.map(p => p.id)) + 1 : 1,
        image: `assets/image/${req.file.filename}`
    };

    data.products.push(newProduct);
    fs.writeJsonSync(DB_FILE, data);

    res.status(201).json(newProduct);
});

app.put('/api/products/:id', upload.single('image'), (req, res) => {
    const id = parseInt(req.params.id);
    const productData = JSON.parse(req.body.product);
    const data = fs.readJsonSync(DB_FILE);

    const index = data.products.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).send('Product not found');

    let imagePath = data.products[index].image;

    if (req.file) {
        // Delete old image if it exists and is not a placeholder
        const oldImagePath = path.join(__dirname, 'src', imagePath);
        if (fs.existsSync(oldImagePath) && !imagePath.startsWith('http')) {
            fs.removeSync(oldImagePath);
        }
        imagePath = `assets/image/${req.file.filename}`;
    }

    data.products[index] = { ...productData, id, image: imagePath };
    fs.writeJsonSync(DB_FILE, data);

    res.json(data.products[index]);
});

app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = fs.readJsonSync(DB_FILE);

    const index = data.products.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).send('Product not found');

    const product = data.products[index];
    const imagePath = path.join(__dirname, 'src', product.image);

    // Delete image file
    if (fs.existsSync(imagePath) && !product.image.startsWith('http')) {
        fs.removeSync(imagePath);
    }

    data.products.splice(index, 1);
    fs.writeJsonSync(DB_FILE, data);

    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
