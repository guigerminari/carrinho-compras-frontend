import Modal from 'react-modal';
import closeImg from '../../assets/images/close.svg';
import { Conteiner, Total } from './styles';
import { FormEvent, useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { ProductTable } from '../../pages/Cart/styles';

Modal.setAppElement('#root');

type FinishOrderProps = {
    isOpen: boolean;
    onRequestClose: () => void;
}

export function FinishOrderModal({isOpen, onRequestClose}: FinishOrderProps){
    const {finishOrder, cart} = useCart();
    const [payment_form, setPaymentForm] = useState('');

    const cartFormatted = cart.map(product => ({
        ...product,
        priceFormatted: formatPrice(product.price),
        subTotal: formatPrice(product.price * product.amount)
    }));

    const total = cartFormatted.reduce(function(total, product) {
        return total + (product.price * product.amount);
    },0);

    async function handleFinishOrderComplete(event: FormEvent){
        event.preventDefault();
        await finishOrder({
            payment_form,
            cart
        });

        setPaymentForm('');
        onRequestClose();
    }

    return (
        <Modal 
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <button
                type='button'
                onClick={onRequestClose}
                className='react-modal-close'>
                <img src={closeImg} alt="Voltar às Compras" />
            </button>
            <Conteiner onSubmit={handleFinishOrderComplete}>
                <h2>Finalizar Pedido</h2>
                <ProductTable>
                    <thead>
                        <tr>
                            <th>PRODUTO</th>
                            <th>QTD</th>
                            <th>SUBTOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                    {cartFormatted.map(product => (
                        <tr data-testid="product" key={product.id}>
                            <td>
                                <strong>{product.title}</strong>
                                <span>{product.priceFormatted}</span>
                            </td>
                            <td>
                                <div>
                                    <span>{product.amount}</span>
                                </div>
                            </td>
                            <td>
                                <strong>{product.subTotal}</strong>
                            </td>
                        </tr>            
                    ))}
                    </tbody>
                </ProductTable>
                <input 
                    type="text"
                    placeholder='Forma de Pagamento'
                    value={payment_form}
                    onChange={event => setPaymentForm(event.target.value)}
                />
                <Total>
                    <span>TOTAL</span>
                    <strong>{formatPrice(total)}</strong>
                </Total>
                <button type="submit">EFETUAR PAGAMENTO</button>

            </Conteiner>
        </Modal>
    );
}