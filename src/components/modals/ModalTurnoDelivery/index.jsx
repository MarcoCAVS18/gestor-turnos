// src/components/modals/ModalTurnoDelivery/index.jsx
import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { ThemeInput } from '../../ui/ThemeInput';
import { DollarSign, Heart, Package, Navigation, Fuel } from 'lucide-react';


const ModalTurnoDelivery = ({ isOpen, onClose, turno }) => {
  const [formData, setFormData] = useState({
    fecha: '',
    horaInicio: '',
    horaFin: '',
    gananciaTotal: '',
    propinas: '',
    cantidadPedidos: '',
    kilometros: '',
    gastosCombustible: ''
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Turno de Delivery">
      <form className="space-y-4">
        {/* Campos de fecha y hora igual que turno normal */}
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Detalles de ganancias</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <ThemeInput
              label="Ganancia total"
              icon={DollarSign}
              type="number"
              step="0.01"
              placeholder="0.00"
              required
            />
            
            <ThemeInput
              label="Propinas"
              icon={Heart}
              type="number"
              step="0.01"
              placeholder="0.00"
            />
          </div>
          
          <ThemeInput
            label="Cantidad de pedidos"
            icon={Package}
            type="number"
            placeholder="0"
            className="mt-4"
          />
        </div>
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Datos adicionales (opcional)</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <ThemeInput
              label="Kilómetros recorridos"
              icon={Navigation}
              type="number"
              step="0.1"
              placeholder="0.0"
            />
            
            <ThemeInput
              label="Gastos combustible"
              icon={Fuel}
              type="number"
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ModalTurnoDelivery;