import { ProductModel } from "../models/ProductModel.js";
import fs from 'fs/promises';  
import path from 'path';
import { fileURLToPath } from 'url';

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getProducts = async (req, res) => {
    try {
        // CONSULTAR PRODUCTOS ACTIVOS
        const products = await ProductModel.findAll({
            where: { state: true }
        });

        // ENVIAR RESPUESTA
        res.status(200).json({ products });
    } catch (error) {
        // MANEJO DE ERRORES
        res.status(500).json({ error: error.message });
    }
};

export const getOneProduct = async (req, res) => {
    try {
        // BUSCAR PRODUCTO POR ID
        const product = await ProductModel.findOne({
            where: {
                id: req.params.id,
                state: true
            }
        });
        
        // VALIDAR SI EL PRODUCTO EXISTE
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        // EXTRAER DATOS DEL CUERPO DE LA SOLICITUD
        const { name, description, price, image } = req.body;
        
        // VALIDAR DATOS REQUERIDOS
        if (!name || !price) {
            return res.status(400).json({ message: "Name and price are required" });
        }
        
        // VERIFICAR SI EL PRODUCTO YA EXISTE
        const oldProduct = await ProductModel.findOne({
            where: { name: name }
        });
        
        if (oldProduct) {
            return res.status(409).json({ message: "Product already exists" });
        }
        //CORRECCION CRITICA USAR REQ.FILE, NO REQ.BODY PARA LA IMAGEN
        let imagepath = "";
        if (req.file) {
            imagepath = `/uploads/${req.file.filename}`;
        }   

        // CREAR NUEVO PRODUCTO
        const product = await ProductModel.create({
            name,
            description: description || "",
            price,
            image: imagepath,
            state: true  // Siempre crear como activo
        });

        // ENVIAR RESPUESTA DE ÉXITO
        res.status(201).json(product);
    } catch (error) {
        // MANEJO DE ERRORES
        res.status(500).json({ error: error.message });
    }
};

// productController.js - updateProduct
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, state } = req.body;

        console.log(' Actualizando producto ID:', id);

        // Buscar el producto existente
        const product = await ProductModel.findByPk(id);
        
        if (!product) {
            return res.status(404).json({ 
                message: 'Producto no encontrado' 
            });
        }

        // Preparar los datos para actualizar
        const updateData = {};
        
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = price;
        
        if (state !== undefined) {
            updateData.state = (state === 'true' || state === true);
        }
        //CORRECON CRITICA USAR REQ.FILE, NO REQ.BODY PARA LA IMAGEN
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
            
            // Eliminar la imagen anterior si existe
            if (product.image && product.image !== '0' && product.image !== '') {
                try {
                    const oldImagePath = path.join(__dirname, '..', 'public', product.image);
                    await fs.unlink(oldImagePath);
                    console.log(` Imagen anterior eliminada: ${product.image}`);
                } catch (err) {
                    console.log(' No se pudo eliminar imagen anterior:', err.message);
                }
            }
        }

        // Actualizar el producto
        await product.update(updateData);

        res.status(200).json({
            message: 'Producto actualizado exitosamente',
            product: {
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.image,
                state: product.state
            }
        });

    } catch (error) {
        console.error('🔥 Error en updateProduct:', error);
        res.status(500).json({ 
            error: error.message,
            message: 'Error al actualizar el producto'
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        // BUSCAR PRODUCTO A ELIMINAR
        const product = await ProductModel.findOne({
            where: { id: req.params.id }
        });
        
        if (product) {
            // MARCAR PRODUCTO COMO INACTIVO
            await product.update({ state: false });
            res.status(200).json({ message: "Product deleted" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};