import React, { useState } from 'react';
import { Building2, Globe, Mail, Phone, FileText, MapPin, Briefcase, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { OrganizationsService } from '../api/users';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router';

const OnboardingOrgForm = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        companyName: '',
        industryType: '',
        country: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth0();
    const navigate = useNavigate();
    const totalSteps = 3;

    const industries = [
        'Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing',
        'Education', 'Real Estate', 'Consulting', 'Media', 'Other'
    ];

    const countries = [
        'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
        'France', 'Japan', 'Singapore', 'India', 'Brazil', 'Other'
    ];

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        setError(null);
    };

    const handleNext = () => {
        if (step === 1 && !formData.companyName.trim()) {
            setError('Company name is required');
            return;
        }
        if (step === 2 && !formData.contactEmail.trim()) {
            setError('Contact email is required');
            return;
        }
        setError(null);
        setStep(step + 1);
    };

    const handleBack = () => {
        setError(null);
        setStep(step - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await OrganizationsService.onboardOrganization(
                user?.sub,
                {
                    companyName: formData.companyName,
                    metadata: {
                        industryType: formData.industryType,
                        country: formData.country,
                        contactEmail: formData.contactEmail,
                        contactPhone: formData.contactPhone,
                        website: formData.website,
                        description: formData.description
                    }
                },
                user?.sub // use actual userId
            );
            if (res && res.success) {
                // Optionally: show a success message or animation here
                await new Promise(resolve => setTimeout(resolve, 300)); // short delay for UX
                window.location.href = '/dashboard';
            } else {
                setError('Onboarding failed. Please try again.');
            }
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || 'Onboarding failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome aboard!</h1>
                    <p className="text-slate-600">Let's set up your organization in just a few steps</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        {[1, 2, 3].map((num) => (
                            <React.Fragment key={num}>
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${num < step
                                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                                            : num === step
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-100'
                                                : 'bg-white border-2 border-slate-200 text-slate-400'
                                            }`}
                                    >
                                        {num < step ? <CheckCircle2 className="w-5 h-5" /> : num}
                                    </div>
                                    <span className={`text-xs mt-2 font-medium ${num === step ? 'text-blue-600' : 'text-slate-500'}`}>
                                        {num === 1 ? 'Company' : num === 2 ? 'Contact' : 'Details'}
                                    </span>
                                </div>
                                {num < totalSteps && (
                                    <div className={`flex-1 h-1 mx-3 rounded-full ${num < step ? 'bg-green-500' : 'bg-slate-200'}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                    <div>
                        {/* Step 1: Company Information */}
                        {step === 1 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <Sparkles className="w-5 h-5 text-blue-600" />
                                        <h2 className="text-xl font-bold text-slate-900">Company Information</h2>
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <Building2 className="w-4 h-4 text-blue-600" />
                                        Company Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.companyName}
                                        onChange={(e) => handleChange('companyName', e.target.value)}
                                        placeholder="Enter your company name"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <Briefcase className="w-4 h-4 text-blue-600" />
                                        Industry Type
                                    </label>
                                    <select
                                        value={formData.industryType}
                                        onChange={(e) => handleChange('industryType', e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                                        disabled={loading}
                                    >
                                        <option value="">Select your industry</option>
                                        {industries.map((industry) => (
                                            <option key={industry} value={industry}>
                                                {industry}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                        Country
                                    </label>
                                    <select
                                        value={formData.country}
                                        onChange={(e) => handleChange('country', e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                                        disabled={loading}
                                    >
                                        <option value="">Select your country</option>
                                        {countries.map((country) => (
                                            <option key={country} value={country}>
                                                {country}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Contact Information */}
                        {step === 2 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <Mail className="w-5 h-5 text-blue-600" />
                                        <h2 className="text-xl font-bold text-slate-900">Contact Information</h2>
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <Mail className="w-4 h-4 text-blue-600" />
                                        Contact Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.contactEmail}
                                        onChange={(e) => handleChange('contactEmail', e.target.value)}
                                        placeholder="contact@company.com"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <Phone className="w-4 h-4 text-blue-600" />
                                        Contact Phone
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.contactPhone}
                                        onChange={(e) => handleChange('contactPhone', e.target.value)}
                                        placeholder="+1 (555) 000-0000"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <Globe className="w-4 h-4 text-blue-600" />
                                        Website
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.website}
                                        onChange={(e) => handleChange('website', e.target.value)}
                                        placeholder="https://www.company.com"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Additional Details */}
                        {step === 3 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                        <h2 className="text-xl font-bold text-slate-900">Tell us more</h2>
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <FileText className="w-4 h-4 text-blue-600" />
                                        Company Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        placeholder="Tell us about your company, what you do, and what you're looking to achieve..."
                                        rows={6}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-slate-900 placeholder:text-slate-400"
                                        disabled={loading}
                                    />
                                    <p className="text-xs text-slate-500 mt-2">Optional: Help us understand your business better</p>
                                </div>

                                {/* Summary */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                        Summary
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Company:</span>
                                            <span className="font-medium text-slate-900">{formData.companyName || '-'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Industry:</span>
                                            <span className="font-medium text-slate-900">{formData.industryType || '-'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Country:</span>
                                            <span className="font-medium text-slate-900">{formData.country || '-'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Email:</span>
                                            <span className="font-medium text-slate-900">{formData.contactEmail || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <p className="text-red-700 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex gap-3 mt-8">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Back
                                </button>
                            )}
                            {step < totalSteps ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Continue
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading || !formData.companyName || !formData.contactEmail}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-5 h-5" />
                                            Create Organization
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-sm text-slate-600">
                        Need help? <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Contact support</a>
                    </p>
                </div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};

export default OnboardingOrgForm;