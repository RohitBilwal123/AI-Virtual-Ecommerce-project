import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, RefreshCw, Sparkles, Loader2 } from 'lucide-react';
import { Garment } from '@/types';

interface TryOnPreviewProps {
  resultImage?: string | null;
  selectedGarment?: Garment | null;
  isProcessing?: boolean;
  onChangePhoto: () => void;
  onTryAnother: () => void;
}

export function TryOnPreview({
  resultImage,
  selectedGarment,
  isProcessing = false,
  onChangePhoto,
  onTryAnother,
}: TryOnPreviewProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-card">
      <div className="flex items-start gap-6">
        {/* Preview Thumbnail */}
        <div className="relative w-32 h-40 rounded-lg overflow-hidden bg-muted shrink-0">
          {isProcessing ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/10">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <span className="text-xs text-primary mt-2">Processing...</span>
            </div>
          ) : resultImage ? (
            <img 
              src={resultImage} 
              alt="Try-on result" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Sparkles className="h-8 w-8 mb-2" />
              <span className="text-xs text-center px-2">No try-on yet</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg text-foreground">Current Try-On Preview</h3>
            {isProcessing && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Processing
              </Badge>
            )}
          </div>

          {selectedGarment ? (
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Item:</span>
                <span className="font-medium text-foreground">{selectedGarment.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Category:</span>
                <Badge variant="outline">{selectedGarment.category}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Fit Rating:</span>
                <span className="font-medium text-green-600">Good Match</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select a garment to see the try-on preview
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 shrink-0">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onChangePhoto}
            className="gap-2"
          >
            <Camera className="h-4 w-4" />
            Change Model Photo
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onTryAnother}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Another Item
          </Button>
        </div>
      </div>
    </div>
  );
}
