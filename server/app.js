import express, { json } from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
app.use(json());
// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../public', 'index.html'));
});

// Endpoint para calcular la suma de matrices
app.post('/calculate', (req, res) => {
    try {
        const { matrix1, matrix2, rows, columns } = req.body;
        
        // Validar datos
        if (!matrix1 || !matrix2 || !rows || !columns) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }
        
        if (matrix1.length !== rows || matrix2.length !== rows) {
            return res.status(400).json({ error: 'Las dimensiones de las matrices no coinciden' });
        }
        
        // Realizar la suma de matrices en el servidor
        const result = addMatrices(matrix1, matrix2, rows, columns);
        
        // Enviar respuesta
        res.json({ result });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});

// Función para sumar matrices
function addMatrices(matrix1, matrix2, rows, columns) {
    const result = [];
    
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < columns; j++) {
            // Verificar que las matrices tengan el formato correcto
            if (!matrix1[i] || !matrix2[i] || typeof matrix1[i][j] !== 'number' || typeof matrix2[i][j] !== 'number') {
                throw new Error('Formato de matriz inválido');
            }
            row.push(matrix1[i][j] + matrix2[i][j]);
        }
        result.push(row);
    }
    
    return result;
}

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});