// src/components/modals/ModalTurnoDelivery/index.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** Modal ***REMOVED*** from '../../ui/Modal';
import ***REMOVED*** ThemeInput ***REMOVED*** from '../../ui/ThemeInput';
import ***REMOVED*** DollarSign, Heart, Package, Navigation, Fuel ***REMOVED*** from 'lucide-react';


const ModalTurnoDelivery = (***REMOVED*** isOpen, onClose, turno ***REMOVED***) => ***REMOVED***
  const [formData, setFormData] = useState(***REMOVED***
    fecha: '',
    horaInicio: '',
    horaFin: '',
    gananciaTotal: '',
    propinas: '',
    cantidadPedidos: '',
    kilometros: '',
    gastosCombustible: ''
  ***REMOVED***);

  return (
    <Modal isOpen=***REMOVED***isOpen***REMOVED*** onClose=***REMOVED***onClose***REMOVED*** title="Turno de Delivery">
      <form className="space-y-4">
        ***REMOVED***/* Campos de fecha y hora igual que turno normal */***REMOVED***
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Detalles de ganancias</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <ThemeInput
              label="Ganancia total"
              icon=***REMOVED***DollarSign***REMOVED***
              type="number"
              step="0.01"
              placeholder="0.00"
              required
            />
            
            <ThemeInput
              label="Propinas"
              icon=***REMOVED***Heart***REMOVED***
              type="number"
              step="0.01"
              placeholder="0.00"
            />
          </div>
          
          <ThemeInput
            label="Cantidad de pedidos"
            icon=***REMOVED***Package***REMOVED***
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
              icon=***REMOVED***Navigation***REMOVED***
              type="number"
              step="0.1"
              placeholder="0.0"
            />
            
            <ThemeInput
              label="Gastos combustible"
              icon=***REMOVED***Fuel***REMOVED***
              type="number"
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
***REMOVED***;

export default ModalTurnoDelivery;