from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__, static_folder='public')

@app.route('/')
def index():
    return send_from_directory('../public', 'index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    try:
        # Obtener datos del request
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No se recibieron datos"}), 400
            
        matrix1 = data.get('matrix1')
        matrix2 = data.get('matrix2')
        rows = data.get('rows')
        columns = data.get('columns')
        
        # Validar datos
        if not matrix1 or not matrix2 or not rows or not columns:
            return jsonify({"error": "Faltan datos requeridos"}), 400
            
        if len(matrix1) != rows or len(matrix2) != rows:
            return jsonify({"error": "Las dimensiones de las matrices no coinciden"}), 400
            
        # Realizar la suma de matrices
        result = add_matrices(matrix1, matrix2, rows, columns)
        
        # Devolver resultado
        return jsonify({"result": result})
        
    except Exception as e:
        print(f"Error al procesar la solicitud: {str(e)}")
        return jsonify({"error": "Error al procesar la solicitud"}), 500

def add_matrices(matrix1, matrix2, rows, columns):
    """
    Función para sumar dos matrices
    """
    result = []
    
    for i in range(rows):
        row = []
        for j in range(columns):
            # Validar que las matrices tengan el formato correcto
            if (i >= len(matrix1) or i >= len(matrix2) or 
                j >= len(matrix1[i]) or j >= len(matrix2[i]) or 
                not isinstance(matrix1[i][j], (int, float)) or 
                not isinstance(matrix2[i][j], (int, float))):
                raise ValueError("Formato de matriz inválido")
                
            row.append(matrix1[i][j] + matrix2[i][j])
        result.append(row)
    
    return result

if __name__ == '__main__':
    app.run(debug=True, port=3000)