// uploadcontroller.js - No necesitas importar Product aquí
export const uploadImage = async (req, res) => {
    try {
        // VERIFICAR SI SE SUBIO LA IMAGEN
        if (!req.file) {
            return res.status(400).json({ 
                message: 'No se subió la imagen' 
            });
        }

        // LA URL DE LA IMAGEN SERÁ 
        const imageUrl = `/uploads/${req.file.filename}`;

        res.status(200).json({
            mensaje: 'Imagen subida con éxito',
            imageUrl: imageUrl,  // Corregí el typo "imafenUrl" a "imageUrl"
            filename: req.file.filename
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }   
};