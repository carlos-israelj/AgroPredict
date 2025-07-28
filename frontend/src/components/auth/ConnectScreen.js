import React, { useState } from 'react';
import { DollarSign, TrendingUp, Users, Smartphone, HelpCircle, Phone, MessageCircle, ChevronRight, CheckCircle, Wifi, WifiOff } from 'lucide-react';

const ImprovedConnectScreen = ({ 
  onConnect, 
  loading = false, 
  error = '',
  onClearError 
}) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Detectar cambios de conexión
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const benefits = [
    {
      icon: <DollarSign className="text-green-600" size={24} />,
      title: "Gana $1,250 más por cosecha",
      description: "Carlos vendía a $115/quintal al intermediario. Ahora vende a $140 directo.",
      highlight: "25 quintales = $625 extra"
    },
    {
      icon: <TrendingUp className="text-blue-600" size={24} />,
      title: "Sabe cuándo vender",
      description: "Te avisamos cuando el precio va a subir para que no vendas barato",
      highlight: "Predicciones 85% exactas"
    },
    {
      icon: <Users className="text-purple-600" size={24} />,
      title: "200+ cacaoteros ya lo usan",
      description: "Agricultores de Tenguel, Balao y Machala ya están ganando más",
      highlight: "Promedio: +$850 por cosecha"
    }
  ];

  const tutorialSteps = [
    {
      title: "¿Qué es una cuenta digital?",
      content: "Es como tu cuenta del banco, pero en tu celular. Tu dinero está seguro y solo tú lo controlas.",
      icon: <Smartphone className="text-blue-600" size={32} />,
      analogy: "Como tu cuenta de Tigo Money, pero internacional"
    },
    {
      title: "¿Para qué la necesito?",
      content: "Para recibir tu dinero cuando vendas tu cacao. Es más rápido y seguro que esperar cheques.",
      icon: <DollarSign className="text-green-600" size={32} />,
      analogy: "El comprador te paga en segundos, no en semanas"
    },
    {
      title: "¿Es difícil de usar?",
      content: "¡Para nada! Si sabes usar WhatsApp, sabes usar esto. Botones grandes y claros.",
      icon: <CheckCircle className="text-green-600" size={32} />,
      analogy: "Más fácil que sacar dinero del cajero"
    }
  ];

  const getErrorMessage = (error) => {
    if (error.includes('MetaMask')) {
      return {
        title: "Necesitas instalar MetaMask",
        message: "Es tu billetera digital. Te ayudamos a instalarla paso a paso.",
        action: "Instalar MetaMask",
        actionUrl: "https://metamask.io/download/"
      };
    }
    if (error.includes('network') || error.includes('red')) {
      return {
        title: "Problema de conexión",
        message: "Revisa tu conexión a internet o intenta de nuevo en unos minutos.",
        action: "Intentar de nuevo",
        actionUrl: null
      };
    }
    if (error.includes('user rejected')) {
      return {
        title: "Conexión cancelada",
        message: "Para usar AgroPredict necesitas conectar tu cuenta digital.",
        action: "Intentar de nuevo",
        actionUrl: null
      };
    }
    return {
      title: "Algo salió mal",
      message: error,
      action: "Intentar de nuevo",
      actionUrl: null
    };
  };

  const handleConnect = () => {
    if (!isOnline) {
      alert("Necesitas conexión a internet para conectar tu cuenta");
      return;
    }
    
    console.log("Iniciando proceso de conexión...");
    onConnect();
  };

  if (showTutorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            {tutorialSteps[currentStep].icon}
            <h2 className="text-xl font-bold text-gray-800 mt-4 mb-2">
              {tutorialSteps[currentStep].title}
            </h2>
            <p className="text-gray-600 mb-3">
              {tutorialSteps[currentStep].content}
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-700 text-sm font-medium">
                💡 {tutorialSteps[currentStep].analogy}
              </p>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full mx-1 transition-colors ${
                  index === currentStep ? 'bg-green-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Atrás
              </button>
            )}
            
            {currentStep < tutorialSteps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                Siguiente
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => setShowTutorial(false)}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                ¡Entendido!
              </button>
            )}
          </div>

          <button
            onClick={() => setShowTutorial(false)}
            className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Ya sé cómo funciona →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full">
        {/* Status de conexión */}
        {!isOnline && (
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2">
            <WifiOff size={16} className="text-orange-600" />
            <p className="text-orange-700 text-sm font-medium">
              Sin internet. Revisa tu conexión para continuar.
            </p>
          </div>
        )}

        {/* Header con value proposition */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🌾</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AgroPredict</h1>
          <p className="text-lg text-gray-600 mb-4">
            Vende tu cacao directo al comprador, sin intermediarios
          </p>
          <div className="bg-green-100 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-bold text-lg">
              💰 Agricultores ganan hasta <span className="text-xl">$1,250 más</span>
            </p>
            <p className="text-green-700 text-sm mt-1">
              Por cada 50 quintales de cacao
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-4 mb-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-shrink-0 mt-1">
                {benefit.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">{benefit.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{benefit.description}</p>
                <p className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded font-medium inline-block">
                  {benefit.highlight}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Error message mejorado */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-red-600 text-xl">⚠️</div>
              <div className="flex-1">
                <h4 className="font-semibold text-red-800 mb-1">
                  {getErrorMessage(error).title}
                </h4>
                <p className="text-red-700 text-sm mb-3">
                  {getErrorMessage(error).message}
                </p>
                <div className="flex gap-2">
                  {getErrorMessage(error).actionUrl ? (
                    <a
                      href={getErrorMessage(error).actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      {getErrorMessage(error).action}
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        onClearError();
                        handleConnect();
                      }}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      {getErrorMessage(error).action}
                    </button>
                  )}
                  {onClearError && (
                    <button
                      onClick={onClearError}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Cerrar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main CTA */}
        <div className="space-y-3">
          <button
            onClick={handleConnect}
            disabled={loading || !isOnline}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Configurando tu cuenta...
              </>
            ) : (
              <>
                <Smartphone size={24} />
                Crear mi cuenta gratis
              </>
            )}
          </button>

          <button
            onClick={() => setShowTutorial(true)}
            className="w-full text-green-600 py-3 px-4 rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium border border-green-200"
          >
            <HelpCircle size={16} />
            ¿Cómo funciona? (Tutorial de 2 minutos)
          </button>
        </div>

        {/* Support con WhatsApp prominente */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">¿Necesitas ayuda para empezar?</p>
          <div className="flex justify-center gap-3">
            <a 
              href="https://wa.me/593999999999?text=Hola,%20necesito%20ayuda%20para%20crear%20mi%20cuenta%20en%20AgroPredict" 
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium shadow"
            >
              <MessageCircle size={16} />
              WhatsApp (Gratis)
            </a>
            <a 
              href="tel:+593999999999" 
              className="flex items-center gap-2 text-green-600 border border-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
            >
              <Phone size={16} />
              Llamar
            </a>
          </div>
        </div>

        {/* Social proof mejorado */}
        <div className="mt-8 text-center border-t pt-6">
          <p className="text-xs text-gray-400 mb-3">Lo que dicen nuestros usuarios:</p>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-100">
            <p className="text-sm text-gray-700 font-medium mb-2">
              "Antes vendía a $115 el quintal. Ahora vendo a $140. 
              Con 50 quintales gané $1,250 más que el año pasado."
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-green-700 font-bold">
                C
              </div>
              <span>Carlos M., Cacaotero - Tenguel, Guayas</span>
              <CheckCircle size={12} className="text-green-600" />
            </div>
          </div>
          
          <p className="text-xs text-gray-400 mt-3">
            <Wifi size={12} className="inline mr-1" />
            Conexión segura • Datos protegidos
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImprovedConnectScreen;