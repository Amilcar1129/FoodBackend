import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//CONFIGURACION DE ALMACENAMMIENTO

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
//CARPETA DE DESTINO DE LAS IMAGENES
        const uploadPath = path.join (__dirname,'public/uploads/');

//CREAR CARPETA SI NO EXISTE
      if (!fs.existsSync(uploadPath)){
        fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    
    },

    filename: function (req, file,cb){
//NOMBRE SEGURO SOLO CARACTERES ALFANUMERICOS Y TIMESTAMP
        const safeName = file.originalname
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase();

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null,`${uniqueSuffix}-${safeName}`);
    }
});

//FILTRAR TIPOS DE ARCHIVOS
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
         cb(null, true);
    } else {
        cb(new Error('Solo se permiten imagenes'));
    }
};

//CREAR EL MIDDLEWARE DE MULTER
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { 
        fileSize: 5 * 1024 * 1024,// Limite de 5MB
        files: 1
    } 
});


// Middleware para manejar errores de Multer específicamente
export const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Error específico de Multer
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'Archivo demasiado grande',
                message: 'El archivo no debe superar los 5MB'
            });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                error: 'Demasiados archivos',
                message: 'Solo se permite subir una imagen a la vez'
            });
        }
        return res.status(400).json({
            error: 'Error al subir archivo',
            message: err.message
        });
    } else if (err) {
        // Otros errores (como el de fileFilter)
        return res.status(400).json({
            error: 'Error de validación',
            message: err.message
        });
    }
    next();
};
export default upload;
