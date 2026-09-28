import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { CategoryItem } from '@/lib/api';

export interface TryOnState {
    userFile: File | null;
    userPreview: string | null;
    gender: string | null;
    selectedCategory: CategoryItem | null;
    garmentUrls: string[];
    garmentFilenames: string[];
    tryOnResults: (string | null)[];
    isGenerating: boolean;
}

interface TryOnContextValue extends TryOnState {
    setUserFile: (f: File | null) => void;
    setUserPreview: (url: string | null) => void;
    setGender: (g: string | null) => void;
    setSelectedCategory: (cat: CategoryItem | null) => void;
    setGarments: (urls: string[], names: string[]) => void;
    setTryOnResults: (r: (string | null)[]) => void;
    setIsGenerating: (v: boolean) => void;
    resetResults: () => void;
    resetAll: () => void;
}

const TryOnContext = createContext<TryOnContextValue | null>(null);

export function TryOnProvider({ children }: { children: ReactNode }) {
    const [userFile, setUserFile] = useState<File | null>(null);
    const [userPreview, setUserPreview] = useState<string | null>(null);
    const [gender, setGender] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
    const [garmentUrls, setGarmentUrls] = useState<string[]>([]);
    const [garmentFilenames, setGarmentFilenames] = useState<string[]>([]);
    const [tryOnResults, setTryOnResults] = useState<(string | null)[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const setGarments = useCallback((urls: string[], names: string[]) => {
        setGarmentUrls(urls);
        setGarmentFilenames(names);
    }, []);

    const resetResults = useCallback(() => {
        setGarmentUrls([]);
        setGarmentFilenames([]);
        setTryOnResults([]);
        setIsGenerating(false);
    }, []);

    const resetAll = useCallback(() => {
        setUserFile(null);
        setUserPreview(null);
        setGender(null);
        setSelectedCategory(null);
        resetResults();
    }, [resetResults]);

    return (
        <TryOnContext.Provider value={{
            userFile, userPreview, gender, selectedCategory,
            garmentUrls, garmentFilenames, tryOnResults, isGenerating,
            setUserFile, setUserPreview, setGender, setSelectedCategory,
            setGarments, setTryOnResults, setIsGenerating, resetResults, resetAll,
        }}>
            {children}
        </TryOnContext.Provider>
    );
}

export function useTryOn() {
    const ctx = useContext(TryOnContext);
    if (!ctx) throw new Error('useTryOn must be used inside TryOnProvider');
    return ctx;
}
