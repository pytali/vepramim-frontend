"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { LoginSelector } from "./components/LoginSelector"
import { SignalWarningDialog } from "./components/SignalWarningDialog"
import { StepIndicator } from "./components/StepIndicator"
import { Step1SelectOnu } from "./components/Step1SelectOnu"
import { Step2AssociateClient } from "./components/Step2AssociateClient"
import { Step3ConfigureOnu } from "./components/Step3ConfigureOnu"
import { Step4ConfirmAuthorize } from "./components/Step4ConfirmAuthorize"
import { useOnuActivation } from "./hooks/useOnuActivation"
import { UserHeader } from "@/components/user-header"

export default function OnuActivationPage() {
    const router = useRouter()
    const {
        loading,
        authorizingOnu,
        unauthorizedOnus,
        selectedOnu,
        onuName,
        connectionType,
        serverType,
        error,
        successMessage,
        currentStep,
        signalInfo,
        showSignalWarning,
        copiedToClipboard,
        searchQuery,
        searchingClient,
        showLoginSelector,
        availableLogins,
        selectedLogin,
        totalSteps,
        setOnuName,
        setConnectionType,
        setServerType,
        setShowSignalWarning,
        setShowLoginSelector,
        setSearchQuery,
        fetchUnauthorizedOnus,
        handleSelectOnu,
        authorizeOnu,
        goToNextStep,
        goToPreviousStep,
        resetProcess,
        copyOnuDetailsToClipboard,
        handleLoginSelect,
        searchClient,
    } = useOnuActivation();

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Step1SelectOnu
                        loading={loading}
                        error={error}
                        unauthorizedOnus={unauthorizedOnus}
                        selectedOnu={selectedOnu}
                        onSelectOnu={handleSelectOnu}
                        onRefreshList={fetchUnauthorizedOnus}
                        onNext={goToNextStep}
                    />
                )
            case 2:
                return (
                    <Step2AssociateClient
                        selectedOnu={selectedOnu}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        searchingClient={searchingClient}
                        error={error}
                        selectedLogin={selectedLogin}
                        onSearchClient={searchClient}
                        onPrevious={goToPreviousStep}
                        onNext={goToNextStep}
                    />
                )
            case 3:
                return (
                    <Step3ConfigureOnu
                        selectedOnu={selectedOnu}
                        selectedLogin={selectedLogin}
                        onuName={onuName}
                        connectionType={connectionType}
                        serverType={serverType}
                        setOnuName={setOnuName}
                        setConnectionType={setConnectionType}
                        setServerType={setServerType}
                        onPrevious={goToPreviousStep}
                        onNext={goToNextStep}
                    />
                )
            case 4:
                return (
                    <Step4ConfirmAuthorize
                        selectedOnu={selectedOnu}
                        selectedLogin={selectedLogin}
                        onuName={onuName}
                        connectionType={connectionType}
                        serverType={serverType}
                        authorizingOnu={authorizingOnu}
                        successMessage={successMessage}
                        signalInfo={signalInfo}
                        copiedToClipboard={copiedToClipboard}
                        onPrevious={goToPreviousStep}
                        onAuthorize={authorizeOnu}
                        onCopyDetails={copyOnuDetailsToClipboard}
                        onReset={resetProcess}
                    />
                )
            default:
                return null
        }
    }

    return (
        <>
            <SignalWarningDialog
                isOpen={showSignalWarning}
                onClose={() => setShowSignalWarning(false)}
                signalInfo={signalInfo}
            />

            <LoginSelector
                isOpen={showLoginSelector}
                onClose={() => setShowLoginSelector(false)}
                logins={availableLogins}
                onSelect={handleLoginSelect}
            />

            <div className="min-h-screen gradient-bg">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-blue-500/10 blur-[150px]"></div>
                    <div className="absolute bottom-1/3 right-1/3 w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[150px]"></div>
                </div>

                <UserHeader />

                <main className="relative z-10 container mx-auto p-6 pt-8">
                    <div className="flex items-center mb-6">
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/dashboard")}
                            className="rounded-full bg-gray-200/50 hover:bg-gray-200/80 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-white mr-3"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-xl font-medium text-gray-900 dark:text-white">Ativação de ONUs</h1>
                    </div>

                    <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
                    {renderStepContent()}
                </main>
            </div>
        </>
    )
} 