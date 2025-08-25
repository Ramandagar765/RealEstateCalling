import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { F, C, L, WT } from '#/commonStyles/style-layout';

const MultiStepForm = ({ 
  steps = [], 
  onComplete, 
  onStepChange,
  nextButtonText = "Next",
  backButtonText = "Previous",
  completeButtonText = "Complete",
  buttonStyle,
  nextButtonStyle,
  backButtonStyle,
  completeButtonStyle,
  buttonTextStyle,
  nextButtonTextStyle,
  backButtonTextStyle,
  completeButtonTextStyle,
  containerStyle,
  buttonContainerStyle,
  showButtons = true,
  // Validation props
  validateStep,
  onValidationError
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const totalSteps = steps.length;

  const validateCurrentStep = async () => {
    if (!validateStep) return true;
    
    try {
      const isValid = await validateStep(currentStep);
      if (!isValid) {
        setValidationErrors(prev => ({ ...prev, [currentStep]: true }));
        onValidationError?.(currentStep);
        return false;
      }
      setValidationErrors(prev => ({ ...prev, [currentStep]: false }));
      return true;
    } catch (error) {
      console.error('Validation error:', error);
      setValidationErrors(prev => ({ ...prev, [currentStep]: true }));
      onValidationError?.(currentStep, error);
      return false;
    }
  };

  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      const isValid = await validateCurrentStep();
      if (!isValid) return;
      
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange?.(nextStep);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onStepChange?.(prevStep);
    }
  };

  const handleComplete = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return;
    
    onComplete?.();
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const hasValidationError = validationErrors[currentStep];

  return (
    <View style={[L.f1, containerStyle]}>
      {steps[currentStep]}
      {showButtons && (
        <View style={[L.fdR, L.jcSB, L.pH20, L.pV15, { gap: 10 }, buttonContainerStyle]}>
          {!isFirstStep && (
            <TouchableOpacity 
              onPress={handlePrevious} 
              style={[L.pV12,L.pH22,L.bR8,L.aiC,L.jcC,C.bgLGray,WT(120),buttonStyle,backButtonStyle]}>
              <Text style={[F.fs16,F.fw5,C.fcGray,buttonTextStyle, backButtonTextStyle]}>{backButtonText}</Text>
            </TouchableOpacity>
          )}
          <View style={[L.f1, L.aiR,L.jcC]}>
            {!isLastStep ? (
              <TouchableOpacity 
                onPress={handleNext} 
                style={[
                  L.pV12,
                  L.pH25,
                  L.bR8,
                  L.aiC,
                  L.jcC,
                  hasValidationError ? C.bgRed : C.bgBlue,
                  WT(120),
                  buttonStyle, 
                  nextButtonStyle
                ]}>
                <Text style={[F.fs16,F.fw5,C.fcWhite,buttonTextStyle, nextButtonTextStyle]}>
                  {nextButtonText}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                onPress={handleComplete} 
                style={[
                  L.pV12,
                  L.bR8,
                  L.aiC,
                  L.jcC,
                  hasValidationError ? C.bgRed : C.bgGreen,
                  WT(120),
                  buttonStyle, 
                  completeButtonStyle
                ]}>
                <Text style={[F.fs16,F.fw5,C.fcWhite,buttonTextStyle, completeButtonTextStyle]}>
                  {completeButtonText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default MultiStepForm;