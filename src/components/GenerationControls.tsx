
import { Button } from "@/components/ui/button";
import { Wand2, Undo2, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GenerationHistory {
  timestamp: string;
  caption: string;
  hashtags: string;
  version: number;
}

interface GenerationControlsProps {
  currentCaption?: string;
  currentHashtags?: string;
  generationHistory: GenerationHistory[];
  onRegenerate: () => void;
  onRestorePrevious: (index: number) => void;
  isRegenerating?: boolean;
}

const GenerationControls = ({
  currentCaption,
  currentHashtags,
  generationHistory,
  onRegenerate,
  onRestorePrevious,
  isRegenerating = false
}: GenerationControlsProps) => {
  const hasContent = currentCaption || currentHashtags;
  const hasPreviousVersions = generationHistory.length > 0;

  return (
    <div className="space-y-3">
      {hasContent && (
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="text-xs h-7"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            {isRegenerating ? "Генерирую..." : "Перегенерировать"}
          </Button>
          
          {hasPreviousVersions && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">Версии:</span>
              {generationHistory.slice(-5).map((item, index) => (
                <Button
                  key={item.timestamp}
                  size="sm"
                  variant="ghost"
                  onClick={() => onRestorePrevious(index)}
                  className="text-xs h-7 px-2"
                  title={`Версия ${item.version} от ${new Date(item.timestamp).toLocaleString('ru-RU')}`}
                >
                  <Undo2 className="h-3 w-3 mr-1" />
                  {item.version}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
      
      {!hasContent && (
        <Button
          size="sm"
          variant="outline"
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="text-xs h-7"
        >
          <Wand2 className="h-3 w-3 mr-1" />
          {isRegenerating ? "Генерирую..." : "Сгенерировать ИИ"}
        </Button>
      )}
    </div>
  );
};

export default GenerationControls;
