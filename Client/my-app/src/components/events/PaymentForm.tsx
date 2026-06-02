import React, { useState } from 'react';
import { PaymentData } from '../../types';
import './PaymentForm.css';

interface Props {
  eventDescription: string;
  unitPrice: number;
  maxQuantity: number;
  onSubmit: (quantity: number, payment: PaymentData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const PaymentForm: React.FC<Props> = ({
  eventDescription,
  unitPrice,
  maxQuantity,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [payment, setPayment] = useState<PaymentData>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [error, setError] = useState('');

  const total = unitPrice * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (quantity < 1 || quantity > maxQuantity) {
      setError(`ניתן לרכוש בין 1 ל-${maxQuantity} כרטיסים`);
      return;
    }
    if (!payment.cardNumber || !payment.cardHolder || !payment.expiryDate || !payment.cvv) {
      setError('יש למלא את כל פרטי התשלום');
      return;
    }
    try {
      await onSubmit(quantity, payment);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.response?.data?.title || 'הרכישה נכשלה');
    }
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <h3>רכישת כרטיסים — {eventDescription}</h3>
      <p className="payment-price">מחיר ליחידה: {unitPrice} ₪</p>

      <label>כמות כרטיסים</label>
      <input
        type="number"
        min={1}
        max={maxQuantity}
        value={quantity}
        onChange={e => setQuantity(Number(e.target.value))}
      />
      <p className="payment-total">סה״כ לתשלום: <strong>{total} ₪</strong></p>

      <label>מספר כרטיס</label>
      <input
        placeholder="1234 5678 9012 3456"
        value={payment.cardNumber}
        onChange={e => setPayment({ ...payment, cardNumber: e.target.value })}
        required
      />

      <label>שם בעל/ת הכרטיס</label>
      <input
        value={payment.cardHolder}
        onChange={e => setPayment({ ...payment, cardHolder: e.target.value })}
        required
      />

      <div className="payment-row">
        <div>
          <label>תוקף (MM/YY)</label>
          <input
            placeholder="12/28"
            value={payment.expiryDate}
            onChange={e => setPayment({ ...payment, expiryDate: e.target.value })}
            required
          />
        </div>
        <div>
          <label>CVV</label>
          <input
            type="password"
            maxLength={4}
            value={payment.cvv}
            onChange={e => setPayment({ ...payment, cvv: e.target.value })}
            required
          />
        </div>
      </div>

      {error && <p className="payment-error">{error}</p>}

      <div className="payment-actions">
        <button type="submit" disabled={loading || maxQuantity < 1}>
          {loading ? 'מעבד...' : `שלם ${total} ₪`}
        </button>
        <button type="button" onClick={onCancel} disabled={loading}>ביטול</button>
      </div>
    </form>
  );
};

export default PaymentForm;
