
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useWizard } from '@/context/WizardContext';
import { Step1_DBConfig } from '@/components/wizard/Step1_DBConfig';
import { Step2_SchemaSelection } from '@/components/wizard/Step2_SchemaSelection';
import { Step3_DryRunValidation } from '@/components/wizard/Step3_DryRunValidation';
import { Step4_ManualOptions } from '@/components/wizard/Step4_ManualOptions';
import { Step5_Preview } from '@/components/wizard/Step5_Preview';
import { Step6_MigrationConsole } from '@/components/wizard/Step6_MigrationConsole';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

const steps = [
  { number: 1, title: 'Database Configuration', component: Step1_DBConfig },
  { number: 2, title: 'Schema Selection', component: Step2_SchemaSelection },
  { number: 3, title: 'Dry Run & Validation', component: Step3_DryRunValidation },
  { number: 4, title: 'Manual Rules & Options', component: Step4_ManualOptions },
  { number: 5, title: 'Preview & Confirm', component: Step5_Preview },
  { number: 6, title: 'Migration Console', component: Step6_MigrationConsole },
];

export default function MigrationWizard() {
  const { state, dispatch } = useWizard();
  const currentStepData = steps[state.currentStep - 1];
  const CurrentStepComponent = currentStepData.component;

  const nextStep = () => {
    if (state.currentStep < steps.length) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
    }
  };

  const prevStep = () => {
    if (state.currentStep > 1) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep - 1 });
    }
  };

  const resetWizard = () => {
    dispatch({ type: 'RESET_WIZARD' });
  };

  const progressPercentage = (state.currentStep / steps.length) * 100;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Migration Wizard</h1>
          <p className="text-muted-foreground mt-1">
            Step {state.currentStep} of {steps.length}: {currentStepData.title}
          </p>
        </div>
        <Button variant="outline" onClick={resetWizard} className="flex items-center space-x-2">
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </Button>
      </div>

      {/* Progress Bar */}
      <Card className="migration-card">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="text-foreground">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            
            {/* Step Indicators */}
            <div className="flex justify-between mt-6">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center space-y-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      step.number < state.currentStep
                        ? 'wizard-step-completed'
                        : step.number === state.currentStep
                        ? 'wizard-step-active'
                        : 'wizard-step-inactive'
                    }`}
                  >
                    {step.number}
                  </div>
                  <span
                    className={`text-xs text-center max-w-20 leading-tight ${
                      step.number === state.currentStep ? 'text-foreground font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      <Card className="migration-card">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">
            {currentStepData.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <CurrentStepComponent />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={state.currentStep === 1}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>

        <div className="text-sm text-muted-foreground">
          Step {state.currentStep} of {steps.length}
        </div>

        <Button
          onClick={nextStep}
          disabled={state.currentStep === steps.length}
          className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
