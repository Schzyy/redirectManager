const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const bearerToken = process.env.BEARER_TOKEN || 'default_token';

const dataFilePath = path.join(__dirname, 'redirects.json');

app.use(express.json());

const authenticate = (req, res, next) => {
    console.log(bearerToken);
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader === `Bearer ${bearerToken}`) {
        next();
    } else {
        console.log(bearerToken);
        res.sendStatus(403);
    }
};

const readData = () => {
    if (!fs.existsSync(dataFilePath)) {
        return {};
    }
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

app.get('/entry', authenticate, (req, res) => {
    const data = readData();
    res.json(data);
});

app.get('/:slug', (req, res) => {
    const slug = req.params.slug;
    const data = readData();

    if (data[slug]) {
        res.redirect(data[slug]);
    } 
    else {
        res.status(400);
    }
});

app.delete('/entry/:slug', authenticate, (req, res) => {
    const slug = req.params.slug;
    const data = readData();

    if (data[slug]) {
        delete data[slug];
        writeData(data);
        res.status(200).send('Entry deleted');
    } else {
        res.status(404).send('delete');
    }
});

app.post('/entry', authenticate, (req, res) => {
    const { slug, url } = req.body;
    if (!url) {
        return res.status(400).send('URL is required.');
    }

    const data = readData();
    const newSlug = slug || Math.random().toString(36).substring(2, 8);

    if (data[newSlug]) {
        return res.status(400).send('Slug already exists.');
    }

    data[newSlug] = url;
    writeData(data);

    res.status(201).send({ slug: newSlug, url });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
