// src/pages/TestPage.jsx (temporal)
import React from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Card from '../components/ui/Card';

const TestPage = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  
  return (
    <div className="p-6 space-y-4">
      <h1>Prueba de Componentes</h1>
      
      <div className="flex gap-2">
        <Button onClick={() => setModalOpen(true)}>Abrir Modal</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      
      <Input label="Prueba Input" placeholder="Escribe algo..." />
      
      <Card>
        <p>Esta es una tarjeta de prueba</p>
      </Card>
      
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Modal de Prueba"
      >
        <p>Contenido del modal</p>
      </Modal>
    </div>
  );
};

export default TestPage;