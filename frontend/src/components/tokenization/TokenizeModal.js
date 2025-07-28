import React, { useState } from 'react';
import { CheckCircle, MapPin, Camera, Upload, X } from 'lucide-react';
import { productData } from '../../data/productData';

const TokenizeModal = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [formData, setFormData] = useState({
    cropType: '',
    variety: '',
    quantity: '',
    pricePerUnit: '',
    deliveryDate: '',
    location: '',
    farmSize: '',
    coordinates: '',
    qualityGrade: 'A',
    organicCertified: false,
    estimatedYield: '',
    photos: [],
    description: ''
  });
  const [loading, setLoading] = useState(false);

  // Manejar selección de cultivo
  const handleCropSelection = (cropKey) => {
    console.log('=== DEBUG CROP SELECTION ===');
    console.log('cropKey:', cropKey);
    console.log('productData[cropKey]:', productData[cropKey]);
    
    setSelectedCrop(cropKey);
    setFormData({
      ...formData,
      cropType: cropKey,
      pricePerUnit: productData[cropKey].currentPriceUSD.toString()
    });
    setStep(2);
  };

  // Manejar cambios en el formulario
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Manejar subida de fotos
  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    const photoUrls = files.map(file => URL.createObjectURL(file));
    setFormData({
      ...formData,
      photos: [...formData.photos, ...photoUrls]
    });
  };

  // Remover foto
  const removePhoto = (index) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      photos: newPhotos
    });
  };

  // Validar formulario
  const validateForm = () => {
    const required = ['cropType', 'variety', 'quantity', 'pricePerUnit', 'deliveryDate', 'location'];
    const isValid = required.every(field => formData[field]);
    
    console.log('=== VALIDATION DEBUG ===');
    console.log('formData:', formData);
    console.log('required fields:', required);
    required.forEach(field => {
      console.log(`${field}: ${formData[field]} (${!!formData[field] ? 'OK' : 'MISSING'})`);
    });
    console.log('isValid:', isValid);
    
    return isValid;
  };

  // Calcular valor total en USD
  const calculateTotalValueUSD = () => {
    const quantity = parseFloat(formData.quantity) || 0;
    const priceUSD = parseFloat(formData.pricePerUnit) || 0;
    return quantity * priceUSD;
  };

  // Calcular valor total en ETH
  const calculateTotalValueETH = () => {
    const totalUSD = calculateTotalValueUSD();
    const ETH_USD_RATE = 2500; // 1 ETH = $2500
    return totalUSD / ETH_USD_RATE;
  };

  // 🔧 FIX PRINCIPAL: Enviar formulario con conversión correcta
  const handleSubmit = async () => {
    console.log('=== HANDLE SUBMIT CALLED ===');
    console.log('formData antes de validar:', formData);
    
    if (!validateForm()) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setLoading(true);
      
      // 🔧 CONVERSIÓN USD → ETH
      const priceUSD = parseFloat(formData.pricePerUnit);
      const ETH_USD_RATE = 2500; // 1 ETH = $2500
      const priceETH = priceUSD / ETH_USD_RATE;
      
      console.log('=== PRICE CONVERSION ===');
      console.log('Price USD input:', priceUSD);
      console.log('Price ETH converted:', priceETH);
      console.log('Total USD:', calculateTotalValueUSD());
      console.log('Total ETH:', calculateTotalValueETH());
      
      // 🔧 PREPARAR DATOS PARA EL CONTRATO
      // El contrato espera pricePerQuintal, no pricePerUnit
      const contractData = {
        cropType: formData.cropType,
        variety: formData.variety,
        quantity: parseInt(formData.quantity),
        pricePerQuintal: priceETH, // ✅ Enviar en ETH
        deliveryDate: formData.deliveryDate,
        location: formData.location,
        qualityGrade: formData.qualityGrade,
        organicCertified: formData.organicCertified,
        description: formData.description,
        // Mantener referencia para UI
        pricePerUnitUSD: priceUSD,
        totalValueUSD: calculateTotalValueUSD(),
        totalValueETH: calculateTotalValueETH()
      };
      
      console.log('=== SENDING TO CONTRACT ===');
      console.log('contractData:', contractData);
      
      const result = await onSubmit(contractData);
      console.log('onSubmit result:', result);
      
      if (result && result.success) {
        console.log('✅ Token creado exitosamente');
        onClose();
      } else {
        console.error('❌ Error en resultado:', result);
        alert('Error al crear el token: ' + (result?.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('❌ Error en handleSubmit:', error);
      alert('Error al crear el token: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
        {/* Header del modal */}
        <div className="sticky top-0 bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Tokenizar Cosecha</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Paso {step} de 4</span>
              <span className="text-sm text-gray-600">{Math.round((step / 4) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Paso 1: Selección de Cultivo */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-4">Selecciona tu Cultivo</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(productData).map(([key, crop]) => (
                  <button
                    key={key}
                    onClick={() => handleCropSelection(key)}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{crop.emoji}</div>
                      <div>
                        <div className="font-bold">{crop.name}</div>
                        <div className="text-sm text-gray-600">
                          ${crop.currentPriceUSD}/{crop.unit}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Paso 2: Detalles del Cultivo */}
          {step === 2 && selectedCrop && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                {productData[selectedCrop].emoji}
                Detalles de {productData[selectedCrop].name}
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Variedad *
                  </label>
                  <select
                    value={formData.variety}
                    onChange={(e) => handleInputChange('variety', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Selecciona variedad</option>
                    {productData[selectedCrop].varieties.map(variety => (
                      <option key={variety} value={variety}>{variety}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grado de Calidad *
                  </label>
                  <select
                    value={formData.qualityGrade}
                    onChange={(e) => handleInputChange('qualityGrade', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    {productData[selectedCrop].grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad ({productData[selectedCrop].unit}) *
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Ej: 50"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio por {productData[selectedCrop].unit} ($USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.pricePerUnit}
                    onChange={(e) => handleInputChange('pricePerUnit', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder={`$${productData[selectedCrop].currentPriceUSD}`}
                    min="0"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Equivale a ~{((parseFloat(formData.pricePerUnit) || 0) / 2500).toFixed(6)} ETH
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Entrega *
                  </label>
                  <input
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.organicCertified}
                      onChange={(e) => handleInputChange('organicCertified', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Certificación Orgánica</span>
                  </label>
                </div>
              </div>

              {/* Resumen de valor */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-800 mb-2">💰 Resumen Financiero</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Valor Total (USD):</span>
                    <span className="font-bold">${calculateTotalValueUSD().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor Total (ETH):</span>
                    <span className="font-bold">{calculateTotalValueETH().toFixed(6)} ETH</span>
                  </div>
                  <div className="flex justify-between text-green-700">
                    <span>Pago Inmediato (70%):</span>
                    <span className="font-bold">${(calculateTotalValueUSD() * 0.7).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-blue-700">
                    <span>Pago al Entregar (30%):</span>
                    <span className="font-bold">${(calculateTotalValueUSD() * 0.3).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300"
                >
                  Atrás
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.variety || !formData.quantity || !formData.pricePerUnit || !formData.deliveryDate}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Paso 3: Información de la Finca */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-blue-600" />
                Información de la Finca
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ubicación de la Finca *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Ej: Tenguel, Guayas, Ecuador"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tamaño de la Finca (hectáreas)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.farmSize}
                    onChange={(e) => handleInputChange('farmSize', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Ej: 7.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rendimiento Estimado (por hectárea)
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedYield}
                    onChange={(e) => handleInputChange('estimatedYield', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Ej: 15 quintales/ha"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción Adicional
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    rows="3"
                    placeholder="Describe tu finca, métodos de cultivo, certificaciones, etc."
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300"
                >
                  Atrás
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!formData.location}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Paso 4: Fotos y Confirmación */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CheckCircle size={20} className="text-green-600" />
                Confirmación Final
              </h3>

              {/* Upload de fotos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fotos de la Cosecha/Finca (opcional)
                </label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload size={32} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Haz clic para subir fotos o arrastra aquí
                    </span>
                  </label>
                </div>

                {/* Preview de fotos */}
                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Resumen final */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold mb-3">📋 Resumen del Token</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Cultivo:</span>
                    <span>{productData[selectedCrop]?.name} - {formData.variety}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cantidad:</span>
                    <span>{formData.quantity} {productData[selectedCrop]?.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Precio USD:</span>
                    <span>${formData.pricePerUnit}/{productData[selectedCrop]?.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Precio ETH:</span>
                    <span>{((parseFloat(formData.pricePerUnit) || 0) / 2500).toFixed(6)} ETH/{productData[selectedCrop]?.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Calidad:</span>
                    <span>{formData.qualityGrade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Entrega:</span>
                    <span>{formData.deliveryDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ubicación:</span>
                    <span>{formData.location}</span>
                  </div>
                  <div className="flex justify-between font-bold text-green-600 border-t pt-2">
                    <span>Valor Total:</span>
                    <span>${calculateTotalValueUSD().toLocaleString()} ({calculateTotalValueETH().toFixed(6)} ETH)</span>
                  </div>
                </div>
              </div>

              {/* Términos y condiciones */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-blue-800 mb-2">📄 Términos del Token</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Recibirás 70% del valor inmediatamente</li>
                  <li>• 30% restante al confirmar entrega</li>
                  <li>• Token válido hasta fecha de entrega</li>
                  <li>• Comisión de plataforma: 2.5%</li>
                  <li>• Compromiso legal de entrega</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300"
                >
                  Atrás
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-bold disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creando...
                    </>
                  ) : (
                    '🌾 Crear Token de Cosecha'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenizeModal;