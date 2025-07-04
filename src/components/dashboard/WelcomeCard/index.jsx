// src/components/dashboard/WelcomeCard/index.jsx

import { useApp } from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const WelcomeCard = ({ totalGanado }) => {
  const { userEmoji, thematicColors } = useApp();

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Buenas! {userEmoji}
          </h1>
          <p className="text-gray-600 mt-1">
            Aca tenes un resumen<br />
            de tu actividad
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total ganado</p>
          <p 
            className="text-2xl font-bold"
            style={{ color: thematicColors?.base || '#EC4899' }}
          >
            ${totalGanado.toFixed(2)}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default WelcomeCard;