const express = require('express');
const socketIO = require('socket.io');
const app = express();
const port = process.env.PORT || 3000;
const log = (...args) => { console.log(args); }
const server = require('http').createServer(app);
const io = new socketIO.Server(server);
const fs = require('fs');
const path = require('path');
const uploadDir = path.resolve('uploads');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

app.use(express.json({ limit: '200MB' }));

app.get('/db', (req, res) => {
    try {
        const filter = req.query.filter == '1';
        const dirs = fs.readdirSync(uploadDir);
        const jsons = [];
        dirs.forEach(dir => {
            if (!filter && dir.indexOf('-') < 0)
                jsons.push(JSON.parse(fs.readFileSync(path.join(uploadDir, dir), 'utf8')));
            else if (filter && dir.indexOf('-') >= 0)
                jsons.push(JSON.parse(fs.readFileSync(path.join(uploadDir, dir), 'utf8')));
        });
        res.json(jsons);
    }
    catch (ex) { res.status(400).json({ message: ex.message }); }
});

app.post('/db', (req, res) => {
    try {
        const body = req.body;
        body.id = Math.random();
        fs.writeFileSync(path.join(uploadDir, `${body.name}.json`), JSON.stringify(body), 'utf8',);
        res.json({ message: 'Successfully' });
    }
    catch (ex) { res.status(400).json({ message: ex.message }); }
});

app.delete('/db/:name', (req, res) => {
    try {
        const name = req.params.name;
        const file = path.join(uploadDir, name + '.json');
        if (!fs.existsSync(file)) throw new Error("ไม่พบข้อมูลที่ต้องการลบ");
        fs.unlinkSync(file);
        res.json({ message: 'Successfully' });
    }
    catch (ex) { res.status(400).json({ message: ex.message }); }
});

app.put('/db', (req, res) => {
    try {
        const name = req.body.name;
        const getn = req.body.getn;
        const file = path.join(uploadDir, name + '.json');
        if (!fs.existsSync(file)) throw new Error("ไม่พบข้อมูลที่ต้องการลบ");
        const body = req.body;
        delete body.open;
        fs.writeFileSync(path.join(uploadDir, `${name}-${getn}.json`), JSON.stringify(body));
        fs.unlinkSync(file);
        res.json({ message: 'Successfully' });
    }
    catch (ex) { res.status(400).json({ message: ex.message }); }
});

io.on('connect', socket => {
    log('Connected', socket.id);

    socket.on('emit', (type, body) => {
        log('Emit', type);
        io.emit('emit', type, body);
    });

    socket.on('disconnect', () => {
        log('Disconnected', socket.id);
    });
});

server.listen(port, _ => console.log('server is starting port ' + port));
