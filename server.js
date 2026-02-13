const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = 3000;

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
