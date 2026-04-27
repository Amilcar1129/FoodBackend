import { OrderModel } from "../models/OrderModel.js";
import { ProductModel } from "../models/ProductModel.js";
import { UserModel } from "../models/UserModel.js";
import { OrderDetailModel } from "../models/OrderDetailModel.js";

// cliente crear nuevo pedido
export const createOrder = async (req, res) => {
    try {
        const{products, total} = req.body;  //products: [{productId, quantity,price }]
        const userId = req.user.userId; // del token JWT

        if (!products || !Array.isArray(products) || products.length === 0){
            return res.status(400).json({message:"debe incluir productos en el pedido"

            });
    }
    if (!total || total <= 0){
        return res.status(400).json({message:"total del pedido no valido"

        });
    }

    //crear el pedido principal

    const order=await OrderModel.create({
        userId,
        total,
        status:"pendiente"
    });
    //crear detalles del pedido
    const orderDetails = await Promise.all(products.map(async (item) => {
        const productId = item.productId ?? item.id;

    //verificar que el producto exista
        const product = await ProductModel.findByPk(productId);
        if (!product){
            throw new Error(`Producto con ID ${productId} no encontrado`);
        }
       return OrderDetailModel.create({
            orderId: order.id,
            productId: productId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.quantity * item.price
        });
    }));

    //obtener pedido completo con detalles 

const completOrder=await OrderModel.findByPk(order.id,{
    include:[{
        model:ProductModel,
        through:{attributes:['quantity','price','subtotal']}
    }]
});
res.status(201).json({message:"pedido creado con exito", 
    order:completOrder
});

    }
    catch (error) {
        console.error('error al crear el pedido:', error.message);
        res.status(500).json({
            error:error.message || "error al crear el pedido"
            
        });
    }};

    //2. CLIENTE: ver sus pedidos
    export const getMyOrders = async (req, res) => {
        try {
            const userId = req.user.userId; // del token JWT
            const order =await OrderModel.findAll({
                where:{userId},
                include:[{
                    model:ProductModel,
                    through: {attributes:['quantity','price','subtotal']}
                }],
                order:[['order_date','DESC']]
            });


        res.status(200).json({orders:order});
        
        } catch (error){
            console.error('error en getAllOrders',error)
            res.status(500).json({error: error.message });
        }
        };

        //3. ADMIN: ver todos los pedidos

        export const getAllOrders = async (req,res)=>{
            try {
                const orders= await OrderModel.findAll({
                    include:[
                        {
                            model:UserModel,
                            attributes:['id','user','email']
                        },
                        {
                            model:ProductModel,
                            through:{attributes:['quantity','price','subtotal']}
                        }
                    ],
                    order:[['order_date','DESC']]
                });

                res.status(200).json({orders});

            } catch (error) {
                console.error('error en getAllOrders',error);
                res.status(500).json({error:error.message});

            }
        };

        //Ver el pedido especifico cliente o admin

        export const getOrderById = async (req,res) => {
            try{
                const orderId = req.params.id;
                const userId = req.user.userId;
                const userType = req.user.userType;
                const order = await OrderModel.findByPk (orderId,{
                    include:[
                        {
                            model:UserModel,
                            attributes:['id','user','email']

            },
              {
                model:ProductModel,
                through:{attributes:['quantity','price','subtotal']}
            }
                    ]
                });

                if(!order){
                    return res.status(404).json({message:"Pedido no encontrado"});
        
                }
                    // Cliente solo puede ver sus propios pedidos (a menos que sea admin)

                if (order.userId!==userId && userType !== 5){
                    return res.status(403).json({message:"No autorizado para ver este pedido"});
                }
                res.status(200).json({order});

        }catch (error){
            console.error('error en getOrderById',error);
            res.status(500).json({error:error.message});
        }
    };

          // 5. ADMIN: Actualizar estado del pedido

          export const updateOrderStatus =  async (req,res) => {
            try{
                const orderId = req.params.id;
                const {status}=req.body;

                const validStatuses=["pendiente","procesando","enviado","entregado","cancelado"];

                if (!validStatuses.includes(status)){
                    return res.status(400).json({
                        message: "Estado invalido",
                        estados_validos: validStatuses
                    });
                }
                
const  order =await OrderModel.findByPk(orderId);

                if (!order ){
                    return res.status(404).json({message:"Pedido no encontrado"});
                }
                order .status=status;
                await order.save();

                res.status(200).json(
                    {
                        message:"estado del pedido actualizado con exito",
                        order 
                    }
                );

            } catch (error){
                console.error('error en updateOrderStatus',error);
                res.status(500).json({error:error.message});


            }
        };

        //6 CLIENTE:cancelar pedido (solo si esta pendiente)

        export const cancelarOrder= async (req,res)=>{
            try {

                const orderId = req.params.id;
                const userId = req.user.userId;

                const order = await OrderModel.findOne({
                    where: {
                        id:orderId,
                        userId:userId,

                    }
            });

            if (!order){
                return res.status(404).json({message:"pedido no encontrado"});

            }
            if (order.status !== "pendiente") {
                return res.status(400).json({
                    message:"solo se pueden cancelar pedidos en estado pendiente",
                    estado_actual:order.status
                });
            }

            order.status='cancelado';
            await order.save();

            res.status(200).json({
                message:"pedido cancelado exitosamente",order
            });

        } catch (error){

            console.error('error en cancelarOrder',error);
            res.status(500).json({error:error.message});
        }

        };
