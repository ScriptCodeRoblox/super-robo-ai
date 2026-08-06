const express = require('express');
const app = express();
app.use(express.json());

// Base de datos temporal en memoria
const sesiones = {};

// Ruta principal: Sirve la página web
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Ruta 1: El usuario envía un mensaje desde la web
app.post('/api/enviar', (req, res) => {
    const { sessionId, prompt } = req.body;
    if (!sesiones[sessionId]) sesiones[sessionId] = [];
    
    // Lógica de IA (Aquí luego pondrás tu API de Gemini)
    let codigoGenerado = "";
    if (prompt.toLowerCase().includes("bloque") || prompt.toLowerCase().includes("parte")) {
        codigoGenerado = `local p = Instance.new("Part"); p.Position = Vector3.new(0,5,0); p.Size = Vector3.new(4,4,4); p.Anchored = true; p.Parent = workspace; print("Bloque creado por SuperAI")`;
    } else {
        codigoGenerado = `print("El usuario pidió: ${prompt}. IA simulada funcionando.");`;
    }

    sesiones[sessionId].push(codigoGenerado);
    res.json({ success: true, message: "Comando enviado a Studio" });
});

// Ruta 2: Studio pregunta si hay comandos
app.get('/api/obtener/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId;
    if (sesiones[sessionId] && sesiones[sessionId].length > 0) {
        const comando = sesiones[sessionId].shift();
        res.json({ comando: comando });
    } else {
        res.json({ comando: null });
    }
});

// ¡IMPORTANTE PARA RENDER! Usar el puerto que Render nos dé
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('SuperAI Server running on port ' + PORT);
});
