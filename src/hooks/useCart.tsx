import { useEffect, useRef } from 'react';
import { createContext, ReactNode, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface Order {
  payment_form: string;
  cart: Product[];
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  finishOrder: (order: Order) => Promise<void>;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  let history = useHistory();
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = JSON.parse(localStorage.getItem('@RocketShoes:cart') || '[]');

    if (storagedCart) {
      return storagedCart;
    }

    return [];
  });

  const prevCartRef = useRef<Product[]>();

  useEffect(() => {
    prevCartRef.current = cart;
  });

  const cartPreviousValue = prevCartRef.current ?? cart;

  useEffect(() => {
    if(cartPreviousValue !== cart){
      localStorage.setItem('@RocketShoes:cart',JSON.stringify(cart));
    }
  },[cart,cartPreviousValue]);

  const addProduct = async (productId: number) => {

    try{
      const updateCart = [...cart];
      const productExists = updateCart.find(product => product.id === productId);

      const stock = await api.get(`/stock/?id=${productId}`);

      const stockAmount = stock.data === false ? 0 : stock.data.amount;
      const currentAmount = productExists ? productExists.amount : 0;
      const amount = currentAmount + 1;

      if(amount > stockAmount){
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      if(productExists){
        productExists.amount = amount;
      }else{
        const product = await api.get(`/products/?id=${productId}`);

        const newProduct = {
          ...product.data,
          amount: 1
        }
        updateCart.push(newProduct);
      }

      setCart(updateCart);
    }catch{
      toast.error('Erro na adi????o do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const updatedCart = [...cart];
      const productIndex = updatedCart.findIndex(product => product.id === productId);

      if(productIndex >= 0){
        updatedCart.splice(productIndex,1);
        setCart(updatedCart);
      }else{
        throw Error();
      }

    } catch {
      toast.error('Erro na remo????o do produto');
    }
  };

  const finishOrder = async (order: Order) => {
    try {

      const response = await api.post('/order/create.php', JSON.stringify(order));
      
      if(response.status === 200){
        setCart([]);
        toast.success('Pedido realizado com sucesso!');
        
        history.push("/");
      }else{
        toast.error('Erro na finaliza????o do pedido');
      }

    } catch {
      toast.error('Erro na finaliza????o do pedido');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if(amount <= 0){
        return;
      }

      const stock = await api.get(`/stock/?id=${productId}`);

      const stockAmount = stock.data === false ? 0 : stock.data.amount;
      const updateCart = [...cart];
      const productExists = updateCart.find(product => product.id === productId);

      if(amount > stockAmount && productExists){
        productExists.amount = stockAmount;

        toast.error('Quantidade solicitada fora de estoque');
      }else if(productExists){
        productExists.amount = amount;
      }

      setCart(updateCart);

    } catch {
      toast.error('Erro na altera????o de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount, finishOrder }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
