import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Loader2, ImagePlus, ChevronRight, ChevronLeft, Check, User, Shirt } from 'lucide-react';
import { toast } from 'sonner';
import { useTryOn } from '@/contexts/TryOnContext';
import { getCategories, getGarments, generateTryons, CategoryItem } from '@/lib/api';

// ─── Step indicator ──────────────────────────────────────────────

function StepDot({ step, current, label }: { step: number; current: number; label: string }) {
    const done = current > step;
    const active = current === step;
    return (
        <div className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${done ? 'bg-blue-600 border-blue-600 text-white'
                : active ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-gray-300 text-gray-400 bg-white'
                }`}>
                {done ? <Check className="h-4 w-4" /> : step}
            </div>
            <span className={`text-xs font-medium ${active ? 'text-blue-600' : done ? 'text-gray-700' : 'text-gray-400'}`}>{label}</span>
        </div>
    );
}

function StepConnector({ done }: { done: boolean }) {
    return <div className={`flex-1 h-0.5 mt-4 transition-colors ${done ? 'bg-blue-600' : 'bg-gray-200'}`} />;
}

// ─── Main Component ───────────────────────────────────────────────

export default function TryOnWizard() {
    const navigate = useNavigate();
    const {
        userFile, userPreview, gender, selectedCategory,
        setUserFile, setUserPreview, setGender, setSelectedCategory,
        setGarments, setTryOnResults, setIsGenerating, resetResults,
    } = useTryOn();

    const [step, setStep] = useState(1);
    const [analyzing, setAnalyzing] = useState(false);
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [loadingCats, setLoadingCats] = useState(false);
    const [generatingProgress, setGeneratingProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── Step 1: Photo upload ─────────────────────────────────────

    const handleFileChange = useCallback((file: File) => {
        setUserFile(file);
        setUserPreview(URL.createObjectURL(file));
        // Fake AI analysis
        setAnalyzing(true);
        setTimeout(() => setAnalyzing(false), 1800);
    }, [setUserFile, setUserPreview]);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) handleFileChange(f);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0];
        if (f && f.type.startsWith('image/')) handleFileChange(f);
    };

    // ── Step 2: Gender + Category ────────────────────────────────

    const handleGenderSelect = async (g: string) => {
        setGender(g);
        setSelectedCategory(null);
        setCategories([]);
        resetResults();
        setLoadingCats(true);
        try {
            const data = await getCategories(g);
            setCategories(data.categories);
        } catch {
            toast.error('Could not load categories. Is the backend running?');
        } finally {
            setLoadingCats(false);
        }
    };

    // ── Step 3: Generate ─────────────────────────────────────────

    const handleGenerate = async () => {
        if (!userFile || !gender || !selectedCategory) return;
        setStep(3);
        setIsGenerating(true);
        setGeneratingProgress(0);

        try {
            // Load garments first
            const gData = await getGarments(gender, selectedCategory.path);
            setGarments(gData.images, gData.filenames);
            setGeneratingProgress(20);

            const prog = setInterval(() => setGeneratingProgress(p => Math.min(p + 5, 85)), 3000);

            const result = await generateTryons(gender, selectedCategory.path, userFile);

            clearInterval(prog);
            setTryOnResults(result.results);
            setIsGenerating(false);
            setGeneratingProgress(100);

            toast.success('Try-ons generated! Redirecting to gallery…');
            setTimeout(() => navigate('/products'), 1000);
        } catch (err) {
            setIsGenerating(false);
            const msg = err instanceof Error ? err.message : 'Generation failed.';
            // 503 means AI models are still warming up
            if (msg.includes('503') || msg.includes('initializing') || msg.includes('warming')) {
                toast.error('⏳ AI models are still warming up. Please wait ~30–60 seconds and try again.', { duration: 6000 });
            } else {
                toast.error(msg);
            }
            setStep(2);
        }
    };

    // ── Render steps ─────────────────────────────────────────────

    return (
        <Layout>
            <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-10 px-4">
                <div className="mx-auto max-w-2xl">
                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Get Started</h1>
                    <p className="text-gray-500 mb-8 text-sm">Complete the steps below to generate your virtual try-ons</p>

                    {/* Progress bar */}
                    <div className="flex items-center mb-10">
                        <StepDot step={1} current={step} label="Upload" />
                        <StepConnector done={step > 1} />
                        <StepDot step={2} current={step} label="Select" />
                        <StepConnector done={step > 2} />
                        <StepDot step={3} current={step} label="Generate" />
                    </div>

                    {/* ── STEP 1 ─────────────────────────────────────────── */}
                    {step === 1 && (
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-1">Upload your Image to Try-On</h2>
                            <p className="text-sm text-gray-500 mb-6">Upload a clear, front-facing photo for best results (Max size: 50MB)</p>

                            {/* Drop zone */}
                            <div
                                className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${userPreview ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/40'
                                    }`}
                                onClick={() => fileInputRef.current?.click()}
                                onDrop={onDrop}
                                onDragOver={e => e.preventDefault()}
                            >
                                {userPreview ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <img src={userPreview} alt="Preview" className="h-48 w-auto rounded-xl object-cover" />
                                        {analyzing && (
                                            <div className="flex items-center gap-2 text-blue-600 text-sm">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                AI analyzing your photo…
                                            </div>
                                        )}
                                        {!analyzing && (
                                            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                                                <Check className="h-4 w-4" /> Photo ready
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-blue-500 mb-4">
                                            <svg width="56" height="48" viewBox="0 0 56 48" fill="none">
                                                <rect width="40" height="34" x="8" y="8" rx="4" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
                                                <rect width="32" height="26" x="4" y="12" rx="4" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
                                                <circle cx="28" cy="25" r="6" fill="#3B82F6" opacity="0.6" />
                                                <path d="M21 34l5-6 4 5 3-3 5 7H21z" fill="#3B82F6" opacity="0.8" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            Drop your files here or{' '}
                                            <span className="text-blue-600 font-medium cursor-pointer hover:underline">browse</span>
                                        </p>
                                        <p className="text-xs text-gray-400">Maximum size: 50MB</p>
                                    </>
                                )}
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onInputChange} />
                            </div>

                            {/* Choose File button */}
                            <div className="mt-6 flex justify-center">
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <ImagePlus className="h-4 w-4 mr-2" />
                                    {userPreview ? 'Change Photo' : 'Choose File'}
                                </Button>
                            </div>

                            {/* Auto-detect preview */}
                            {userPreview && !analyzing && (
                                <div className="mt-6 pt-5 border-t border-gray-100">
                                    <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">AI detected</p>
                                    <div className="flex gap-2 flex-wrap">
                                        <span className="px-3 py-1; bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200 px-3 py-1">👤 Person detected</span>
                                        <span className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full border border-green-200">✓ Good lighting</span>
                                        <span className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full border border-purple-200">🎯 Front-facing</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── STEP 2 ─────────────────────────────────────────── */}
                    {step === 2 && (
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-1">Select Gender & Category</h2>
                                <p className="text-sm text-gray-500">Choose the type of clothing you'd like to try on</p>
                            </div>

                            {/* Gender */}
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                                    <User className="h-4 w-4 text-blue-600" /> Gender
                                </p>
                                <div className="flex gap-3">
                                    {['Men', 'Women', 'Kids'].map(g => (
                                        <button
                                            key={g}
                                            onClick={() => handleGenderSelect(g)}
                                            className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${gender === g
                                                ? 'border-blue-600 bg-blue-600 text-white'
                                                : 'border-gray-200 text-gray-700 hover:border-blue-400'
                                                }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Category */}
                            {gender && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                                        <Shirt className="h-4 w-4 text-blue-600" /> Category
                                    </p>
                                    {loadingCats ? (
                                        <div className="flex items-center gap-2 text-gray-400 py-4">
                                            <Loader2 className="h-4 w-4 animate-spin" /> Loading categories...
                                        </div>
                                    ) : categories.length === 0 ? (
                                        <div className="text-gray-500 py-4 text-sm bg-gray-50 rounded-lg border border-gray-100 px-4 text-center">
                                            No categories found for {gender}.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2">
                                            {categories.map(cat => (
                                                <button
                                                    key={cat.path}
                                                    onClick={() => {
                                                        setSelectedCategory(cat);
                                                        resetResults();
                                                    }}
                                                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all text-left ${selectedCategory?.path === cat.path
                                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                        : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <Shirt className="h-4 w-4 flex-shrink-0" />
                                                    {cat.name}
                                                    <span className="ml-auto text-xs text-gray-400 capitalize">{cat.section}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Selection summary */}
                            {selectedCategory && (
                                <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 border border-blue-100">
                                    <span className="font-medium">Ready:</span> {gender} / {selectedCategory.name}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── STEP 3: Generating ─────────────────────────────── */}
                    {step === 3 && (
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">
                            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-5">
                                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Generating Try-Ons…</h2>
                            <p className="text-gray-500 text-sm mb-6">
                                Running <span className="font-medium text-blue-600">AuraFit</span> in parallel for all{' '}
                                {selectedCategory?.name} items
                            </p>
                            {/* Progress */}
                            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                                    style={{ width: `${generatingProgress}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-2">{generatingProgress}% complete</p>
                        </div>
                    )}

                    {/* ── Navigation ─────────────────────────────────────── */}
                    {step < 3 && (
                        <div className="flex justify-between mt-6">
                            <Button
                                variant="outline"
                                onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}
                                className="px-6"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                {step === 1 ? 'Back' : 'Previous'}
                            </Button>

                            {step === 1 && (
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                                    disabled={!userPreview || analyzing}
                                    onClick={() => setStep(2)}
                                >
                                    Next <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            )}

                            {step === 2 && (
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                                    disabled={!gender || !selectedCategory}
                                    onClick={handleGenerate}
                                >
                                    <Loader2 className={`h-4 w-4 mr-2 ${!gender || !selectedCategory ? 'hidden' : 'hidden'}`} />
                                    Generate Try-Ons <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
