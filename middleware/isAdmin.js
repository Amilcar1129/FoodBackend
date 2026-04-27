import { UserModel } from "../models/UserModel.js";

export const isAdmin = async (req, res, next) => {
    try {
        
        // CAMBIAR userId por user_id
        if (!req.user || !req.user.user_id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }  

        // 2. BUSCAR EL USUARIO EN LA BASE DE DATOS
        const user = await UserModel.findByPk(req.user.user_id);
        

         
        // 3. VERIFICAR SI EL USUARIO EXISTE Y ES ADMIN
        if (user && user.typeusers_id === 1) {
            next();
        } else {
            return res.status(403).json({ message: 'Admin access required' });
        }
        
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};